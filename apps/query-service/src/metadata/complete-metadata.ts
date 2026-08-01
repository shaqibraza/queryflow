import {
  DatabaseInfo,
  SchemaInfo,
  TableInfo,
  ColumnInfo,
  PrimaryKeyInfo,
  RelationInfo,
  IndexInfo,
  ViewInfo,
  FunctionInfo
} from "./types.js";

export interface CompleteMetadata {
  databaseInfo: DatabaseInfo;

  schemas: SchemaInfo[];

  tables: TableInfo[];

  columns: Record<string, ColumnInfo[]>;

  primaryKeys: Record<string, PrimaryKeyInfo>;

  relations: RelationInfo[];

  indexes: IndexInfo[];

  views: ViewInfo[];

  functions: FunctionInfo[];
}
