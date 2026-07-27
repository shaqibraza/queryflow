import { env } from "./config/env.js";
import { createApp } from "./app.js";

const app = createApp();

app.listen(env.AI_ORCHESTRATOR_PORT, () => {
  console.log(`ai-orchestrator listening on port ${env.AI_ORCHESTRATOR_PORT}`);
});
