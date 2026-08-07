import { z } from "zod";

export const renameConversationSchema = z.object({
  title: z
    .string({
      required_error: "Title is required."
    })
    .trim()
    .min(1, "Title cannot be empty.")
    .max(100, "Title cannot exceed 100 characters.")
});
