import mysql from "mysql2/promise";
import { DatabaseConnector } from "../interfaces/database-connector.js";

export class MysqlConnector implements DatabaseConnector {
  private connection?: mysql.Connection;

  constructor(private readonly connectionString: string) {}

  async testConnection(): Promise<void> {
    this.connection = await mysql.createConnection(this.connectionString);

    await this.connection.query("SELECT 1");

    await this.connection.end();
    this.connection = undefined;
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = undefined;
    }
  }
}
