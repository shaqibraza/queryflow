import { Router } from "express";

import { ConnectionClient } from "../clients/connection.client.js";

import { MetadataService } from "../services/metadata.service.js";
import { QueryService } from "../services/query.service.js";

import { QueryController } from "../controllers/query.controller.js";
import { GeminiClient } from "../ai/clients/gemini.client.js";

const router = Router();

const connectionClient = new ConnectionClient();

const metadataService = new MetadataService(connectionClient);

const geminiClient = new GeminiClient();

const queryService = new QueryService(metadataService, geminiClient, connectionClient);

const queryController = new QueryController(queryService);

router.post("/", queryController.query);

router.post("/execute", queryController.execute);

export default router;
