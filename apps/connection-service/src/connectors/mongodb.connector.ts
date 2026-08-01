import { MongoClient } from "mongodb";
import { DatabaseConnector } from "../interfaces/database-connector.js";
import { MongoCommand } from "@queryflow/shared";

export class MongoDbConnector implements DatabaseConnector<MongoClient, MongoCommand> {
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

  async executeQuery(command: MongoCommand) {
    const db = this.client.db();

    const collection = db.collection(command.collection);

    switch (command.operation) {
      case "find":
        return await collection
          .find(command.filter ?? {})
          .project(command.projection ?? {})
          .sort(command.sort ?? {})
          .skip(command.skip ?? 0)
          .limit(command.limit ?? 100)
          .toArray();

      case "findOne":
        return await collection.findOne(command.filter ?? {}, {
          projection: command.projection
        });

      case "countDocuments":
        return await collection.countDocuments(command.filter ?? {});

      case "aggregate":
        return await collection.aggregate(command.pipeline ?? []).toArray();

      case "distinct":
        return await collection.distinct(command.field!, command.filter ?? {});

      case "insertOne":
        return await collection.insertOne(command.document!);

      case "updateOne":
        return await collection.updateOne(command.filter ?? {}, command.update!);

      case "updateMany":
        return await collection.updateMany(command.filter ?? {}, command.update!);

      case "replaceOne":
        return await collection.replaceOne(command.filter ?? {}, command.replacement!);

      case "deleteOne":
        return await collection.deleteOne(command.filter ?? {});

      case "deleteMany":
        return await collection.deleteMany(command.filter ?? {});

      case "drop":
        return await collection.drop();

      default:
        throw new Error(`Unsupported MongoDB operation: ${command.operation}`);
    }
  }
}
