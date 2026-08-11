import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env")
});

import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { DatabaseConnector } from "./connectors/database.connector.js";

const db = new DatabaseConnector();
await db.connect();

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`connection-service listening on port ${env.PORT}`);
});
