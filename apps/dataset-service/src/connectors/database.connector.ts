import { prisma } from "@queryflow/database";

export class DatabaseConnector {
    async connect() {
        await prisma.$connect();
        console.log("Database connected");
    }

    async disconnect() {
        await prisma.$disconnect();
    }
}