import { Router } from 'express';
import { DatasetController } from '../controllers/dataset.controller.js';


export const createDatasetRouter = (
    datasetController: DatasetController
): Router => {
    const router = Router();

    router.post("/datasets", datasetController.createDataset);

    return router;
}