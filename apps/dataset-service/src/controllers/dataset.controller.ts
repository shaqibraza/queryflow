import { Request, Response, NextFunction } from "express";
import { DatasetService } from "../services/dataset.service.js";

export class DatasetController {
  constructor(private readonly datasetService = new DatasetService()) {}

  createDataset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.header("x-user-id");
      if (!ownerId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const dataset = await this.datasetService.createDataset({
        ...req.body,
        ownerId,
        fileName: "sample.pdf",
        fileType: "application/pdf",
        fileSize: 1024,
        storageKey: "sample.pdf"
      });

      return res.status(201).json({
        success: true,
        data: dataset
      });
    } catch (error) {
      console.error("CREATE DATASET ERROR:");
      console.error(error);

      return res.status(500).json({
        error
      });
    }
  };
}
