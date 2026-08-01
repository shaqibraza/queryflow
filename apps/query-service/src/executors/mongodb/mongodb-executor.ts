import { Executor } from "../interfaces/executor.js";
import { ConnectionClient } from "../../clients/connection.client.js";
import { MongoCommand } from "@queryflow/shared";

export class MongoDbExecutor implements Executor<MongoCommand> {
  constructor(
    private readonly connectionClient: ConnectionClient,
    private readonly connectionId: string,
    private readonly userId: string
  ) {}

  async execute(command: MongoCommand) {
    return this.connectionClient.executeQuery(this.connectionId, command, this.userId);
  }
}
