export interface ResponseParser<TInput = string, TOutput = unknown> {
  parse(response: TInput): TOutput;
}
