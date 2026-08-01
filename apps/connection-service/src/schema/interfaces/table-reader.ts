import { TableMetadata } from "./table-metadata.js";
import { ColumnMetadata } from "./column-metadata.js";

export interface TableReader {
  getTables(): Promise<TableMetadata[]>;
  getColumns(tableName: string): Promise<ColumnMetadata[]>;
}
