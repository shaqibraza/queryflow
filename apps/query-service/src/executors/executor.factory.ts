import { DatabaseType } from "@queryflow/database";

import { ConnectionClient } from "../clients/connection.client.js";

import { Executor } from "./interfaces/executor.js";
import { PostgresExecutor } from "./postgres/postgres-executor.js";
import { MysqlExecutor } from "./mysql/mysql-executor.js";
import { MongoDbExecutor } from "./mongodb/mongodb-executor.js";

export class ExecutorFactory {
  static createExecutor(
    databaseType: DatabaseType,
    connectionClient: ConnectionClient,
    connectionId: string,
    userId: string
  ): Executor {
    switch (databaseType) {
      case DatabaseType.POSTGRESQL:
        return new PostgresExecutor(connectionClient, connectionId, userId);

      case DatabaseType.MYSQL:
        return new MysqlExecutor(connectionClient, connectionId, userId);

      case DatabaseType.MONGODB:
        return new MongoDbExecutor(connectionClient, connectionId, userId);

      default:
        throw new Error(`Unsupported database type: ${databaseType}`);
    }
  }
}
