import { connectionApi } from "./api";

export type DatabaseType = "POSTGRESQL" | "MYSQL" | "MONGODB";

export interface DatabaseConnection {
  id: string;
  name: string;
  databaseType: DatabaseType;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConnectionPayload {
  name: string;
  databaseType: DatabaseType;
  databaseUrl: string;
}

export class ConnectionService {
  static async createConnection(payload: CreateConnectionPayload) {
    const { data } = await connectionApi.post("/", payload);

    return data.data;
  }

  static async getConnections(): Promise<DatabaseConnection[]> {
    const { data } = await connectionApi.get("/");

    return data.data;
  }

  static async getConnection(id: string): Promise<DatabaseConnection> {
    const { data } = await connectionApi.get(`/${id}`);

    return data.data;
  }

  static async updateConnection(id: string, payload: Partial<CreateConnectionPayload>) {
    const { data } = await connectionApi.patch(`/${id}`, payload);

    return data.data;
  }

  static async deleteConnection(id: string) {
    const { data } = await connectionApi.delete(`/${id}`);

    return data;
  }

  static async testConnection(id: string) {
    const { data } = await connectionApi.post(`/${id}/test`);

    return data;
  }

  static async getTables(connectionId: string) {
    const { data } = await connectionApi.get(`/${connectionId}/tables`);

    return data.data;
  }
}
