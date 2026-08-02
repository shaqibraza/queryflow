import { ResultFormatter } from "../interfaces/result-formatter.js";
import { FormattedResult } from "../types/formatted-result.js";

interface PostgresResult {
  rows: Record<string, unknown>[];
  rowCount: number;
}

export class PostgresResultFormatter implements ResultFormatter<PostgresResult> {
  format(result: PostgresResult): FormattedResult {
    return {
      columns: result.rows.length ? Object.keys(result.rows[0]) : [],

      rows: result.rows,

      count: result.rowCount
    };
  }
}
