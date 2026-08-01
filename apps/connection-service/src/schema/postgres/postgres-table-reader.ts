import { Client } from "pg";
import { ColumnMetadata } from "../interfaces/column-metadata.js";
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

  async getColumns(tableName: string): Promise<ColumnMetadata[]> {
    const result = await this.client.query(
      `SELECT
         column_name,
         CASE WHEN data_type = 'ARRAY' THEN udt_name ELSE data_type END AS data_type,
         is_nullable,
         column_default
       FROM information_schema.columns
       WHERE table_name = $1
         AND table_schema NOT IN ('pg_catalog', 'information_schema')
       ORDER BY ordinal_position`,
      [tableName]
    );

    return result.rows.map((row) => ({
      name: row.column_name,
      type: row.data_type,
      nullable: row.is_nullable === "YES",
      default: row.column_default
    }));
  }
}
