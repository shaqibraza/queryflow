import { prisma } from "@queryflow/database";

export class DatabaseConnector {
  async connect() {
    await prisma.$connect();
  }

  async disconnect() {
    await prisma.$disconnect();
  }
}
