import { DatabaseType } from "@queryflow/database";

import { Analyzer } from "./interfaces/analyzer.js";

import { PostgresAnalyzer } from "./postgres/postgres-analyzer.js";
import { MysqlAnalyzer } from "./mysql/mysql-analyzer.js";
import { MongoDbAnalyzer } from "./mongodb/mongodb-analyzer.js";

export class AnalyzerFactory {
  static create(databaseType: DatabaseType): Analyzer {
    switch (databaseType) {
      case DatabaseType.POSTGRESQL:
        return new PostgresAnalyzer();
      case DatabaseType.MYSQL:
        return new MysqlAnalyzer();
      case DatabaseType.MONGODB:
        return new MongoDbAnalyzer();
      default:
        throw new Error(`Unsupported database type: ${databaseType}`);
    }
  }
}
