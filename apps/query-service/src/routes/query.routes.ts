import { Router } from "express";

import { ConnectionClient } from "../clients/connection.client.js";

import { MetadataService } from "../services/metadata.service.js";
import { QueryService } from "../services/query.service.js";

import { QueryController } from "../controllers/query.controller.js";

const router = Router();

const connectionClient = new ConnectionClient();

const metadataService = new MetadataService(connectionClient);

const queryService = new QueryService(metadataService);

const queryController = new QueryController(queryService);

router.post("/", queryController.query);

export default router;
