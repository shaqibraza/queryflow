import { Client } from "pg";
import { DatabaseConnector } from "../interfaces/database-connector.js";

export class PostgresConnector implements DatabaseConnector<Client, string> {
  private client: Client;

  constructor(private readonly connectionString: string) {
    this.client = new Client({
      connectionString: this.connectionString
    });
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async testConnection(): Promise<void> {
    await this.connect();

    try {
      await this.client.query("SELECT 1");
    } finally {
      await this.disconnect();
    }
  }

  async disconnect(): Promise<void> {
    await this.client.end();
  }

  getClient(): Client {
    return this.client;
  }

  async executeQuery(query: string) {
    const result = await this.client.query(query);

    return {
      rows: result.rows,
      rowCount: result.rowCount ?? 0,
      command: result.command,
      fields: result.fields.map((field) => ({
        name: field.name,
        dataTypeId: field.dataTypeID
      }))
    };
  }
}
