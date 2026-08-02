import { ResultFormatter } from "../interfaces/result-formatter.js";
import { FormattedResult } from "../types/formatted-result.js";

export class MongoDbResultFormatter implements ResultFormatter<Record<string, unknown>[]> {
  format(rows: Record<string, unknown>[]): FormattedResult {
    return {
      columns: rows.length ? Object.keys(rows[0]) : [],

      rows,

      count: rows.length
    };
  }
}
