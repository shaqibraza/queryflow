import { MongoClient } from "mongodb";
import { DatabaseConnector } from "../interfaces/database-connector.js";

export class MongoDbConnector implements DatabaseConnector<MongoClient> {
  private client: MongoClient;

  constructor(connectionString: string) {
    this.client = new MongoClient(connectionString);
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async testConnection(): Promise<void> {
    await this.connect();

    try {
      await this.client.db().command({
        ping: 1
      });
    } finally {
      await this.disconnect();
    }
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  getClient(): MongoClient {
    return this.client;
  }
}
