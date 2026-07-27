import { env } from "./config/env.js";
import { createApp } from "./app.js";

const app = createApp();

app.listen(env.GATEWAY_PORT, () => {
  console.log(`gateway listening on port ${env.GATEWAY_PORT}`);
});
