import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  CONVERSATION_SERVICE_PORT: z.coerce.number().int().positive().default(4004)
});

export const env = envSchema.parse(process.env);
