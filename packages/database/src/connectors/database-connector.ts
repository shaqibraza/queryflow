import type { DataSourceType, NormalizedQueryResult } from "@queryflow/types";

export type ConnectionValidationResult = {
  valid: boolean;
  message?: string;
};

export type SchemaDiscoveryResult = {
  sourceType: DataSourceType;
  schemas: Array<{
    name: string;
    tables: Array<{
      name: string;
      columns: Array<{ name: string; type: string; nullable: boolean }>;
    }>;
  }>;
};

export interface DatabaseConnector<TConnectionConfig = unknown, TReadOnlyQuery = unknown> {
  readonly sourceType: DataSourceType;
  validateConnection(config: TConnectionConfig): Promise<ConnectionValidationResult>;
  discoverSchema(config: TConnectionConfig): Promise<SchemaDiscoveryResult>;
  executeReadOnlyQuery(
    config: TConnectionConfig,
    query: TReadOnlyQuery
  ): Promise<NormalizedQueryResult>;
}
