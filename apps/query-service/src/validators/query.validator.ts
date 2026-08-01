import * as z from "zod";

export const querySchema = z.object({
  connectionId: z.string().min(1).nonempty({ message: "Connection ID is required" }),

  question: z.string().min(1).nonempty({ message: "Query is required" })
});

export type QueryDto = z.infer<typeof querySchema>;
