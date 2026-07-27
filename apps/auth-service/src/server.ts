import { env } from "./config/env.js";
import { createApp } from "./app.js";

const app = createApp();

app.listen(env.AUTH_SERVICE_PORT, () => {
  console.log(`auth-service listening on port ${env.AUTH_SERVICE_PORT}`);
});
