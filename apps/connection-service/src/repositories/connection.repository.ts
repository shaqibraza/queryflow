import { prisma } from "@queryflow/database";
import { DatabaseConnection, Prisma } from "@queryflow/database";

export class ConnectionRepository {
  async create(data: Prisma.DatabaseConnectionCreateInput): Promise<DatabaseConnection> {
    return prisma.databaseConnection.create({
      data
    });
  }

  async findById(id: string): Promise<DatabaseConnection | null> {
    return prisma.databaseConnection.findUnique({
      where: {
        id
      }
    });
  }

  async findByIdAndOwner(id: string, ownerId: string): Promise<DatabaseConnection | null> {
    return prisma.databaseConnection.findFirst({
      where: {
        id,
        ownerId
      }
    });
  }

  async findByOwner(ownerId: string): Promise<DatabaseConnection[]> {
    return prisma.databaseConnection.findMany({
      where: {
        ownerId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async delete(id: string): Promise<DatabaseConnection> {
    return prisma.databaseConnection.delete({
      where: {
        id
      }
    });
  }

  async update(
    id: string,
    data: Prisma.DatabaseConnectionUpdateInput
  ): Promise<DatabaseConnection> {
    return prisma.databaseConnection.update({
      where: {
        id
      },
      data
    });
  }
}
