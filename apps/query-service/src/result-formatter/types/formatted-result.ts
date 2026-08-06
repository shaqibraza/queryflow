export interface ReadResult {
  type: "READ";

  columns: {
    key: string;
    label: string;
  }[];

  rows: Record<string, unknown>[];

  totalRows: number;
}

export interface WriteResult {
  type: "WRITE";

  command: string;

  affectedRows: number;
}

export type FormattedResult = ReadResult | WriteResult;
