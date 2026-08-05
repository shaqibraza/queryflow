import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import { HealthController } from "./controllers/health.controller.js";
import { ConnectionController } from "./controllers/connection.controller.js";

import { errorHandler } from "./middleware/error-handler.js";
import { requestLogger } from "./middleware/request-logger.js";

import { createHealthRouter } from "./routes/health.routes.js";
import { createConnectionRouter } from "./routes/connection.routes.js";

import { HealthService } from "./services/health.service.js";
import { ConnectionService } from "./services/connection.service.js";

import { ConnectionRepository } from "./repositories/connection.repository.js";

import { swaggerSpec } from "./utils/swagger.js";

export const createApp = (): express.Express => {
  const app = express();

  // Repositories
  const connectionRepository = new ConnectionRepository();

  // Services
  const healthService = new HealthService("connection-service");

  const connectionService = new ConnectionService(connectionRepository);

  // Controllers
  const healthController = new HealthController(healthService);

  const connectionController = new ConnectionController(connectionService);

  // cors
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true
    })
  );

  // Middlewares
  app.use(express.json());
  app.use(requestLogger);

  // Routes
  app.use(createHealthRouter(healthController));

  app.use("/connections", createConnectionRouter(connectionController));

  // Swagger
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
