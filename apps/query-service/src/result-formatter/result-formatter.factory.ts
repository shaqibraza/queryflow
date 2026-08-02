import { DatabaseType } from "@queryflow/database";

import { MysqlResultFormatter } from "./mysql/mysql-result.formatter.js";
import { MongoDbResultFormatter } from "./mongodb/mongodb-result.formatter.js";
import { PostgresResultFormatter } from "./postgres/postgres-result.formatter.js";

export class ResultFormatterFactory {
  static create(databaseType: DatabaseType) {
    switch (databaseType) {
      case DatabaseType.POSTGRESQL:
        return new PostgresResultFormatter();

      case DatabaseType.MYSQL:
        return new MysqlResultFormatter();

      case DatabaseType.MONGODB:
        return new MongoDbResultFormatter();

      default:
        throw new Error("Unsupported database.");
    }
  }
}
