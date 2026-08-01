import { MetadataService } from "./metadata.service.js";
import { PromptBuilderFactory } from "../ai/factories/prompt-builder.factory.js";
import { GeminiClient } from "../ai/clients/gemini.client.js";
import { MetadataSanitizer } from "../metadata/sanitizer/metadata-sanitizer.js";

export class QueryService {
  constructor(
    private readonly metadataService: MetadataService,
    private readonly geminiClient: GeminiClient
  ) {}

  async processQuery(connectionId: string, question: string, userId: string) {
    // Get connection details
    const connection = await this.metadataService.getConnection(connectionId, userId);

    // Collect complete metadata
    const metadata = MetadataSanitizer.sanitize(
      await this.metadataService.collectMetadata(connectionId, userId)
    );

    // Select prompt builder
    const promptBuilder = PromptBuilderFactory.create(connection.data.databaseType);

    // Build prompt
    const prompt = promptBuilder.build({
      question,
      metadata
    });

    const sql = await this.geminiClient.generate(prompt);

    return {
      sql
    };
  }
}
