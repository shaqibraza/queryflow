"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Example {
  prompt: string;
  query: string;
  dialect: string;
}

const EXAMPLES: Example[] = [
  {
    prompt: "Show me users who signed up this week",
    dialect: "PostgreSQL",
    query: "SELECT * FROM users\nWHERE created_at >= now() - interval '7 days';"
  },
  {
    prompt: "Find orders over $500 that are still pending",
    dialect: "MySQL",
    query: "SELECT * FROM orders\nWHERE total > 500 AND status = 'pending';"
  },
  {
    prompt: "Group customers by country",
    dialect: "MongoDB",
    query: "db.customers.aggregate([\n  { $group: { _id: '$country', count: { $sum: 1 } } }\n]);"
  }
];

export function QueryPreview() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % EXAMPLES.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  const current = EXAMPLES[index];

  return (
    <div className="glass w-full max-w-[420px] rounded-xl2 p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]/70" />
        </div>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted">
          {current.dialect}
        </span>
      </div>

      <div className="mb-3 flex items-start gap-2 rounded-xl border border-border/80 bg-white/[0.02] px-3 py-2.5">
        <span className="mt-0.5 text-accent-soft">✦</span>
        <AnimatePresence mode="wait">
          <motion.p
            key={current.prompt}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-[13px] leading-relaxed text-foreground/90"
          >
            {current.prompt}
          </motion.p>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.pre
          key={current.query}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
          className="overflow-x-auto whitespace-pre rounded-xl bg-black/40 px-3 py-2.5 font-mono text-[12px] leading-relaxed text-accent-soft"
        >
          {current.query}
        </motion.pre>
      </AnimatePresence>
    </div>
  );
}
