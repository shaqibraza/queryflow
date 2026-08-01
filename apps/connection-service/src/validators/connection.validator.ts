import * as z from "zod";
import { DatabaseType } from "@queryflow/database";

export const createConnectionSchema = z.object({
  name: z.string().trim().min(3).max(50),

  databaseType: z.nativeEnum(DatabaseType),

  databaseUrl: z.string().url()
});

export const updateConnectionSchema = z
  .object({
    name: z.string().trim().min(3).max(50).optional(),
    databaseType: z.nativeEnum(DatabaseType).optional(),
    databaseUrl: z.string().url().optional()
  })
  .refine(
    (data) =>
      data.name !== undefined || data.databaseType !== undefined || data.databaseUrl !== undefined,
    "At least one connection field must be provided"
  );

export type CreateConnectionInput = z.infer<typeof createConnectionSchema>;
export type UpdateConnectionInput = z.infer<typeof updateConnectionSchema>;
