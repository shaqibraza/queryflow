import { z } from "zod";

export const createUserMessageSchema = z.object({
  question: z
    .string({
      required_error: "Question is required."
    })
    .trim()
    .min(1, "Question cannot be empty.")
    .max(10000, "Question is too long.")
});
