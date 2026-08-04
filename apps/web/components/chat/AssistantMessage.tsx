"use client";

import { motion } from "framer-motion";
import { Database } from "lucide-react";
import { useState } from "react";
import { mockResult, type QueryResult } from "@/lib/mock-data";
import { ResultTable } from "./ResultTable";
import { SQLCard } from "./SQLCard";

interface AssistantMessageProps {
  reply: string;
  sql: string;
  result?: QueryResult;
}

export function AssistantMessage({ reply, sql, result = mockResult }: AssistantMessageProps) {
  const [explained, setExplained] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);

  function handleExecute() {
    setExecuting(true);
    setTimeout(() => {
      setExecuting(false);
      setExecuted(true);
    }, 900);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex gap-3"
    >
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-deep">
        <Database size={13} className="text-white" />
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <p className="text-[13.5px] leading-relaxed text-foreground">{reply}</p>
        <SQLCard
          sql={sql}
          onExplain={() => setExplained(true)}
          onExecute={handleExecute}
          isExplained={explained}
          isExecuting={executing}
          isExecuted={executed}
        />
        {executed && <ResultTable result={result} />}
      </div>
    </motion.div>
  );
}
