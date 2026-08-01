export interface DatabaseConnector<TClient = unknown> {
  connect(): Promise<void>;
  testConnection(): Promise<void>;

  disconnect(): Promise<void>;
  getClient(): TClient;

  executeQuery(query: string): Promise<unknown>;
}
