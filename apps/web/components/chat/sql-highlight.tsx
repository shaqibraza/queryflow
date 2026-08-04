import type { ReactNode } from "react";

const KEYWORDS = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "AND",
  "OR",
  "NOT",
  "ORDER",
  "BY",
  "GROUP",
  "LIMIT",
  "JOIN",
  "LEFT",
  "RIGHT",
  "INNER",
  "OUTER",
  "ON",
  "AS",
  "INSERT",
  "INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE",
  "CREATE",
  "TABLE",
  "ASC",
  "DESC",
  "DISTINCT",
  "COUNT",
  "SUM",
  "AVG",
  "MAX",
  "MIN",
  "HAVING",
  "NOW",
  "INTERVAL",
  "IS",
  "NULL",
  "IN",
  "LIKE",
  "BETWEEN"
]);

export function highlightSql(sql: string): ReactNode[] {
  const tokens = sql.split(/(\s+|,|\(|\)|'[^']*')/g).filter((t) => t.length > 0);

  return tokens.map((token, i) => {
    const upper = token.toUpperCase();
    if (KEYWORDS.has(upper)) {
      return (
        <span key={i} className="text-accent">
          {token}
        </span>
      );
    }
    if (/^'.*'$/.test(token)) {
      return (
        <span key={i} className="text-success">
          {token}
        </span>
      );
    }
    if (/^\d+$/.test(token)) {
      return (
        <span key={i} className="text-foreground/80">
          {token}
        </span>
      );
    }
    if (token === "(" || token === ")" || token === ",") {
      return (
        <span key={i} className="text-muted">
          {token}
        </span>
      );
    }
    return <span key={i}>{token}</span>;
  });
}
