export interface FormattedResult {
  columns: string[];

  rows: Record<string, unknown>[];

  count: number;
}
