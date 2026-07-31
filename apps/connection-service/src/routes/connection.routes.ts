import { Router } from "express";
import { ConnectionController } from "../controllers/connection.controller.js";

export function createConnectionRouter(controller: ConnectionController) {
  const router = Router();

  router.post("/", controller.createConnection);

  router.get("/", controller.getConnections);

  router.get("/:id", controller.getConnection);

  router.delete("/:id", controller.deleteConnection);

  return router;
}
