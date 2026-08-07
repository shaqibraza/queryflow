import { Router } from "express";
import { prisma } from "@queryflow/database";
import { ConversationRepository } from "../repositories/conversation.repository.js";
import { MessageRepository } from "../repositories/message.repository.js";
import { ConversationService } from "../services/conversation.service.js";
import { ConversationController } from "../controllers/conversation.controller.js";

const router = Router();

const conversationRepository = new ConversationRepository(prisma);
const messageRepository = new MessageRepository(prisma);

const conversationService = new ConversationService(conversationRepository, messageRepository);

const conversationController = new ConversationController(conversationService);

router.post("/", conversationController.create);
router.get("/", conversationController.list);
router.get("/:id/messages", conversationController.getMessage);
router.patch("/:id", conversationController.rename);
router.delete("/:id", conversationController.delete);
router.post("/:id/messages/user", conversationController.saveUserMessage);

router.post("/:id/messages/assistant", conversationController.saveAssistantMessage);

export default router;
