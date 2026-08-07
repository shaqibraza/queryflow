import express from "express";
import swaggerUi from "swagger-ui-express";
import { HealthController } from "./controllers/health.controller.js";
import { errorHandler } from "./middleware/error-handler.js";
import { requestLogger } from "./middleware/request-logger.js";
import { createHealthRouter } from "./routes/health.routes.js";
import { HealthService } from "./services/health.service.js";
import { swaggerSpec } from "./utils/swagger.js";

import conversationRoutes from "./routes/conversation.routes.js";

export const createApp = (): express.Express => {
  const app = express();
  const healthService = new HealthService("conversation-service");
  const healthController = new HealthController(healthService);

  app.use(express.json());
  app.use(requestLogger);
  app.use(createHealthRouter(healthController));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(errorHandler);

  app.use("/conversations", conversationRoutes);

  return app;
};
