import { Conversation, Message } from "@queryflow/database";

import { ConversationRepository } from "../repositories/conversation.repository.js";
import { MessageRepository } from "../repositories/message.repository.js";
import { id } from "zod/v4/locales";
import { promises } from "node:dns";

export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository
  ) {}

  async createConversation(
    userId: string,
    connectionId: string,
    firstQuestion: string
  ): Promise<Conversation> {
    const title = this.generateTitle(firstQuestion);

    return this.conversationRepository.create(userId, connectionId, title);
  }

  async getConversation(conversationId: string, userId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findById(conversationId, userId);

    if (!conversation) {
      throw new Error("Conversation not found.");
    }

    return conversation;
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return this.conversationRepository.findByUser(userId);
  }

  async renameConversation(
    conversationId: string,
    userId: string,
    title: string
  ): Promise<Conversation> {
    await this.getConversation(conversationId, userId);

    return this.conversationRepository.updateTitle(conversationId, title.trim());
  }

  async deleteConversation(conversationId: string, userId: string): Promise<void> {
    await this.getConversation(conversationId, userId);

    await this.conversationRepository.delete(conversationId, userId);
  }

  async getMessages(conversationId: string, userId: string): Promise<Message[]> {
    await this.getConversation(conversationId, userId);

    return this.messageRepository.findByConversation(conversationId);
  }

  private generateTitle(question: string) {
    const normalized = question.trim().replace(/\s+/g, " ");

    if (normalized.length <= 60) {
      return normalized;
    }

    return `${normalized.substring(0, 57)}...`;
  }
}
