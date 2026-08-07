import { NextFunction, Request, Response } from "express";

import { ConversationService } from "../services/conversation.service.js";

import { createConversationSchema } from "../validators/create-conversation.validator.js";
import { renameConversationSchema } from "../validators/rename-conversation.validator.js";
import { conversationIdSchema } from "../validators/conversation-id.validator.js";
import { createUserMessageSchema } from "../validators/create-user-message.validator.js";
import { createAssistantMessageSchema } from "../validators/create-assistant-message.validator.js";

export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = createConversationSchema.parse(req.body);

      const userId = req.header("x-user-id");
      if (!userId || typeof userId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const conversation = await this.conversationService.createConversation(
        userId,
        body.connectionId,
        body.firstQuestion
      );

      return res.status(201).json({
        success: true,
        data: conversation
      });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.header("x-user-id");
      if (!userId || typeof userId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const conversation = await this.conversationService.getUserConversations(userId);

      return res.status(200).json({
        success: true,
        data: conversation
      });
    } catch (error) {
      next(error);
    }
  };

  getMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = conversationIdSchema.parse(req.params);

      const userId = req.header("x-user-id");
      if (!userId || typeof userId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const messages = await this.conversationService.getMessages(params.id, userId);

      return res.status(200).json({
        success: true,
        data: messages
      });
    } catch (error) {
      next(error);
    }
  };

  rename = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = conversationIdSchema.parse(req.params);

      const body = renameConversationSchema.parse(req.body);

      const userId = req.header("x-user-id");
      if (!userId || typeof userId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const conversation = await this.conversationService.renameConversation(
        params.id,
        userId,
        body.title
      );

      return res.status(200).json({
        success: true,
        data: conversation
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = conversationIdSchema.parse(req.params);

      const userId = req.header("x-user-id");
      if (!userId || typeof userId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      await this.conversationService.deleteConversation(params.id, userId);

      return res.status(200).json({
        success: true,
        message: "Conversation Delete Successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  saveUserMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = conversationIdSchema.parse(req.params);
      const body = createUserMessageSchema.parse(req.body);

      const userId = req.header("x-user-id");
      if (!userId || typeof userId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const message = await this.conversationService.saveUserMessage(
        params.id,
        userId,
        body.question
      );

      return res.status(201).json({
        success: true,
        data: message
      });
    } catch (error) {
      next(error);
    }
  };

  saveAssistantMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = conversationIdSchema.parse(req.params);
      const body = createAssistantMessageSchema.parse(req.body);

      const userId = req.header("x-user-id");
      if (!userId || typeof userId !== "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const message = await this.conversationService.saveAssistantMessage(params.id, userId, body);

      return res.status(201).json({
        success: true,
        data: message
      });
    } catch (error) {
      next(error);
    }
  };
}
