import { Request, Response, NextFunction } from "express";
import { ConnectionService } from "../services/connection.service.js";
import { createConnectionSchema } from "../validators/connection.validator.js";
import { success } from "zod/v4";

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
}
