import dotenv from "dotenv";
import path from "node:path";

// Load environment BEFORE importing anything else
dotenv.config({
  path: path.resolve(process.cwd(), "../../.env")
});

// Import the actual app only after env is loaded
await import("./app.js");
