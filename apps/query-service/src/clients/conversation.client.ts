import axios, { AxiosInstance } from "axios";
import { env } from "../config/env.js";

interface Conversation {
  id: string;
  userId: string;
  connectionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
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

export interface CreateConversationRequest {
  connectionId: string;
  firstQuestion: string;
}

export interface SaveUserMessageRequest {
  question: string;
}

export interface SaveAssistantMessageRequest {
  reply: string;
  generatedQuery?: string;
  analysis?: unknown;
  result?: unknown;
}

export interface RenameConversationRequest {
  title: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export class ConversationClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.CONVERSATION_SERVICE_URL,
      timeout: 10000
    });
  }

  async createConversation(
    connectionId: string,
    firstQuestion: string,
    userId: string
  ): Promise<Conversation> {
    const { data } = await this.client.post<ApiResponse<Conversation>>(
      "/conversations",
      {
        connectionId,
        firstQuestion
      } satisfies CreateConversationRequest,
      {
        headers: {
          "X-User-Id": userId
        }
      }
    );

    return data.data;
  }

  async saveUserMessage(
    conversationId: string,
    question: string,
    userId: string
  ): Promise<Message> {
    const { data } = await this.client.post<ApiResponse<Message>>(
      `/conversations/${conversationId}/messages/user`,
      {
        question
      } satisfies SaveUserMessageRequest,
      {
        headers: {
          "X-User-Id": userId
        }
      }
    );

    return data.data;
  }

  async saveAssistantMessage(
    conversationId: string,
    payload: SaveAssistantMessageRequest,
    userId: string
  ): Promise<Message> {
    const { data } = await this.client.post<ApiResponse<Message>>(
      `/conversations/${conversationId}/messages/assistant`,
      payload,
      {
        headers: {
          "X-User-Id": userId
        }
      }
    );

    return data.data;
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    const { data } = await this.client.get<ApiResponse<Conversation[]>>("/conversations", {
      headers: {
        "X-User-Id": userId
      }
    });

    return data.data;
  }

  async renameConversation(
    conversationId: string,
    title: string,
    userId: string
  ): Promise<Conversation> {
    const { data } = await this.client.patch<ApiResponse<Conversation>>(
      `/conversations/${conversationId}`,
      {
        title
      } satisfies RenameConversationRequest,
      {
        headers: {
          "X-User-Id": userId
        }
      }
    );

    return data.data;
  }

  async deleteConversation(conversationId: string, userId: string): Promise<void> {
    await this.client.delete(`/conversations/${conversationId}`, {
      headers: {
        "X-User-Id": userId
      }
    });
  }

  async getMessages(conversationId: string, userId: string): Promise<Message[]> {
    const { data } = await this.client.get<ApiResponse<Message[]>>(
      `/conversations/${conversationId}/messages`,
      {
        headers: {
          "X-User-Id": userId
        }
      }
    );

    return data.data;
  }
}
