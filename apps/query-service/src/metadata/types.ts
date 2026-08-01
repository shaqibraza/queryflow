export interface DatabaseInfo {
  database: string;
  version: string;
  size?: string;
}

export interface SchemaInfo {
  name: string;
}

export interface TableInfo {
  schema: string;
  name: string;
  type: string;
}

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  default: unknown;
}

export interface PrimaryKeyInfo {
  table: string;
  columns: string[];
}

export interface RelationInfo {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
}

export interface IndexInfo {
  table: string;
  index: string;
  unique: boolean;
}

export interface ViewInfo {
  schema: string;
  name: string;
}

export interface FunctionInfo {
  schema: string;
  name: string;
  type: string;
}
