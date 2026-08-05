import { Router } from "express";

import { ConnectionClient } from "../clients/connection.client.js";
import { MetadataController } from "../controllers/metadata.controller.js";
import { MetadataService } from "../services/metadata.service.js";

const router = Router();

const connectionClient = new ConnectionClient();
const metadataService = new MetadataService(connectionClient);
const metadataController = new MetadataController(metadataService);

router.get("/:connectionId/tables", metadataController.getTables);

router.get("/:connectionId/tables/:tableName/columns", metadataController.getColumns);

router.get("/:connectionId/relations", metadataController.getRelations);

router.get("/:connectionId/schemas", metadataController.getSchemas);

router.get("/:connectionId/database-info", metadataController.getDatabaseInfo);

router.get("/:connectionId", metadataController.collectMetadata);

export default router;
