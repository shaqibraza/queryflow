"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Search, Table2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { GlassCard } from "@/components/ui/GlassCard";
import { formatValue } from "@/lib/format-value";
import { TableCell } from "../ui/TableCell";

interface QueryColumn {
  key: string;
  label: string;
}

interface QueryResult {
  columns: QueryColumn[];
  rows: Record<string, unknown>[];
  totalRows: number;
}

interface ResultTableProps {
  result: QueryResult;
  pageSize?: number;
}

export function ResultTable({ result, pageSize = 10 }: ResultTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [result]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return result.rows;
    }

    return result.rows.filter((row) =>
      Object.values(row).some((value) => formatValue(value).toLowerCase().includes(query))
    );
  }, [result.rows, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
            <Table2 size={14} />
            Results
            <span className="rounded-full border border-border bg-white/[0.03] px-2 py-0.5 text-[10px] normal-case">
              {result.totalRows.toLocaleString()} rows
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search results..."
                className="focus-ring h-8 w-44 rounded-lg border border-border bg-white/[0.03] pl-8 pr-3 text-[12px] placeholder:text-muted/60 sm:w-56"
              />
            </div>

            <button
              type="button"
              className="focus-ring flex h-8 items-center gap-1.5 rounded-lg border border-border bg-white/[0.03] px-3 text-[12px] font-medium text-muted transition hover:text-foreground"
            >
              <Download size={13} />
              Export
            </button>
          </div>
        </div>

        <div className="max-h-[380px] overflow-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead className="sticky top-0 z-10 bg-[#0d0d12]/95 backdrop-blur-xl">
              <tr>
                {result.columns.map((column) => (
                  <th
                    key={column.key}
                    className="whitespace-nowrap border-b border-border px-4 py-3 font-semibold text-muted"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {pageRows.length > 0 ? (
                pageRows.map((row, rowIndex) => (
                  <tr
                    key={String(row.id ?? row._id ?? `${page}-${rowIndex}`)}
                    className="border-b border-border/60 transition-colors hover:bg-white/[0.02]"
                  >
                    {result.columns.map((column) => (
                      <td
                        key={column.key}
                        className="whitespace-nowrap px-4 py-3 text-foreground/90"
                      >
                        <TableCell column={column.key} value={row[column.key]} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={result.columns.length} className="px-4 py-10 text-center text-muted">
                    No rows match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-[12px] text-muted">
          <span>
            Page {page} of {totalPages}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="focus-ring flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="focus-ring flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
