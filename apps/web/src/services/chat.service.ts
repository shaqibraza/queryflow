import { queryApi } from "./api";

export interface ChatResponse {
  generatedQuery: string | null;
  analysis: {
    type: string;
    requiresConfirmation: boolean;
    firstKeyword: string;
  };
  result?: unknown;
  message?: string;
}

export class ChatService {
  static async query(connectionId: string, question: string) {
    const { data } = await queryApi.post("/query", {
      connectionId,
      question
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
