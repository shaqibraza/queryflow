import { ResultFormatter } from "../interfaces/result-formatter.js";
import { FormattedResult } from "../types/formatted-result.js";

interface PostgresResult {
  command: string;

  rows: Record<string, unknown>[];

  rowCount: number;

  fields: {
    name: string;
    dataTypeId: number;
  }[];
}

export class PostgresResultFormatter implements ResultFormatter<PostgresResult> {
  format(result: PostgresResult): FormattedResult {
    if (result.command !== "SELECT") {
      return {
        type: "WRITE",
        command: result.command,
        affectedRows: result.rowCount
      };
    }

    return {
      type: "READ",

      columns: result.fields.map((field) => ({
        key: field.name,
        label: this.formatLabel(field.name)
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
