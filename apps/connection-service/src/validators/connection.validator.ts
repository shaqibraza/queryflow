import * as z from "zod";
import { DatabaseType } from "@queryflow/database";

export const createConnectionSchema = z.object({
  name: z.string().trim().min(3).max(50),

  databaseType: z.nativeEnum(DatabaseType),

  databaseUrl: z.string().url()
});

export type CreateConnectionInput = z.infer<typeof createConnectionSchema>;
