"use client";

import { motion } from "framer-motion";
import { Database } from "lucide-react";
import { useState } from "react";
import { ResultTable } from "./ResultTable";
import { SQLCard } from "./SQLCard";

interface AssistantMessageProps {
  reply: string;

  sql?: string;

  result?: any;

  analysis?: {
    type: string;
    requiresConfirmation: boolean;
    firstKeyword: string;
  };
}

export function AssistantMessage({ reply, sql, result, analysis }: AssistantMessageProps) {
  const [explained, setExplained] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);

  function handleExecute() {
    console.log("Execute confirmed.");

    setExecuted(true);
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
        {sql && (
          <SQLCard
            sql={sql}
            onExplain={() => setExplained(true)}
            onExecute={handleExecute}
            isExplained={explained}
            isExecuting={executing}
            isExecuted={executed}
          />
        )}
        {result && <ResultTable result={result} />}
        {analysis?.requiresConfirmation && (
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-300">
            This query modifies data and requires confirmation before execution.
          </div>
        )}
      </div>
    </motion.div>
  );
}
