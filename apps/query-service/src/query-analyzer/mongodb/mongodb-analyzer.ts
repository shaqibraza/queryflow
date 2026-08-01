import { Analyzer } from "../interfaces/analyzer.js";
import { QueryAnalysis } from "../types/query-analysis.js";

export class MongoDbAnalyzer implements Analyzer {
  analyze(query: string): QueryAnalysis {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return {
        type: "UNKNOWN",
        requiresConfirmation: true,
        firstKeyword: ""
      };
    }

    // READ Operations
    if (
      normalized.includes(".find(") ||
      normalized.includes(".findone(") ||
      normalized.includes(".aggregate(") ||
      normalized.includes(".countdocuments(") ||
      normalized.includes(".estimateddocumentcount(") ||
      normalized.includes(".distinct(")
    ) {
      return {
        type: "READ",
        requiresConfirmation: false,
        firstKeyword: "READ"
      };
    }

    // WRITE Operations
    if (
      normalized.includes(".insertone(") ||
      normalized.includes(".insertmany(") ||
      normalized.includes(".updateone(") ||
      normalized.includes(".updatemany(") ||
      normalized.includes(".replaceone(") ||
      normalized.includes(".deleteone(") ||
      normalized.includes(".deletemany(") ||
      normalized.includes(".findoneandupdate(") ||
      normalized.includes(".findoneanddelete(")
    ) {
      return {
        type: "WRITE",
        requiresConfirmation: true,
        firstKeyword: "WRITE"
      };
    }

    // DDL Operations
    if (
      normalized.includes(".createindex(") ||
      normalized.includes(".dropindex(") ||
      normalized.includes(".dropindexes(") ||
      normalized.includes(".drop(") ||
      normalized.includes("db.createcollection(")
    ) {
      return {
        type: "DDL",
        requiresConfirmation: true,
        firstKeyword: "DDL"
      };
    }

    // Transaction Operations
    if (
      normalized.includes("starttransaction(") ||
      normalized.includes("committransaction(") ||
      normalized.includes("aborttransaction(")
    ) {
      return {
        type: "TRANSACTION",
        requiresConfirmation: true,
        firstKeyword: "TRANSACTION"
      };
    }

    return {
      type: "UNKNOWN",
      requiresConfirmation: true,
      firstKeyword: "UNKNOWN"
    };
  }
}
