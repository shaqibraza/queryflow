import { queryApi } from "./api";

export interface ChatAnalysis {
  type: string;
  requiresConfirmation: boolean;
  firstKeyword: string;
}

export interface ChatResponse {
  conversationId: string;
  generatedQuery: string | null;
  analysis: ChatAnalysis;
  result?: unknown;
  message?: string;
}

export class ChatService {
  static async query(
    connectionId: string,
    question: string,
    conversationId?: string
  ): Promise<ChatResponse> {
    const { data } = await queryApi.post("/query", {
      connectionId,
      question,
      conversationId
    });

    return data.data as ChatResponse;
  }

  static async execute(connectionId: string, query: unknown) {
    const { data } = await queryApi.post("/query/execute", {
      connectionId,
      query
    });

    return data.data;
  }
}
