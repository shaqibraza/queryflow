import type { Connection, RowDataPacket } from "mysql2/promise";
import type { ColumnMetadata } from "../interfaces/column-metadata.js";
import type { TableMetadata } from "../interfaces/table-metadata.js";
import type { TableReader } from "../interfaces/table-reader.js";

export class MysqlTableReader implements TableReader {
  constructor(private readonly connection: Connection) {}

  async getTables(): Promise<TableMetadata[]> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      `SELECT table_schema, table_name, table_type
       FROM information_schema.tables
       WHERE table_schema = DATABASE()
       ORDER BY table_name`
    );

    return rows.map((row) => ({
      schema: row.table_schema,
      name: row.table_name,
      type: row.table_type === "VIEW" ? "VIEW" : "BASE TABLE"
    }));
  }

  async getColumns(tableName: string): Promise<ColumnMetadata[]> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      `SELECT column_name, column_type, is_nullable, column_default
       FROM information_schema.columns
       WHERE table_schema = DATABASE() AND table_name = ?
       ORDER BY ordinal_position`,
      [tableName]
    );

    return rows.map((row) => ({
      name: row.column_name,
      type: row.column_type,
      nullable: row.is_nullable === "YES",
      default: row.column_default
    }));
  }
}
