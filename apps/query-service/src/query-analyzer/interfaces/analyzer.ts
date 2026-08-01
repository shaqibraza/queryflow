import { QueryAnalysis } from "../types/query-analysis.js";

export interface Analyzer {
  analyze(query: string): QueryAnalysis;
}
