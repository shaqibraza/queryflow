"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { formatValue } from "@/lib/format-value";

interface TableCellProps {
  column: string;
  value: unknown;
}

export function TableCell({ column, value }: TableCellProps) {
  const [copied, setCopied] = useState(false);

  const isIdColumn = column === "id" || column.endsWith("Id") || column.endsWith("_id");

  async function copy() {
    if (value == null) return;

    await navigator.clipboard.writeText(String(value));

    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  }

  if (isIdColumn && typeof value === "string" && value.length > 12) {
    return (
      <div className="group flex items-center gap-2" title={value}>
        <span className="font-mono">
          {value.slice(0, 6)}...
          {value.slice(-6)}
        </span>

        <button onClick={copy} className="opacity-0 transition group-hover:opacity-100">
          {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
        </button>
      </div>
    );
  }

  return <>{formatValue(value)}</>;
}
