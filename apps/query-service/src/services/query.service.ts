import { MetadataService } from "../services/metadata.service.js";

export class QueryService {
  constructor(private readonly metadataService: MetadataService) {}

  async processQuery(connectionId: string, question: string, userId: string) {
    const tables = await this.metadataService.getTables(connectionId, userId);

    const relations = await this.metadataService.getRelations(connectionId, userId);

    return {
      question,
      tables: tables.data,
      relations: relations.data
    };
  }
}
