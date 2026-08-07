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
