import axios, { AxiosInstance } from "axios";
import { env } from "../config/env.js";

export class ConnectionClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.CONNECTION_SERVICE_URL,
      timeout: 10000
    });
  }

  async getConnection(connectionId: string, userId: string) {
    const response = await this.client.get(`connections/${connectionId}`, {
      headers: {
        "X-User-Id": userId
      }
    });

    return response.data.data;
  }

  async getTables(connectionId: string, userId: string) {
    const response = await this.client.get(`connections/${connectionId}/tables`, {
      headers: {
        "X-User-Id": userId
      }
    });
    return response.data;
  }

  async getColumns(connectionId: string, tableName: string, userId: string) {
    const response = await this.client.get(
      `connections/${connectionId}/tables/${encodeURIComponent(tableName)}/columns`,
      {
        headers: {
          "X-User-Id": userId
        }
      }
    );
    return response.data;
  }

  async getRelations(connectionId: string, userId: string) {
    const response = await this.client.get(`connections/${connectionId}/relations`, {
      headers: {
        "X-User-Id": userId
      }
    });
    return response.data;
  }

  async getSchemas(connectionId: string, userId: string) {
    const response = await this.client.get(`connections/${connectionId}/schemas`, {
      headers: {
        "X-User-Id": userId
      }
    });
    return response.data;
  }

  async getDatabaseInfo(connectionId: string, userId: string) {
    const response = await this.client.get(`connections/${connectionId}/info`, {
      headers: {
        "X-User-Id": userId
      }
    });
    return response.data;
  }

  async getPrimaryKeys(connectionId: string, tableName: string, userId: string) {
    const response = await this.client.get(
      `/connections/${connectionId}/tables/${encodeURIComponent(tableName)}/primary-key`,
      {
        headers: {
          "X-User-Id": userId
        }
      }
    );

    return response.data;
  }

  async getIndexes(connectionId: string, userId: string) {
    const response = await this.client.get(`/connections/${connectionId}/indexes`, {
      headers: {
        "X-User-Id": userId
      }
    });

    return response.data;
  }

  async getViews(connectionId: string, userId: string) {
    const response = await this.client.get(`/connections/${connectionId}/views`, {
      headers: {
        "X-User-Id": userId
      }
    });

    return response.data;
  }

  async getFunctions(connectionId: string, userId: string) {
    const response = await this.client.get(`/connections/${connectionId}/functions`, {
      headers: {
        "X-User-Id": userId
      }
    });

    return response.data;
  }
}
