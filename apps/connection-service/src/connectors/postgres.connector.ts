import { Client } from "pg";
import { DatabaseConnector } from "../interfaces/database-connector.js";

export class PostgresConnector implements DatabaseConnector<Client> {
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
    await this.client.connect();

    await this.client.query("SELECT 1");

    await this.client.end();
  }

  async disconnect(): Promise<void> {
    await this.client.end();
  }

  getClient(): Client {
    return this.client;
  }
}
