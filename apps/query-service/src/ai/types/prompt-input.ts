import { CompleteMetadata } from "../../metadata/complete-metadata.js";

export interface PromptInput {
  question: string;

  metadata: CompleteMetadata;
}
