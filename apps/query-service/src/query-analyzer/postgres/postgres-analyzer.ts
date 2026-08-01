import { Analyzer } from "../interfaces/analyzer.js";
import { QueryAnalysis } from "../types/query-analysis.js";

const READ_KEYWORDS = ["SELECT", "WITH", "SHOW", "EXPLAIN", "VALUES"];

const WRITE_KEYWORDS = ["INSERT", "UPDATE", "DELETE", "MERGE"];

const DDL_KEYWORDS = ["CREATE", "ALTER", "DROP", "TRUNCATE", "REINDEX"];

const TRANSACTION_KEYWORDS = ["BEGIN", "COMMIT", "ROLLBACK", "SAVEPOINT"];

export class PostgresAnalyzer implements Analyzer {
  analyze(query: string): QueryAnalysis {
    const sql = query.trim();

    if (!sql) {
      return {
        type: "UNKNOWN",
        requiresConfirmation: true,
        firstKeyword: ""
      };
    }

    const firstKeyword = sql.split(/\s+/)[0].toUpperCase();

    if (READ_KEYWORDS.includes(firstKeyword)) {
      return {
        type: "READ",
        requiresConfirmation: false,
        firstKeyword
      };
    }

    if (WRITE_KEYWORDS.includes(firstKeyword)) {
      return {
        type: "WRITE",
        requiresConfirmation: true,
        firstKeyword
      };
    }

    if (DDL_KEYWORDS.includes(firstKeyword)) {
      return {
        type: "DDL",
        requiresConfirmation: true,
        firstKeyword
      };
    }

    if (TRANSACTION_KEYWORDS.includes(firstKeyword)) {
      return {
        type: "TRANSACTION",
        requiresConfirmation: true,
        firstKeyword
      };
    }

    return {
      type: "UNKNOWN",
      requiresConfirmation: true,
      firstKeyword
    };
  }
}
