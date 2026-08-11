import dotenv from "dotenv";
import path from "node:path";

// Load environment BEFORE importing anything else
dotenv.config({
  path: path.resolve(process.cwd(), "../../.env")
});

const { createApp } = await import("./app.js");
const app = createApp();
const port = process.env.PORT || process.env.AUTH_SERVICE_PORT || 4001;

app.listen(port, () => {
  console.log(`Auth Service running on ${port}`);
});
