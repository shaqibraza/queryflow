import { queryApi } from "./api";

export interface Conversation {
  id: string;
  userId: string;
  connectionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: "USER" | "ASSISTANT";
  question: string | null;
  reply: string | null;
  generatedQuery: string | null;
  analysis: unknown;
  result: unknown;
  createdAt: string;
}

interface ConversationListResponse {
  success: boolean;
  data: Conversation[];
  message?: string;
}

interface ConversationMessagesResponse {
  success: boolean;
  data: ConversationMessage[];
  message?: string;
}

export class ConversationService {
  static async getConversations(): Promise<Conversation[]> {
    const { data } = await queryApi.get<ConversationListResponse>("/query/conversations");

    return data.data;
  }

  static async getMessages(conversationId: string): Promise<ConversationMessage[]> {
    const { data } = await queryApi.get<ConversationMessagesResponse>(
      `/query/conversations/${conversationId}/messages`
    );

    return data.data;
  }
}
