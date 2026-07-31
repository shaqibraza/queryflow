import { Client } from "pg";
import { DatabaseConnector } from "../interfaces/database-connector.js";

export class PostgresConnector implements DatabaseConnector {
  private client: Client;

  constructor(connectionString: string) {
    this.client = new Client({
      connectionString
    });
  }

  async testConnection(): Promise<void> {
    await this.client.connect();

    await this.client.query("SELECT 1");

    await this.client.end();
  }

  async disconnect(): Promise<void> {
    await this.client.end();
  }
}
