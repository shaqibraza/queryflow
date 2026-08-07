import { Message, MessageRole, PrismaClient } from "@queryflow/database";

export class MessageRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createUserMessage(conversationId: string, question: string): Promise<Message> {
    return this.prisma.message.create({
      data: {
        conversationId,
        role: MessageRole.USER,
        question
      }
    });
  }

  async createAssistantMessage(
    conversationId: string,
    data: {
      reply: string;
      generatedQuery: string;
      analysis?: unknown;
      result?: unknown;
    }
  ): Promise<Message> {
    return this.prisma.message.create({
      data: {
        conversationId,
        role: MessageRole.ASSISTANT,
        reply: data.reply,
        generatedQuery: data.generatedQuery,
        analysis: data.analysis as any,
        result: data.result as any
      }
    });
  }

  async findByConversation(conversationId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        conversationId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async deleteByConversation(conversationId: string): Promise<void> {
    await this.prisma.message.deleteMany({
      where: {
        conversationId
      }
    });
  }

  async count(conversationId: string): Promise<number> {
    return this.prisma.message.count({
      where: {
        conversationId
      }
    });
  }
}
