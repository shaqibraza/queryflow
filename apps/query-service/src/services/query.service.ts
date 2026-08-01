import { MetadataService } from "./metadata.service.js";

import { PromptBuilderFactory } from "../ai/factories/prompt-builder.factory.js";

export class QueryService {
  constructor(private readonly metadataService: MetadataService) {}

  async processQuery(connectionId: string, question: string, userId: string) {
    // Get connection details
    const connection = await this.metadataService.getConnection(connectionId, userId);

    // Collect complete metadata
    const metadata = await this.metadataService.collectMetadata(connectionId, userId);

    // Select prompt builder
    const promptBuilder = PromptBuilderFactory.create(connection.data.databaseType);

    // Build prompt
    const prompt = promptBuilder.build({
      question,
      metadata
    });

    return {
      prompt
    };
  }
}
