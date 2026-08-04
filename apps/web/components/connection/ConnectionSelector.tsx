"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Circle } from "lucide-react";
import { useState } from "react";
import { connections, type Connection } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const environmentDot: Record<Connection["environment"], string> = {
  production: "text-success",
  staging: "text-accent",
  local: "text-muted"
};

export function ConnectionSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Connection>(connections[0]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        suppressHydrationWarning
        className="focus-ring flex items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-3 py-2 text-[13px] font-medium text-foreground transition-colors duration-200 hover:bg-white/[0.06]"
      >
        <Circle size={8} className={cn("fill-current", environmentDot[selected.environment])} />
        {selected.name}
        <span className="text-muted/60">·</span>
        <span className="text-muted">{selected.engine}</span>
        <ChevronDown
          size={14}
          className={cn("text-muted transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-[calc(100%+8px)] z-40 w-64 overflow-hidden rounded-xl border border-border bg-[#0d0d12]/95 p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            >
              {connections.map((conn) => (
                <button
                  key={conn.id}
                  type="button"
                  onClick={() => {
                    setSelected(conn);
                    setOpen(false);
                  }}
                  suppressHydrationWarning
                  className="focus-ring flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors duration-150 hover:bg-white/[0.05]"
                >
                  <Circle
                    size={8}
                    className={cn("fill-current", environmentDot[conn.environment])}
                  />
                  <span className="flex-1">
                    <span className="block text-foreground">{conn.name}</span>
                    <span className="block text-[11.5px] text-muted">
                      {conn.engine} · {conn.status}
                    </span>
                  </span>
                  {conn.id === selected.id && <Check size={14} className="text-accent" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
