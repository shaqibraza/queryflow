import express from "express";
import swaggerUi from "swagger-ui-express";

import { HealthController } from "./controllers/health.controller.js";
import { DatasetController } from "./controllers/dataset.controller.js";

import { errorHandler } from "./middleware/error-handler.js";
import { requestLogger } from "./middleware/request-logger.js";

import { createHealthRouter } from "./routes/health.routes.js";
import { createDatasetRouter } from "./routes/dataset.routes.js";

import { HealthService } from "./services/health.service.js";
import { DatasetService } from "./services/dataset.service.js";

import { DatasetRepository } from "./repositories/dataset.repository.js";

import { swaggerSpec } from "./utils/swagger.js";

export const createApp = (): express.Express => {
  const app = express();

  // Services
  const healthService = new HealthService("dataset-service");
  const datasetRepository = new DatasetRepository();
  const datasetService = new DatasetService(datasetRepository);

  // Controllers
  const healthController = new HealthController(healthService);
  const datasetController = new DatasetController(datasetService);

  // Middlewares
  app.use(express.json());
  app.use(requestLogger);

  // Routes
  app.use(createHealthRouter(healthController));
  app.use(createDatasetRouter(datasetController));

  // Swagger
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Global Error Handler (Always Last)
  app.use(errorHandler);

  return app;
};
