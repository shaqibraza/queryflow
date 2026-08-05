import { Request, Response, NextFunction } from "express";
import { MetadataService } from "../services/metadata.service.js";

export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  getTables = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers["x-user-id"];
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const connectionId = req.params.connectionId;
      if (!connectionId || typeof connectionId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Connection ID is required"
        });
      }

      const result = await this.metadataService.getTables(connectionId, userId);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getColumns = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.header("x-user-id");
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const connectionId = req.params.connectionId;
      if (!connectionId || typeof connectionId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Connection ID is required"
        });
      }

      const tableName = req.params.tableName;
      if (!tableName || typeof tableName !== "string") {
        return res.status(400).json({
          success: false,
          message: "Table name is required"
        });
      }

      const result = await this.metadataService.getColumns(connectionId, tableName, userId);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getRelations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.header("x-user-id");
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const connectionId = req.params.connectionId;
      if (!connectionId || typeof connectionId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Connection ID is required"
        });
      }

      const result = await this.metadataService.getRelations(connectionId, userId);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getDatabaseInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.header("x-user-id");
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const connectionId = req.params.connectionId;
      if (!connectionId || typeof connectionId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Connection ID is required"
        });
      }

      const result = await this.metadataService.getDatabaseInfo(connectionId, userId);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getSchemas = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.header("x-user-id");
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const connectionId = req.params.connectionId;
      if (!connectionId || typeof connectionId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Connection ID is required"
        });
      }

      const result = await this.metadataService.getSchemas(connectionId, userId);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  collectMetadata = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.header("x-user-id");

      if (!userId || typeof userId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const connectionId = req.params.connectionId;

      if (!connectionId || typeof connectionId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Connection ID is required"
        });
      }

      const metadata = await this.metadataService.collectMetadata(connectionId, userId);

      return res.status(200).json({
        success: true,
        data: metadata
      });
    } catch (error) {
      next(error);
    }
  };
}
