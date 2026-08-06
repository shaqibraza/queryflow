"use client";

import { CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface Props {
  result: {
    type: "WRITE";
    command: string;
    affectedRows: number;
  };
}

export function ExecutionResult({ result }: Props) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-500" />

        <div>
          <p className="font-medium text-foreground">Query executed successfully</p>

          <p className="mt-1 text-sm text-muted-foreground">
            {result.command} affected {result.affectedRows} row
            {result.affectedRows === 1 ? "" : "s"}.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
