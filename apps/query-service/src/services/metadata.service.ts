import { ConnectionClient } from "../clients/connection.client.js";

export class MetadataService {
  constructor(private readonly connectionClient: ConnectionClient) {}

  async getTables(connectionId: string, userId: string) {
    return await this.connectionClient.getTables(connectionId, userId);
  }

  async getColumns(connectionId: string, tableName: string, userId: string) {
    return await this.connectionClient.getColumns(connectionId, tableName, userId);
  }

  async getRelations(connectionId: string, userId: string) {
    return await this.connectionClient.getRelations(connectionId, userId);
  }

  async getDatabaseInfo(connectionId: string, userId: string) {
    return await this.connectionClient.getConnection(connectionId, userId);
  }

  async getSchemas(connectionId: string, userId: string) {
    return await this.connectionClient.getSchemas(connectionId, userId);
  }
}
