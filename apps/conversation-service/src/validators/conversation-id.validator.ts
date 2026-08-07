import { z } from "zod";

export const conversationIdSchema = z.object({
  id: z
    .string({
      required_error: "Conversation ID is required."
    })
    .min(1, "Conversation ID is required.")
});
