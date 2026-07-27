export enum DataSourceType {
  Csv = "csv",
  PostgreSql = "postgresql",
  MySql = "mysql",
  MongoDb = "mongodb"
}

export type ApiResponse<TData> = {
  data: TData;
  meta?: Record<string, string | number | boolean>;
};

export type HealthResponse = {
  service: string;
  status: "ok";
  timestamp: string;
};

export type QueryResultColumn = {
  name: string;
  type: string;
};

export type QueryResultRow = Record<string, string | number | boolean | null>;

export type NormalizedQueryResult = {
  columns: QueryResultColumn[];
  rows: QueryResultRow[];
};
