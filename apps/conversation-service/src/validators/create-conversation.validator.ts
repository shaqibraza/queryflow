import { z } from "zod";

export const createConversationSchema = z.object({
  connectionId: z
    .string({
      required_error: "Connection ID is required."
    })
    .min(1, "Connection ID is required."),

  firstQuestion: z
    .string({
      required_error: "First question is required."
    })
    .trim()
    .min(1, "First question cannot be empty.")
    .max(5000, "Question is too long.")
});
