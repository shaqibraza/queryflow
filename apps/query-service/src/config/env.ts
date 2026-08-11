import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  PORT: z.coerce.number().int().positive().default(4003),

  FRONTEND_URL: z.string().url().default("http://localhost:3000"),

  CONNECTION_SERVICE_URL: z.string().url(),

  GEMINI_API_KEY: z.string().min(1),

  CONVERSATION_SERVICE_URL: z.string().url()
});

export const env = envSchema.parse(process.env);
