import { z } from "zod";

export const createAssistantMessageSchema = z.object({
  reply: z
    .string({
      required_error: "Reply is required."
    })
    .trim()
    .min(1),

  generatedQuery: z.string().optional(),

  analysis: z.unknown().optional(),

  result: z.unknown().optional()
});
