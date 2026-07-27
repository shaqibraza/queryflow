import { env } from "./config/env.js";
import { createApp } from "./app.js";

const app = createApp();

app.listen(env.QUERY_SERVICE_PORT, () => {
  console.log(`query-service listening on port ${env.QUERY_SERVICE_PORT}`);
});
