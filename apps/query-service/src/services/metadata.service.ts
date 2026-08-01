import { ConnectionClient } from "../clients/connection.client.js";
import { CompleteMetadata } from "../metadata/complete-metadata.js";

export class MetadataService {
  constructor(private readonly connectionClient: ConnectionClient) {}

  async getConnection(connectionId: string, userId: string) {
    return this.connectionClient.getConnection(connectionId, userId);
  }

  async getTables(connectionId: string, userId: string) {
    return this.connectionClient.getTables(connectionId, userId);
  }

  async getColumns(connectionId: string, tableName: string, userId: string) {
    return this.connectionClient.getColumns(connectionId, tableName, userId);
  }

  async getRelations(connectionId: string, userId: string) {
    return this.connectionClient.getRelations(connectionId, userId);
  }

  async getSchemas(connectionId: string, userId: string) {
    return this.connectionClient.getSchemas(connectionId, userId);
  }

  async getDatabaseInfo(connectionId: string, userId: string) {
    return this.connectionClient.getDatabaseInfo(connectionId, userId);
  }

  async getPrimaryKeys(connectionId: string, tableName: string, userId: string) {
    return this.connectionClient.getPrimaryKeys(connectionId, tableName, userId);
  }

  async getIndexes(connectionId: string, userId: string) {
    return this.connectionClient.getIndexes(connectionId, userId);
  }

  async getViews(connectionId: string, userId: string) {
    return this.connectionClient.getViews(connectionId, userId);
  }

  async getFunctions(connectionId: string, userId: string) {
    return this.connectionClient.getFunctions(connectionId, userId);
  }

  async collectMetadata(connectionId: string, userId: string): Promise<CompleteMetadata> {
    const [databaseInfo, schemas, tables, relations, views, functions] = await Promise.all([
      this.getDatabaseInfo(connectionId, userId),
      this.getSchemas(connectionId, userId),
      this.getTables(connectionId, userId),
      this.getRelations(connectionId, userId),
      this.getViews(connectionId, userId),
      this.getFunctions(connectionId, userId)
    ]);

    const columns: Record<string, any[]> = {};
    const primaryKeys: Record<string, any> = {};

    for (const table of tables.data) {
      const tableName = table.name;

      const [columnResult, pkResult] = await Promise.all([
        this.getColumns(connectionId, tableName, userId),
        this.getPrimaryKeys(connectionId, tableName, userId)
      ]);

      columns[tableName] = columnResult.data;
      primaryKeys[tableName] = pkResult.data;
    }

    const indexes = await this.getIndexes(connectionId, userId);

    return {
      databaseInfo: databaseInfo.data,
      schemas: schemas.data,
      tables: tables.data,
      columns,
      primaryKeys,
      relations: relations.data,
      indexes: indexes.data,
      views: views.data,
      functions: functions.data
    };
  }
}
