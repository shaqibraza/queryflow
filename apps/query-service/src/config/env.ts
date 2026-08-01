import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  QUERY_SERVICE_PORT: z.coerce.number().int().positive().default(4003),
  CONNECTION_SERVICE_URL: z.string().url(),
  GEMINI_API_KEY: z.string().min(1)
});

export const env = envSchema.parse(process.env);
