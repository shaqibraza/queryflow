import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { HealthController } from "./controllers/health.controller.js";
import { errorHandler } from "./middleware/error-handler.js";
import { requestLogger } from "./middleware/request-logger.js";
import { createHealthRouter } from "./routes/health.routes.js";
import { HealthService } from "./services/health.service.js";
import { swaggerSpec } from "./utils/swagger.js";

export const createApp = (): express.Express => {
  const app = express();
  const healthService = new HealthService("gateway");
  const healthController = new HealthController(healthService);

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);
  app.use(rateLimit({ windowMs: 60_000, limit: 120 }));
  app.use(createHealthRouter(healthController));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(errorHandler);

  return app;
};
