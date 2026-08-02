import { FormattedResult } from "../types/formatted-result.js";

export interface ResultFormatter<TInput = unknown> {
  format(result: TInput): FormattedResult;
}
