import { env } from "./config/env.js";
import { createApp } from "./app.js";

const app = createApp();

app.listen(env.CONVERSATION_SERVICE_PORT, () => {
  console.log(`conversation service listening on port ${env.CONVERSATION_SERVICE_PORT}`);
});
