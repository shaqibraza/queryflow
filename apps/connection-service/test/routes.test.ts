import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { ConnectionController } from "../src/controllers/connection.controller.js";
import { createConnectionRouter } from "../src/routes/connection.routes.js";

const createTestApp = () => {
  const service = {
    createConnection: vi.fn().mockResolvedValue({ id: "connection-1", name: "Shop" }),
    getConnections: vi.fn().mockResolvedValue([]),
    getConnection: vi.fn().mockResolvedValue({ id: "connection-1", name: "Shop" }),
    updateConnection: vi.fn().mockResolvedValue({ id: "connection-1", name: "Renamed shop" }),
    deleteConnection: vi.fn().mockResolvedValue(undefined),
    testConnection: vi.fn().mockResolvedValue({ success: true, message: "Connected" }),
    getTables: vi.fn().mockResolvedValue([{ schema: "public", name: "users", type: "BASE TABLE" }]),
    getColumns: vi
      .fn()
      .mockResolvedValue([{ name: "id", type: "uuid", nullable: false, default: null }]),
    getPrimaryKeys: vi.fn().mockResolvedValue(["id"]),
    getRelations: vi.fn().mockResolvedValue([]),
    getIndexes: vi.fn().mockResolvedValue([]),
    getViews: vi.fn().mockResolvedValue([]),
    getFunctions: vi.fn().mockResolvedValue([]),
    getDatabaseInfo: vi.fn().mockResolvedValue({
      database: "shop",
      version: "PostgreSQL 16",
      size: "1 MB"
    }),
    getSchemas: vi.fn().mockResolvedValue(["public"])
  };
  const app = express();

  app.use(express.json());
  app.use("/connections", createConnectionRouter(new ConnectionController(service as never)));

  return { app, service };
};

describe("connection routes", () => {
  it("serves every implemented connection-management and metadata endpoint", async () => {
    const { app, service } = createTestApp();
    const ownedRequest = (method: "get" | "post" | "patch" | "delete", path: string) =>
      request(app)[method](path).set("x-user-id", "user-1");

    await ownedRequest("post", "/connections")
      .send({
        name: "Shop",
        databaseType: "POSTGRESQL",
        databaseUrl: "postgresql://user:password@localhost:5432/shop"
      })
      .expect(201);
    await ownedRequest("get", "/connections").expect(201);
    await ownedRequest("get", "/connections/connection-1").expect(201);
    await ownedRequest("patch", "/connections/connection-1")
      .send({ name: "Renamed shop" })
      .expect(200);
    await ownedRequest("delete", "/connections/connection-1").expect(200);
    await ownedRequest("post", "/connections/connection-1/test").expect(200);
    await ownedRequest("get", "/connections/connection-1/tables").expect(200);
    await ownedRequest("get", "/connections/connection-1/tables/users/columns").expect(200);
    await ownedRequest("get", "/connections/connection-1/tables/users/primary-key").expect(200);
    await ownedRequest("get", "/connections/connection-1/relations").expect(200);
    await ownedRequest("get", "/connections/connection-1/indexes").expect(200);
    await ownedRequest("get", "/connections/connection-1/views").expect(200);
    await ownedRequest("get", "/connections/connection-1/functions").expect(200);
    await ownedRequest("get", "/connections/connection-1/info").expect(200);
    await ownedRequest("get", "/connections/connection-1/schemas").expect(200);

    expect(service.getColumns).toHaveBeenCalledWith("connection-1", "user-1", "users");
    expect(service.getPrimaryKeys).toHaveBeenCalledWith("connection-1", "user-1", "users");
    expect(service.updateConnection).toHaveBeenCalledWith("connection-1", "user-1", {
      name: "Renamed shop"
    });
  });

  it("requires an owner header for metadata endpoints", async () => {
    const { app } = createTestApp();

    await request(app).get("/connections/connection-1/indexes").expect(401);
  });
});
