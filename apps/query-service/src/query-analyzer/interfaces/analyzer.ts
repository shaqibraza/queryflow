import { QueryAnalysis } from "../types/query-analysis.js";

export interface Analyzer<TQuery = unknown> {
  analyze(query: TQuery): QueryAnalysis;
}
