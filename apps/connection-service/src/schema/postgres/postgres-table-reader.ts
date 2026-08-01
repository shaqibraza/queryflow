import { Client } from "pg";
import { ColumnMetadata } from "../interfaces/column-metadata.js";
import { RelationMetadata } from "../interfaces/relation-metadata.js";
import { IndexMetadata } from "../interfaces/index-metadata.js";
import { ViewMetadata } from "../interfaces/view-metadata.js";
import { FunctionMetadata } from "../interfaces/function-metadata.js";
import { DatabaseInfo } from "../interfaces/database-info.js";
import { formatByteSize } from "../utils/format-byte-size.js";
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

  async getPrimaryKeys(tableName: string): Promise<string[]> {
    const result = await this.client.query(
      `SELECT key_column_usage.column_name
       FROM information_schema.table_constraints
       INNER JOIN information_schema.key_column_usage
         ON table_constraints.constraint_name = key_column_usage.constraint_name
         AND table_constraints.table_schema = key_column_usage.table_schema
       WHERE table_constraints.constraint_type = 'PRIMARY KEY'
         AND table_constraints.table_name = $1
         AND table_constraints.table_schema NOT IN ('pg_catalog', 'information_schema')
       ORDER BY key_column_usage.ordinal_position`,
      [tableName]
    );

    return result.rows.map((row) => row.column_name);
  }

  async getRelations(): Promise<RelationMetadata[]> {
    const result = await this.client.query(
      `SELECT
         source_table.relname AS from_table,
         source_column.attname AS from_column,
         target_table.relname AS to_table,
         target_column.attname AS to_column
       FROM pg_constraint foreign_key
       INNER JOIN pg_class source_table ON source_table.oid = foreign_key.conrelid
       INNER JOIN pg_namespace source_schema ON source_schema.oid = source_table.relnamespace
       INNER JOIN pg_class target_table ON target_table.oid = foreign_key.confrelid
       INNER JOIN pg_namespace target_schema ON target_schema.oid = target_table.relnamespace
       INNER JOIN LATERAL unnest(foreign_key.conkey) WITH ORDINALITY
         AS source_key(attnum, position) ON true
       INNER JOIN LATERAL unnest(foreign_key.confkey) WITH ORDINALITY
         AS target_key(attnum, position) ON target_key.position = source_key.position
       INNER JOIN pg_attribute source_column
         ON source_column.attrelid = source_table.oid AND source_column.attnum = source_key.attnum
       INNER JOIN pg_attribute target_column
         ON target_column.attrelid = target_table.oid AND target_column.attnum = target_key.attnum
       WHERE foreign_key.contype = 'f'
         AND source_schema.nspname NOT IN ('pg_catalog', 'information_schema')
         AND target_schema.nspname NOT IN ('pg_catalog', 'information_schema')
       ORDER BY source_table.relname, foreign_key.conname, source_key.position`
    );

    return result.rows.map((row) => ({
      fromTable: row.from_table,
      fromColumn: row.from_column,
      toTable: row.to_table,
      toColumn: row.to_column
    }));
  }

  async getIndexes(): Promise<IndexMetadata[]> {
    const result = await this.client.query(
      `SELECT
         table_info.relname AS table_name,
         index_info.relname AS index_name,
         index_definition.indisunique AS is_unique
       FROM pg_index index_definition
       INNER JOIN pg_class table_info ON table_info.oid = index_definition.indrelid
       INNER JOIN pg_namespace schema_info ON schema_info.oid = table_info.relnamespace
       INNER JOIN pg_class index_info ON index_info.oid = index_definition.indexrelid
       WHERE schema_info.nspname NOT IN ('pg_catalog', 'information_schema')
       ORDER BY table_info.relname, index_info.relname`
    );

    return result.rows.map((row) => ({
      table: row.table_name,
      index: row.index_name,
      unique: row.is_unique
    }));
  }

  async getViews(): Promise<ViewMetadata[]> {
    const result = await this.client.query(
      `SELECT table_schema, table_name
       FROM information_schema.views
       WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
       ORDER BY table_schema, table_name`
    );

    return result.rows.map((row) => ({
      schema: row.table_schema,
      name: row.table_name
    }));
  }

  async getFunctions(): Promise<FunctionMetadata[]> {
    const result = await this.client.query(
      `SELECT DISTINCT routine_schema, routine_name, routine_type
       FROM information_schema.routines
       WHERE routine_schema NOT IN ('pg_catalog', 'information_schema')
         AND routine_type IN ('FUNCTION', 'PROCEDURE')
       ORDER BY routine_schema, routine_name, routine_type`
    );

    return result.rows.map((row) => ({
      schema: row.routine_schema,
      name: row.routine_name,
      type: row.routine_type
    }));
  }

  async getDatabaseInfo(): Promise<DatabaseInfo> {
    const result = await this.client.query(
      `SELECT
         current_database() AS database_name,
         version() AS database_version,
         pg_database_size(current_database()) AS size_bytes`
    );
    const row = result.rows[0];

    return {
      database: row.database_name,
      version: row.database_version,
      size: formatByteSize(row.size_bytes)
    };
  }

  async getSchemas(): Promise<string[]> {
    const result = await this.client.query(
      `SELECT schema_name
       FROM information_schema.schemata
       WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
         AND schema_name NOT LIKE 'pg_toast%'
         AND schema_name NOT LIKE 'pg_temp%'
       ORDER BY schema_name`
    );

    return result.rows.map((row) => row.schema_name);
  }
}
