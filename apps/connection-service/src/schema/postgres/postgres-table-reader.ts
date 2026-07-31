import { Client } from "pg";
import { TableMetadata } from "../interfaces/table-metadata.js";
import { TableReader } from "../interfaces/table-reader.js";

export class PostgresTableReader implements TableReader {
  constructor(private readonly client: Client) {}

  async getTables(): Promise<TableMetadata[]> {
    const result = await this.client.query(
      `SELECT
                table_schema,
                table_name,
                table_type
            FROM information_schema.tables
            WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
            ORDER BY table_schema, table_name;
            `
    );

    return result.rows.map((row) => ({
      schema: row.table_schema,
      name: row.table_name,
      type: row.table_type
    }));
  }
}
