import { Router } from "express";
import { ConnectionController } from "../controllers/connection.controller.js";

export function createConnectionRouter(controller: ConnectionController) {
  const router = Router();

  router.post("/", controller.createConnection);

  router.get("/", controller.getConnections);

  router.get("/:id", controller.getConnection);

  router.delete("/:id", controller.deleteConnection);

  router.post("/:id/test", controller.testConnection);

  router.get("/:id/tables", controller.getTables);

  router.get("/:id/tables/:table/columns", controller.getColumns);

  return router;
}
