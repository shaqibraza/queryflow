import { MongoClient } from "mongodb";
import { DatabaseConnector } from "../interfaces/database-connector.js";

export class MongoDbConnector implements DatabaseConnector {
  private client: MongoClient;

  constructor(connectionString: string) {
    this.client = new MongoClient(connectionString);
  }

  async testConnection(): Promise<void> {
    await this.client.connect();

    await this.client.db().command({
      ping: 1
    });

    await this.client.close();
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }
}
