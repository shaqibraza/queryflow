import { GeminiClient } from "../ai/clients/gemini.client.js";
import { PromptBuilderFactory } from "../ai/factories/prompt-builder.factory.js";
import { ConnectionClient } from "../clients/connection.client.js";
import { ConversationClient } from "../clients/conversation.client.js";
import { ExecutorFactory } from "../executors/executor.factory.js";
import { MetadataSanitizer } from "../metadata/sanitizer/metadata-sanitizer.js";
import { ResponseParserFactory } from "../parser/response-parser.factory.js";
import { AnalyzerFactory } from "../query-analyzer/analyzer.factory.js";
import { ResultFormatterFactory } from "../result-formatter/result-formatter.factory.js";
import { MetadataService } from "./metadata.service.js";

export class QueryService {
  constructor(
    private readonly metadataService: MetadataService,
    private readonly geminiClient: GeminiClient,
    private readonly connectionClient: ConnectionClient,
    private readonly conversationClient: ConversationClient
  ) {}

  async processQuery(
    connectionId: string,
    question: string,
    userId: string,
    conversationId?: string
  ) {
    let activeConversationId = conversationId;

    // Create conversation if this is a new chat
    if (!activeConversationId) {
      const conversation = await this.conversationClient.createConversation(
        connectionId,
        question,
        userId
      );

      activeConversationId = conversation.id;
    }

    // Save user message
    await this.conversationClient.saveUserMessage(activeConversationId, question, userId);

    // Load connection
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

    // Generate SQL
    const response = await this.geminiClient.generate(prompt);

    const parser = ResponseParserFactory.create(connection.databaseType);

    const query = parser.parse(response) as string;

    // AI couldn't generate query
    if (query === "CANNOT_GENERATE_QUERY") {
      const analysis = {
        type: "INVALID",
        requiresConfirmation: false,
        firstKeyword: "CANNOT_GENERATE_QUERY"
      };

      await this.conversationClient.saveAssistantMessage(
        activeConversationId,
        {
          reply: "Unable to generate a valid query from the available metadata.",
          analysis
        },
        userId
      );

      return {
        conversationId: activeConversationId,
        generatedQuery: null,
        analysis,
        message: "Unable to generate a valid query from the available metadata."
      };
    }

    // Analyze generated query
    const analyzer = AnalyzerFactory.create(connection.databaseType);

    const analysis = analyzer.analyze(query as never);

    // WRITE / DDL Query
    if (analysis.requiresConfirmation) {
      await this.conversationClient.saveAssistantMessage(
        activeConversationId,
        {
          reply: "Query generated successfully.",
          generatedQuery: query,
          analysis
        },
        userId
      );

      return {
        conversationId: activeConversationId,
        generatedQuery: query,
        analysis
      };
    }

    // READ Query
    const executor = ExecutorFactory.createExecutor(
      connection.databaseType,
      this.connectionClient,
      connectionId,
      userId
    );

    const result = await executor.execute(query);

    const formatter = ResultFormatterFactory.create(connection.databaseType);

    const formattedResult = formatter.format(result as never);

    await this.conversationClient.saveAssistantMessage(
      activeConversationId,
      {
        reply: "Query generated successfully.",
        generatedQuery: query,
        analysis,
        result: formattedResult
      },
      userId
    );

    return {
      conversationId: activeConversationId,
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

  async getConversations(userId: string) {
    return this.conversationClient.getConversations(userId);
  }

  async getConversationMessages(conversationId: string, userId: string) {
    return this.conversationClient.getMessages(conversationId, userId);
  }

  async renameConversation(conversationId: string, title: string, userId: string) {
    return this.conversationClient.renameConversation(conversationId, title, userId);
  }

  async deleteConversation(conversationId: string, userId: string) {
    await this.conversationClient.deleteConversation(conversationId, userId);
  }
}
