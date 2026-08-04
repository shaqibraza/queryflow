"use client";

import { motion } from "framer-motion";
import { Check, Copy, Play, Sparkles } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { highlightSql } from "./sql-highlight";

interface SQLCardProps {
  sql: string;
  onExplain: () => void;
  onExecute: () => void;
  isExplained?: boolean;
  isExecuted?: boolean;
  isExecuting?: boolean;
}

export function SQLCard({
  sql,
  onExplain,
  onExecute,
  isExplained,
  isExecuted,
  isExecuting
}: SQLCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — silently ignore in this mock UI
    }
  }

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11.5px] font-medium uppercase tracking-wider text-muted">
          Generated Query
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            suppressHydrationWarning
            className="focus-ring flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium text-muted transition-colors duration-150 hover:bg-white/[0.06] hover:text-foreground"
          >
            {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={onExplain}
            suppressHydrationWarning
            className="focus-ring flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium text-muted transition-colors duration-150 hover:bg-white/[0.06] hover:text-foreground"
          >
            <Sparkles size={13} />
            Explain
          </button>
          <motion.button
            type="button"
            onClick={onExecute}
            disabled={isExecuting}
            whileTap={{ scale: 0.96 }}
            suppressHydrationWarning
            className="focus-ring flex items-center gap-1.5 rounded-md bg-accent/10 px-2.5 py-1 text-[11.5px] font-medium text-accent transition-colors duration-150 hover:bg-accent/20 disabled:opacity-60"
          >
            <Play size={12} className="fill-current" />
            {isExecuting ? "Running..." : isExecuted ? "Re-run" : "Execute"}
          </motion.button>
        </div>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 text-[12.5px] leading-relaxed">
        <code className="font-mono">{highlightSql(sql)}</code>
      </pre>
      {isExplained && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.25 }}
          className="border-t border-border bg-white/[0.02] px-4 py-3"
        >
          <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">
            <Sparkles size={11} className="text-accent" />
            Explanation
          </p>
          <p className="text-[13px] leading-relaxed text-muted">
            This query selects users active within the past 30 days, ordered by most recent activity
            and capped at 50 rows for a fast preview.
          </p>
        </motion.div>
      )}
    </GlassCard>
  );
}
