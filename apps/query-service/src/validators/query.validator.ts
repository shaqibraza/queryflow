import { z } from "zod";

export const querySchema = z.object({
  connectionId: z.string().min(1, "Connection ID is required"),

  question: z.string().trim().min(1, "Question is required"),

  conversationId: z.string().min(1, "Conversation ID cannot be empty").optional()
});
