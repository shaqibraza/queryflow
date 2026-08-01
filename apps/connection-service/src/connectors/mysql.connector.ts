import mysql from "mysql2/promise";
import { DatabaseConnector } from "../interfaces/database-connector.js";

export class MysqlConnector implements DatabaseConnector<mysql.Connection> {
  private connection?: mysql.Connection;

  constructor(private readonly connectionString: string) {}

  async connect(): Promise<void> {
    this.connection = await mysql.createConnection(this.connectionString);
  }

  async testConnection(): Promise<void> {
    await this.connect();

    try {
      await this.connection!.query("SELECT 1");
    } finally {
      await this.disconnect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = undefined;
    }
  }

  getClient(): mysql.Connection {
    if (!this.connection) {
      throw new Error("MySQL client is not connected");
    }

    return this.connection;
  }

  async executeQuery(query: string) {
    if (!this.connection) {
      throw new Error("MySQL client is not connected");
    }

    const [rows, fields] = await this.connection.query(query);

    return {
      rows,
      fields
    };
  }
}
