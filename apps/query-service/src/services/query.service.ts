import { MetadataService } from "./metadata.service.js";
import { PromptBuilderFactory } from "../ai/factories/prompt-builder.factory.js";
import { GeminiClient } from "../ai/clients/gemini.client.js";
import { MetadataSanitizer } from "../metadata/sanitizer/metadata-sanitizer.js";
import { AnalyzerFactory } from "../query-analyzer/analyzer.factory.js";
import { ExecutorFactory } from "../executors/executor.factory.js";
import { ConnectionClient } from "../clients/connection.client.js";
import { ResponseParserFactory } from "../parser/response-parser.factory.js";
import { ResultFormatterFactory } from "../result-formatter/result-formatter.factory.js";

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

    const response = await this.geminiClient.generate(prompt);

    const parser = ResponseParserFactory.create(connection.databaseType);

    const query = parser.parse(response);

    const analyzer = AnalyzerFactory.create(connection.databaseType);

    const analysis = analyzer.analyze(query as never);

    // WRITE / DDL
    if (analysis.requiresConfirmation) {
      return {
        query,
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

    const result = await executor.execute(query);
    const formatter = ResultFormatterFactory.create(connection.databaseType);

    const formattedResult = formatter.format(result as never);

    return {
      generatedQuery: query,
      analysis,
      result: formattedResult
    };
  }

  async executeQuery(connectionId: string, query: unknown, userId: string) {
    const connection = await this.metadataService.getConnection(connectionId, userId);

    const executor = ExecutorFactory.createExecutor(
      connection.databaseType,
      this.connectionClient,
      connectionId,
      userId
    );

    const result = await executor.execute(query);

    const formatter = ResultFormatterFactory.create(connection.databaseType);

    const formattedResult = formatter.format(result as never);

    return {
      result: formattedResult
    };
  }
}
