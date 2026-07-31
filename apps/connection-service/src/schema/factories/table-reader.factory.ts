import { DatabaseType } from "@queryflow/database";
import type { Client } from "pg";

import type { TableReader } from "../interfaces/table-reader.js";
import { PostgresTableReader } from "../postgres/postgres-table-reader.js";

export class TableReaderFactory {
  static create(databaseType: DatabaseType, client: unknown): TableReader {
    switch (databaseType) {
      case DatabaseType.POSTGRESQL:
        return new PostgresTableReader(client as Client);

      default:
        throw new Error(`Table reader not implemented for ${databaseType}`);
    }
  }
}
