import { DatabaseType } from "@queryflow/database";

import { ResponseParser } from "./interfaces/response-parser.js";

import { PostgresResponseParser } from "./postgres/postgres-response.parser.js";
import { MysqlResponseParser } from "./mysql/mysql-response.parser.js";
import { MongoDbResponseParser } from "./mongodb/mongodb-response.parser.js";

export class ResponseParserFactory {
  static create(databaseType: DatabaseType): ResponseParser {
    switch (databaseType) {
      case DatabaseType.POSTGRESQL:
        return new PostgresResponseParser();

      case DatabaseType.MYSQL:
        return new MysqlResponseParser();

      case DatabaseType.MONGODB:
        return new MongoDbResponseParser();

      default:
        throw new Error("Unsupported database type.");
    }
  }
}
