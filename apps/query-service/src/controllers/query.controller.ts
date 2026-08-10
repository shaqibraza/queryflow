import { Request, Response, NextFunction } from "express";

import { QueryService } from "../services/query.service.js";
import { querySchema } from "../validators/query.validator.js";
import { executeQuerySchema } from "../validators/execute-query.validator.js";

export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  query = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = querySchema.parse(req.body);
      const userId = req.header("x-user-id");
      if (!userId || typeof userId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const result = await this.queryService.processQuery(
        body.connectionId,
        body.question,
        userId,
        body.conversationId
      );

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  execute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = executeQuerySchema.parse(req.body);

      const userId = req.header("x-user-id");

      if (!userId || typeof userId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const result = await this.queryService.executeQuery(body.connectionId, body.query, userId);

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getConversations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.header("x-user-id");
      if (!userId || typeof userId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const conversations = await this.queryService.getConversations(userId);

      return res.status(200).json({
        success: true,
        data: conversations
      });
    } catch (error) {
      next(error);
    }
  };

  getConversationMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversationId = req.params.id;
      if (!conversationId || typeof conversationId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid Conversation ID"
        });
      }

      const userId = req.header("x-user-id");
      if (!userId || typeof userId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const messages = await this.queryService.getConversationMessages(conversationId, userId);

      return res.status(200).json({
        success: true,
        data: messages
      });
    } catch (error) {
      next(error);
    }
  };

  renameConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversationId = req.params.id;

      if (!conversationId || typeof conversationId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid Conversation ID"
        });
      }

      const userId = req.header("x-user-id");

      if (!userId || typeof userId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const title = req.body?.title;

      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Conversation title is required"
        });
      }

      const conversation = await this.queryService.renameConversation(
        conversationId,
        title.trim(),
        userId
      );

      return res.status(200).json({
        success: true,
        data: conversation
      });
    } catch (error) {
      next(error);
    }
  };

  deleteConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversationId = req.params.id;

      if (!conversationId || typeof conversationId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid Conversation ID"
        });
      }

      const userId = req.header("x-user-id");

      if (!userId || typeof userId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      await this.queryService.deleteConversation(conversationId, userId);

      return res.status(200).json({
        success: true,
        message: "Conversation deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  };
}
