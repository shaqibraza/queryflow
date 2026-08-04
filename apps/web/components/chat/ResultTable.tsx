"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Search, Table2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { QueryResult } from "@/lib/mock-data";
import { GlassCard } from "@/components/ui/GlassCard";

interface ResultTableProps {
  result: QueryResult;
  pageSize?: number;
}

export function ResultTable({ result, pageSize = 5 }: ResultTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return result.rows;
    const q = search.toLowerCase();
    return result.rows.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(q))
    );
  }, [result.rows, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <GlassCard className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-wider text-muted">
            <Table2 size={13} />
            Results
            <span className="rounded-full border border-border bg-white/[0.03] px-1.5 py-0.5 text-[10.5px] font-normal normal-case text-muted">
              {result.totalRows} rows
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={13}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search results..."
                suppressHydrationWarning
                className="focus-ring h-8 w-40 rounded-lg border border-border bg-white/[0.03] pl-7 pr-2.5 text-[12px] text-foreground placeholder:text-muted/60 sm:w-52"
              />
            </div>
            <button
              type="button"
              suppressHydrationWarning
              className="focus-ring flex h-8 items-center gap-1.5 rounded-lg border border-border bg-white/[0.03] px-2.5 text-[12px] font-medium text-muted transition-colors duration-150 hover:text-foreground"
            >
              <Download size={13} />
              Export
            </button>
          </div>
        </div>

        <div className="max-h-[340px] overflow-auto">
          <table className="w-full border-collapse text-left text-[12.5px]">
            <thead className="sticky top-0 z-10 bg-[#0d0d12]/95 backdrop-blur-xl">
              <tr>
                {result.columns.map((col) => (
                  <th
                    key={col.key}
                    className="whitespace-nowrap border-b border-border px-4 py-2.5 font-medium text-muted"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-border/60 transition-colors duration-150 last:border-b-0 hover:bg-white/[0.02]"
                >
                  {result.columns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-4 py-2.5 text-foreground/90">
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={result.columns.length} className="px-4 py-8 text-center text-muted">
                    No rows match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[12px] text-muted">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              suppressHydrationWarning
              className="focus-ring flex h-7 w-7 items-center justify-center rounded-md border border-border transition-colors duration-150 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              suppressHydrationWarning
              className="focus-ring flex h-7 w-7 items-center justify-center rounded-md border border-border transition-colors duration-150 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
