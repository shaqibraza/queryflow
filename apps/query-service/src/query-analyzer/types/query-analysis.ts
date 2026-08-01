export type QueryType = "READ" | "WRITE" | "DDL" | "TRANSACTION" | "UNKNOWN";

export interface QueryAnalysis {
  type: QueryType;

  requiresConfirmation: boolean;

  firstKeyword: string;
}
