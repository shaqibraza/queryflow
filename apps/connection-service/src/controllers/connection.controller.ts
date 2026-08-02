import { Request, Response, NextFunction } from "express";
import { ConnectionService } from "../services/connection.service.js";
import {
  createConnectionSchema,
  updateConnectionSchema
} from "../validators/connection.validator.js";

export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  createConnection = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = createConnectionSchema.parse(req.body);

      const ownerId = req.header("x-user-id");
      if (!ownerId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const connection = await this.connectionService.createConnection({
        ...body,
        ownerId
      });

      return res.status(201).json({
        success: true,
        data: connection
      });
    } catch (error) {
      next(error);
    }
  };

  getConnections = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.header("x-user-id");
      if (typeof ownerId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const connections = await this.connectionService.getConnections(ownerId);

      return res.status(201).json({
        success: true,
        data: connections
      });
    } catch (error) {
      next(error);
    }
  };

  getConnection = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.header("x-user-id");
      if (typeof ownerId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const { id } = req.params;
      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid connection ID"
        });
      }

      const connection = await this.connectionService.getConnection(id, ownerId);

      if (!connection) {
        return res.status(404).json({
          success: false,
          message: "Connection not found"
        });
      }

      return res.status(201).json({
        success: true,
        data: connection
      });
    } catch (error) {
      next(error);
    }
  };

  updateConnection = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.header("x-user-id");
      const { id } = req.params;

      if (typeof ownerId !== "string") {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      if (typeof id !== "string") {
        return res.status(400).json({ success: false, message: "Invalid connection ID" });
      }

      const body = updateConnectionSchema.parse(req.body);
      const connection = await this.connectionService.updateConnection(id, ownerId, body);

      return res.status(200).json({
        success: true,
        data: connection
      });
    } catch (error) {
      next(error);
    }
  };

  deleteConnection = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.header("x-user-id");
      if (typeof ownerId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const { id } = req.params;
      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid connection ID"
        });
      }

      await this.connectionService.deleteConnection(id, ownerId);

      return res.status(200).json({
        success: true,
        message: "Connection deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  testConnection = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.header("x-user-id");
      if (typeof ownerId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const { id } = req.params;
      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid connection ID"
        });
      }

      const result = await this.connectionService.testConnection(id, ownerId);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getTables = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.header("x-user-id");
      if (typeof ownerId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const { id } = req.params;
      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid connection ID"
        });
      }

      const tables = await this.connectionService.getTables(id, ownerId);

      return res.status(200).json({
        success: true,
        data: tables
      });
    } catch (error) {
      next(error);
    }
  };

  getColumns = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.header("x-user-id");
      const { id, table } = req.params;

      if (typeof ownerId !== "string") {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      if (typeof id !== "string" || typeof table !== "string" || !table.trim()) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid connection or table name" });
      }

      const columns = await this.connectionService.getColumns(id, ownerId, table);

      return res.status(200).json({
        success: true,
        data: columns
      });
    } catch (error) {
      next(error);
    }
  };

  getPrimaryKeys = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.header("x-user-id");
      const { id, table } = req.params;

      if (typeof ownerId !== "string") {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      if (typeof id !== "string" || typeof table !== "string" || !table.trim()) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid connection or table name" });
      }

      const primaryKeys = await this.connectionService.getPrimaryKeys(id, ownerId, table);

      return res.status(200).json({
        success: true,
        data: primaryKeys
      });
    } catch (error) {
      next(error);
    }
  };

  getRelations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.header("x-user-id");
      const { id } = req.params;

      if (typeof ownerId !== "string") {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      if (typeof id !== "string") {
        return res.status(400).json({ success: false, message: "Invalid connection ID" });
      }

      const relations = await this.connectionService.getRelations(id, ownerId);

      return res.status(200).json({
        success: true,
        data: relations
      });
    } catch (error) {
      next(error);
    }
  };

  getIndexes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.header("x-user-id");
      const { id } = req.params;

      if (typeof ownerId !== "string") {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      if (typeof id !== "string") {
        return res.status(400).json({ success: false, message: "Invalid connection ID" });
      }

      const indexes = await this.connectionService.getIndexes(id, ownerId);

      return res.status(200).json({
        success: true,
        data: indexes
      });
    } catch (error) {
      next(error);
    }
  };

  getViews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.header("x-user-id");
      const { id } = req.params;

      if (typeof ownerId !== "string") {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      if (typeof id !== "string") {
        return res.status(400).json({ success: false, message: "Invalid connection ID" });
      }

      const views = await this.connectionService.getViews(id, ownerId);

      return res.status(200).json({
        success: true,
        data: views
      });
    } catch (error) {
      next(error);
    }
  };

  getFunctions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.header("x-user-id");
      const { id } = req.params;

      if (typeof ownerId !== "string") {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      if (typeof id !== "string") {
        return res.status(400).json({ success: false, message: "Invalid connection ID" });
      }

      const functions = await this.connectionService.getFunctions(id, ownerId);

      return res.status(200).json({
        success: true,
        data: functions
      });
    } catch (error) {
      next(error);
    }
  };

  getDatabaseInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.header("x-user-id");
      const { id } = req.params;

      if (typeof ownerId !== "string") {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      if (typeof id !== "string") {
        return res.status(400).json({ success: false, message: "Invalid connection ID" });
      }

      const info = await this.connectionService.getDatabaseInfo(id, ownerId);

      return res.status(200).json({
        success: true,
        data: info
      });
    } catch (error) {
      next(error);
    }
  };

  getSchemas = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.header("x-user-id");
      const { id } = req.params;

      if (typeof ownerId !== "string") {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      if (typeof id !== "string") {
        return res.status(400).json({ success: false, message: "Invalid connection ID" });
      }

      const schemas = await this.connectionService.getSchemas(id, ownerId);

      return res.status(200).json({
        success: true,
        data: schemas
      });
    } catch (error) {
      next(error);
    }
  };

  executeQuery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.header("x-user-id");
      if (typeof userId !== "string") {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = req.params;
      if (typeof id !== "string") {
        return res.status(400).json({ success: false, message: "Invalid connection ID" });
      }

      const query = req.body.query;
      console.log("BODY:", req.body);
      console.log("QUERY:", query);
      console.log("TYPE:", typeof query);

      const isValid =
        (typeof query === "string" && query.trim().length > 0) ||
        (typeof query === "object" && query !== null);

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid query"
        });
      }

      const result = await this.connectionService.executeQuery(id, userId, query);

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}
