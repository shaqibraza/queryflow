import { ResultFormatter } from "../interfaces/result-formatter.js";
import { FormattedResult } from "../types/formatted-result.js";

interface PostgresResult {
  rows: Record<string, unknown>[];
  rowCount: number;
}

export class PostgresResultFormatter implements ResultFormatter<PostgresResult> {
  format(result: PostgresResult): FormattedResult {
    const firstRow = result.rows[0] ?? {};

    return {
      columns: Object.keys(firstRow).map((key) => ({
        key,
        label: this.formatLabel(key)
      })),

      rows: result.rows,

      totalRows: result.rowCount
    };
  }

  private formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^./, (char) => char.toUpperCase());
  }
}
