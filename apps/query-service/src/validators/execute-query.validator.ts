import { z } from "zod";

export const executeQuerySchema = z.object({
  connectionId: z.string().min(1),

  query: z.unknown()
});
