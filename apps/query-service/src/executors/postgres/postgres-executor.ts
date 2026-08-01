import { Executor } from "../interfaces/executor.js";
import { ConnectionClient } from "../../clients/connection.client.js";

export class PostgresExecutor implements Executor<string> {
  constructor(
    private readonly connectionClient: ConnectionClient,
    private readonly connectionId: string,
    private readonly userId: string
  ) {}

  async execute(query: string) {
    return this.connectionClient.executeQuery(this.connectionId, query, this.userId);
  }
}
