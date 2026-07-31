export interface DatabaseConnector {
  testConnection(): Promise<void>;

  disconnect(): Promise<void>;
}
