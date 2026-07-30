import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { DatabaseConnector } from "./connectors/database.connector.js";

const db = new DatabaseConnector();
await db.connect();

const app = createApp();

app.listen(env.DATASET_SERVICE_PORT, () => {
  console.log(`dataset-service listening on port ${env.DATASET_SERVICE_PORT}`);
});
