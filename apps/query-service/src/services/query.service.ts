import { MetadataService } from "./metadata.service.js";
import { PromptBuilderFactory } from "../ai/factories/prompt-builder.factory.js";
import { GeminiClient } from "../ai/clients/gemini.client.js";
import { MetadataSanitizer } from "../metadata/sanitizer/metadata-sanitizer.js";
import { AnalyzerFactory } from "../query-analyzer/analyzer.factory.js";
import { ExecutorFactory } from "../executors/executor.factory.js";
import { ConnectionClient } from "../clients/connection.client.js";

export class QueryService {
  constructor(
    private readonly metadataService: MetadataService,
    private readonly geminiClient: GeminiClient,
    private readonly connectionClient: ConnectionClient
  ) {}

  async processQuery(connectionId: string, question: string, userId: string) {
    // Get connection details
    const connection = await this.metadataService.getConnection(connectionId, userId);

    // Collect complete metadata
    const metadata = MetadataSanitizer.sanitize(
      await this.metadataService.collectMetadata(connectionId, userId)
    );

    // Select prompt builder
    const promptBuilder = PromptBuilderFactory.create(connection.databaseType);

    // Build prompt
    const prompt = promptBuilder.build({
      question,
      metadata
    });

    const sql = await this.geminiClient.generate(prompt);

    const analyzer = AnalyzerFactory.create(connection.databaseType);

    const analysis = analyzer.analyze(sql);

    // WRITE / DDL
    if (analysis.requiresConfirmation) {
      return {
        sql,
        analysis
      };
    }

    // READ
    const executor = ExecutorFactory.createExecutor(
      connection.databaseType,
      this.connectionClient,
      connectionId,
      userId
    );

    const result = await executor.execute(sql);

    return {
      sql,
      analysis,
      result
    };
  }
}
