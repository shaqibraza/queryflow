import { prisma } from "@queryflow/database";

export class DatasetRepository {
  async create(data: {
    name: string;
    description?: string;
    ownerId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    storageKey: string;
  }) {
    return prisma.dataset.create({
      data
    });
  }
}
