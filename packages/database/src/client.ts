import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!
});

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter
  });
const x = prisma.dataset;
console.log("User Delegate:", prisma.user);
console.log("Refresh Delegate:", prisma.refreshToken);
console.log("Dataset Delegate:", (prisma as any).dataset);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
