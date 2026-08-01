import type { Connection, RowDataPacket } from "mysql2/promise";
import type { ColumnMetadata } from "../interfaces/column-metadata.js";
import type { RelationMetadata } from "../interfaces/relation-metadata.js";
import type { IndexMetadata } from "../interfaces/index-metadata.js";
import type { ViewMetadata } from "../interfaces/view-metadata.js";
import type { FunctionMetadata } from "../interfaces/function-metadata.js";
import type { DatabaseInfo } from "../interfaces/database-info.js";
import { formatByteSize } from "../utils/format-byte-size.js";
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

  async getPrimaryKeys(tableName: string): Promise<string[]> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      `SELECT column_name
       FROM information_schema.key_column_usage
       WHERE table_schema = DATABASE()
         AND table_name = ?
         AND constraint_name = 'PRIMARY'
       ORDER BY ordinal_position`,
      [tableName]
    );

    return rows.map((row) => row.column_name);
  }

  async getRelations(): Promise<RelationMetadata[]> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      `SELECT table_name, column_name, referenced_table_name, referenced_column_name
       FROM information_schema.key_column_usage
       WHERE table_schema = DATABASE()
         AND referenced_table_name IS NOT NULL
       ORDER BY table_name, constraint_name, ordinal_position`
    );

    return rows.map((row) => ({
      fromTable: row.table_name,
      fromColumn: row.column_name,
      toTable: row.referenced_table_name,
      toColumn: row.referenced_column_name
    }));
  }

  async getIndexes(): Promise<IndexMetadata[]> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      `SELECT table_name, index_name, non_unique
       FROM information_schema.statistics
       WHERE table_schema = DATABASE()
       GROUP BY table_name, index_name, non_unique
       ORDER BY table_name, index_name`
    );

    return rows.map((row) => ({
      table: row.table_name,
      index: row.index_name,
      unique: row.non_unique === 0
    }));
  }

  async getViews(): Promise<ViewMetadata[]> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      `SELECT table_schema, table_name
       FROM information_schema.views
       WHERE table_schema = DATABASE()
       ORDER BY table_name`
    );

    return rows.map((row) => ({
      schema: row.table_schema,
      name: row.table_name
    }));
  }

  async getFunctions(): Promise<FunctionMetadata[]> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      `SELECT routine_schema, routine_name, routine_type
       FROM information_schema.routines
       WHERE routine_schema = DATABASE()
         AND routine_type IN ('FUNCTION', 'PROCEDURE')
       ORDER BY routine_name, routine_type`
    );

    return rows.map((row) => ({
      schema: row.routine_schema,
      name: row.routine_name,
      type: row.routine_type
    }));
  }

  async getDatabaseInfo(): Promise<DatabaseInfo> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      `SELECT
         DATABASE() AS database_name,
         VERSION() AS database_version,
         COALESCE(SUM(data_length + index_length), 0) AS size_bytes
       FROM information_schema.tables
       WHERE table_schema = DATABASE()`
    );
    const row = rows[0];

    return {
      database: row.database_name,
      version: `MySQL ${row.database_version}`,
      size: formatByteSize(row.size_bytes)
    };
  }

  async getSchemas(): Promise<string[]> {
    const [rows] = await this.connection.query<RowDataPacket[]>("SELECT DATABASE() AS schema_name");

    return rows[0]?.schema_name ? [rows[0].schema_name] : [];
  }
}
