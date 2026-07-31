import { DatabaseType } from "@queryflow/database";
import type { DatabaseConnector } from "../interfaces/database-connector.js";
import { PostgresConnector } from "../connectors/postgres.connector.js";
import { MysqlConnector } from "../connectors/mysql.connector.js";
import { MongoDbConnector } from "../connectors/mongodb.connector.js";

export class ConnectorFactory {
  static create(databaseType: DatabaseType, connectionString: string): DatabaseConnector {
    switch (databaseType) {
      case DatabaseType.POSTGRESQL:
        return new PostgresConnector(connectionString);

      case DatabaseType.MYSQL:
        return new MysqlConnector(connectionString);

      case DatabaseType.MONGODB:
        return new MongoDbConnector(connectionString);

      default:
        throw new Error("Unsupported database type.");
    }
  }
}
