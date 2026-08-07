import { Conversation, PrismaClient } from "@queryflow/database";

export class ConversationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(userId: string, connectionId: string, title: string): Promise<Conversation> {
    return this.prisma.conversation.create({
      data: {
        userId,
        connectionId,
        title
      }
    });
  }

  async findById(id: string, userId: string): Promise<Conversation | null> {
    return this.prisma.conversation.findFirst({
      where: {
        id,
        userId
      }
    });
  }

  async findByUser(userId: string): Promise<Conversation[]> {
    return this.prisma.conversation.findMany({
      where: {
        userId
      },
      orderBy: {
        updatedAt: "desc"
      }
    });
  }

  async updateTitle(id: string, title: string): Promise<Conversation> {
    return this.prisma.conversation.update({
      where: {
        id
      },
      data: {
        title
      }
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.conversation.delete({
      where: {
        id
      }
    });
  }

  async exists(id: string, userId: string): Promise<boolean> {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id
      },
      select: {
        id: true
      }
    });

    return conversation !== null;
  }
}
