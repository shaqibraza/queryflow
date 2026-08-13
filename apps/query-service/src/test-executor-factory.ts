import { DatabaseType } from "@queryflow/database";

import { ConnectionClient } from "./clients/connection.client.js";
import { ExecutorFactory } from "./executors/executor.factory.js";

const client = new ConnectionClient();

const executor = ExecutorFactory.createExecutor(
  DatabaseType.POSTGRESQL,
  client,
  "connection-id",
  "user-id"
);
