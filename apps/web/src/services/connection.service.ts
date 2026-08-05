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

  static async getColumns(connectionId: string, table: string) {
    const { data } = await connectionApi.get(`/${connectionId}/tables/${table}/columns`);

    return data.data;
  }

  static async getPrimaryKeys(connectionId: string, table: string) {
    const { data } = await connectionApi.get(`/${connectionId}/tables/${table}/primary-key`);

    return data.data;
  }

  static async getRelations(connectionId: string) {
    const { data } = await connectionApi.get(`/${connectionId}/relations`);

    return data.data;
  }

  static async getIndexes(connectionId: string) {
    const { data } = await connectionApi.get(`/${connectionId}/indexes`);

    return data.data;
  }

  static async getViews(connectionId: string) {
    const { data } = await connectionApi.get(`/${connectionId}/views`);

    return data.data;
  }

  static async getFunctions(connectionId: string) {
    const { data } = await connectionApi.get(`/${connectionId}/functions`);

    return data.data;
  }

  static async getSchemas(connectionId: string) {
    const { data } = await connectionApi.get(`/${connectionId}/schemas`);

    return data.data;
  }

  static async getDatabaseInfo(connectionId: string) {
    const { data } = await connectionApi.get(`/${connectionId}/info`);

    return data.data;
  }
}
