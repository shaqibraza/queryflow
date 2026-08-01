export interface PromptBuilder<TInput = unknown> {
  build(input: TInput): string;
}
