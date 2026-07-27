import "dotenv/config";
import { z } from "zod";

export const nodeEnvSchema = z.enum(["development", "test", "production"]).default("development");

export const baseEnvSchema = z.object({
  NODE_ENV: nodeEnvSchema,
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32).optional(),
  GEMINI_API_KEY: z.string().min(1).optional()
});

export type BaseEnv = z.infer<typeof baseEnvSchema>;

export const loadEnv = <Schema extends z.ZodTypeAny>(schema: Schema): z.infer<Schema> => {
  return schema.parse(process.env);
};

export const baseEnv = (): BaseEnv => loadEnv(baseEnvSchema);
