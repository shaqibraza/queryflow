"use client";

import { motion } from "framer-motion";
import { IconDatabase, IconSparkles } from "@tabler/icons-react";
import BorderBeam from "../ui/border-beam";

const columns = ["id", "name", "email", "last_active"];
const rows = [
  ["102", "Shaqib Raza", "shaqib@acme.io", "2m ago"],
  ["117", "Marcus Lee", "marcus@acme.io", "14m ago"],
  ["089", "Mr. Khan", "sara@acme.io", "1h ago"]
];

export function ChatMockup() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-full max-w-md"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113]/90 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <BorderBeam beamLength={160} color="#818cf8" colorTo="#ffffff" duration={7} />

        {/* window chrome */}
        <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="ml-2 text-xs text-zinc-500">QueryFlow — session</span>
        </div>

        <div className="flex flex-col gap-4 p-5">
          {/* user message */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[#6366F1] px-4 py-2.5 text-sm text-white"
          >
            Show all active users
          </motion.div>

          {/* assistant — generated SQL */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex max-w-[92%] items-start gap-2.5"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
              <IconSparkles size={13} className="text-indigo-300" />
            </span>
            <div className="rounded-2xl rounded-tl-sm border border-white/[0.06] bg-white/[0.03] px-4 py-3">
              <p className="mb-2 text-xs font-medium text-zinc-400">Generated SQL</p>
              <pre className="overflow-x-auto text-[11.5px] leading-relaxed text-indigo-200">
                <code>
                  {`SELECT id, name, email, last_active
FROM users
WHERE status = 'active'
ORDER BY last_active DESC;`}
                </code>
              </pre>
            </div>
          </motion.div>

          {/* results table */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="overflow-hidden rounded-xl border border-white/[0.06]"
          >
            <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-3 py-2">
              <IconDatabase size={13} className="text-zinc-500" />
              <span className="text-[11px] font-medium text-zinc-400">3 rows returned</span>
            </div>
            <table className="w-full text-left text-[11.5px]">
              <thead>
                <tr className="text-zinc-500">
                  {columns.map((col) => (
                    <th key={col} className="border-b border-white/[0.06] px-3 py-2 font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                {rows.map((row) => (
                  <tr key={row[0]} className="border-b border-white/[0.04] last:border-0">
                    {row.map((cell, i) => (
                      <td key={i} className="px-3 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
