export interface FormattedResult {
  columns: {
    key: string;
    label: string;
  }[];

  rows: Record<string, unknown>[];

  totalRows: number;
}
