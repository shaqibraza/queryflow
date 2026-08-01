import { DatabaseType } from "@queryflow/database";
import type { Client } from "pg";
import type { Connection } from "mysql2/promise";
import type { MongoClient } from "mongodb";

import type { TableReader } from "../interfaces/table-reader.js";
import { PostgresTableReader } from "../postgres/postgres-table-reader.js";
import { MysqlTableReader } from "../mysql/mysql-table-reader.js";
import { MongoDbTableReader } from "../mongodb/mongodb-table-reader.js";

export class TableReaderFactory {
  static create(databaseType: DatabaseType, client: unknown): TableReader {
    switch (databaseType) {
      case DatabaseType.POSTGRESQL:
        return new PostgresTableReader(client as Client);

      case DatabaseType.MYSQL:
        return new MysqlTableReader(client as Connection);

      case DatabaseType.MONGODB:
        return new MongoDbTableReader(client as MongoClient);

      default:
        throw new Error(`Table reader not implemented for ${databaseType}`);
    }
  }
}
