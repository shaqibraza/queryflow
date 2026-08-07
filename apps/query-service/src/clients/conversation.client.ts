import axios, { AxiosInstance } from "axios";
import { env } from "../config/env.js";

export class ConversationClient {
  private readonly client: AxiosInstance;
  constructor() {
    this.client = axios.create({
      baseURL: env.CONVERSATION_SERVICE_URL,
      timeout: 10000
    });
  }

  async createConversation(connectionId: string, firstQuestion: string, userId: string) {
    const response = await this.client.post(
      "/conversations",
      {
        connectionId,
        firstQuestion
      },
      {
        headers: {
          "X-User-Id": userId
        }
      }
    );

    return response.data.data;
  }

  async saveUserMessage(conversationId: string, question: string, userId: string) {
    const response = await this.client.post(
      `/conversations/${conversationId}/messages/user`,
      { question },
      { headers: { "X-User-Id": userId } }
    );

    return response.data.data;
  }

  async saveAssistantMessage(
    conversationId: string,
    payload: {
      reply: string;
      generatedQuery?: string;
      analysis?: unknown;
      result?: unknown;
    },
    userId: string
  ) {
    const response = await this.client.post(
      `/conversations/${conversationId}/messages/assistant`,
      payload,
      { headers: { "X-User-Id": userId } }
    );

    return response.data.data;
  }

  async getMessages(conversationId: string, userId: string) {
    const response = await this.client.get(`/conversations/${conversationId}/messages`, {
      headers: {
        "X-User-Id": userId
      }
    });

    return response.data.data;
  }
}
