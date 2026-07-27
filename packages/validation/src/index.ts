import { z } from "zod";

export const healthResponseSchema = z.object({
  service: z.string().min(1),
  status: z.literal("ok"),
  timestamp: z.string().datetime()
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(25)
});
