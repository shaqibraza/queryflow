export interface DatabaseConnector<TClient = unknown, TQuery = string> {
  connect(): Promise<void>;
  testConnection(): Promise<void>;

  disconnect(): Promise<void>;
  getClient(): TClient;

  executeQuery(query: TQuery): Promise<unknown>;
}
