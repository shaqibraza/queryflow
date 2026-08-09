import { ResultFormatter } from "../interfaces/result-formatter.js";
import { FormattedResult } from "../types/formatted-result.js";

export class MysqlResultFormatter implements ResultFormatter<Record<string, unknown>[]> {
  format(rows: Record<string, unknown>[]): FormattedResult {
    const firstRow = rows[0] ?? {};

    return {
      type: "READ",
      columns: Object.keys(firstRow).map((key) => ({
        key,
        label: this.formatLabel(key)
      })),

      rows,

      totalRows: rows.length
    };
  }

  private formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^./, (char) => char.toUpperCase());
  }
}
