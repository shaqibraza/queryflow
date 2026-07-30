import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app.js";

describe("GET /health", () => {
  it("returns a healthy service response", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: "API Gateway is running"
    });
  });
});
