import { Router } from "express";
import { ConnectionController } from "../controllers/connection.controller.js";

export function createConnectionRouter(controller: ConnectionController) {
  const router = Router();

  router.post("/", controller.createConnection);

  router.get("/", controller.getConnections);

  router.get("/:id", controller.getConnection);

  router.patch("/:id", controller.updateConnection);

  router.delete("/:id", controller.deleteConnection);

  router.post("/:id/test", controller.testConnection);

  router.get("/:id/tables", controller.getTables);

  router.get("/:id/tables/:table/columns", controller.getColumns);

  router.get("/:id/tables/:table/primary-key", controller.getPrimaryKeys);

  router.get("/:id/relations", controller.getRelations);

  router.get("/:id/indexes", controller.getIndexes);

  router.get("/:id/views", controller.getViews);

  router.get("/:id/functions", controller.getFunctions);

  router.get("/:id/info", controller.getDatabaseInfo);

  router.get("/:id/schemas", controller.getSchemas);

  return router;
}
