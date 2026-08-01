import { TableMetadata } from "./table-metadata.js";
import { ColumnMetadata } from "./column-metadata.js";
import { RelationMetadata } from "./relation-metadata.js";
import { IndexMetadata } from "./index-metadata.js";
import { ViewMetadata } from "./view-metadata.js";
import { FunctionMetadata } from "./function-metadata.js";
import { DatabaseInfo } from "./database-info.js";

export interface TableReader {
  getTables(): Promise<TableMetadata[]>;
  getColumns(tableName: string): Promise<ColumnMetadata[]>;
  getPrimaryKeys(tableName: string): Promise<string[]>;
  getRelations(): Promise<RelationMetadata[]>;
  getIndexes(): Promise<IndexMetadata[]>;
  getViews(): Promise<ViewMetadata[]>;
  getFunctions(): Promise<FunctionMetadata[]>;
  getDatabaseInfo(): Promise<DatabaseInfo>;
  getSchemas(): Promise<string[]>;
}
