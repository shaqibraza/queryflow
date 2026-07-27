import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATASET_SERVICE_PORT: z.coerce.number().int().positive().default(4002)
});

export const env = envSchema.parse(process.env);
