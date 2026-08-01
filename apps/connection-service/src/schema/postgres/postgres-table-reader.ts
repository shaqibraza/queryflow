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
    const result = await this.client.query(`
      SELECT
        table_schema,
        table_name,
        table_type
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name NOT LIKE 'pg_%'
        AND table_name NOT LIKE 'sql_%'
        AND table_name <> '_prisma_migrations'
      ORDER BY table_name;
    `);

    return result.rows.map((row) => ({
      schema: row.table_schema,
      name: row.table_name,
      type: row.table_type
    }));
  }

  async getColumns(tableName: string): Promise<ColumnMetadata[]> {
    const result = await this.client.query(
      `
      SELECT
        column_name,
        CASE
          WHEN data_type = 'ARRAY' THEN udt_name
          ELSE data_type
        END AS data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
      ORDER BY ordinal_position;
      `,
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
      `
      SELECT
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
       AND tc.table_schema = kcu.table_schema
      WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_schema = 'public'
        AND tc.table_name = $1
      ORDER BY kcu.ordinal_position;
      `,
      [tableName]
    );

    return result.rows.map((row) => row.column_name);
  }

  async getRelations(): Promise<RelationMetadata[]> {
    const result = await this.client.query(`
      SELECT
        source_table.relname AS from_table,
        source_column.attname AS from_column,
        target_table.relname AS to_table,
        target_column.attname AS to_column
      FROM pg_constraint foreign_key
      JOIN pg_class source_table
        ON source_table.oid = foreign_key.conrelid
      JOIN pg_namespace source_schema
        ON source_schema.oid = source_table.relnamespace
      JOIN pg_class target_table
        ON target_table.oid = foreign_key.confrelid
      JOIN pg_namespace target_schema
        ON target_schema.oid = target_table.relnamespace
      JOIN LATERAL unnest(foreign_key.conkey)
        WITH ORDINALITY AS source_key(attnum, position)
        ON true
      JOIN LATERAL unnest(foreign_key.confkey)
        WITH ORDINALITY AS target_key(attnum, position)
        ON target_key.position = source_key.position
      JOIN pg_attribute source_column
        ON source_column.attrelid = source_table.oid
       AND source_column.attnum = source_key.attnum
      JOIN pg_attribute target_column
        ON target_column.attrelid = target_table.oid
       AND target_column.attnum = target_key.attnum
      WHERE foreign_key.contype = 'f'
        AND source_schema.nspname = 'public'
        AND target_schema.nspname = 'public'
      ORDER BY source_table.relname;
    `);

    return result.rows.map((row) => ({
      fromTable: row.from_table,
      fromColumn: row.from_column,
      toTable: row.to_table,
      toColumn: row.to_column
    }));
  }

  async getIndexes(): Promise<IndexMetadata[]> {
    const result = await this.client.query(`
      SELECT
        t.relname AS table_name,
        i.relname AS index_name,
        ix.indisunique AS is_unique
      FROM pg_index ix
      JOIN pg_class t
        ON t.oid = ix.indrelid
      JOIN pg_namespace n
        ON n.oid = t.relnamespace
      JOIN pg_class i
        ON i.oid = ix.indexrelid
      WHERE n.nspname = 'public'
        AND t.relname NOT LIKE 'pg_%'
        AND t.relname NOT LIKE 'sql_%'
        AND t.relname <> '_prisma_migrations'
      ORDER BY t.relname, i.relname;
    `);

    return result.rows.map((row) => ({
      table: row.table_name,
      index: row.index_name,
      unique: row.is_unique
    }));
  }

  async getViews(): Promise<ViewMetadata[]> {
    const result = await this.client.query(`
      SELECT
        table_schema,
        table_name
      FROM information_schema.views
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    return result.rows.map((row) => ({
      schema: row.table_schema,
      name: row.table_name
    }));
  }

  async getFunctions(): Promise<FunctionMetadata[]> {
    const result = await this.client.query(`
      SELECT
        routine_schema,
        routine_name,
        routine_type
      FROM information_schema.routines
      WHERE routine_schema = 'public'
        AND routine_type IN ('FUNCTION','PROCEDURE')
      ORDER BY routine_name;
    `);

    return result.rows.map((row) => ({
      schema: row.routine_schema,
      name: row.routine_name,
      type: row.routine_type
    }));
  }

  async getDatabaseInfo(): Promise<DatabaseInfo> {
    const result = await this.client.query(`
      SELECT
        current_database() AS database_name,
        version() AS database_version,
        pg_database_size(current_database()) AS size_bytes
    `);

    const row = result.rows[0];

    return {
      database: row.database_name,
      version: row.database_version,
      size: formatByteSize(row.size_bytes)
    };
  }

  async getSchemas(): Promise<string[]> {
    const result = await this.client.query(`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name = 'public';
    `);

    return result.rows.map((row) => row.schema_name);
  }
}
