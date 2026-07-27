import { Router } from "express";
import type { HealthController } from "../controllers/health.controller.js";

export const createHealthRouter = (healthController: HealthController): Router => {
  const router = Router();

  /**
   * @openapi
   * /health:
   *   get:
   *     summary: Check service health
   *     responses:
   *       200:
   *         description: Service is healthy
   */
  router.get("/health", healthController.show);

  return router;
};
