import { TableMetadata } from "./table-metadata.js";

export interface TableReader {
  getTables(): Promise<TableMetadata[]>;
}
