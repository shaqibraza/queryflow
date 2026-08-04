"use client";

import { motion } from "framer-motion";
import { Database, Plus, ShieldCheck, Sparkles } from "lucide-react";

interface EmptyConnectionCardProps {
  onCreateConnection: () => void;
}

export function EmptyConnectionCard({ onCreateConnection }: EmptyConnectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto w-full max-w-2xl rounded-3xl border border-border bg-[#0d0d12]/75 p-10 shadow-[0_20px_60px_-20px_rgba(0,0,0,.65)] backdrop-blur-xl"
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-deep">
          <Database size={34} className="text-white" />
        </div>

        <h2 className="mt-7 text-3xl font-semibold text-foreground">Connect your first database</h2>

        <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
          QueryFlow needs at least one database connection before you can generate SQL, inspect
          schemas, and chat with your data.
        </p>

        <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white/[0.03] p-4">
            <Sparkles size={18} className="mb-2 text-accent" />

            <p className="text-sm font-medium text-foreground">AI SQL</p>

            <p className="mt-1 text-xs text-muted">Generate SQL from natural language.</p>
          </div>

          <div className="rounded-xl border border-border bg-white/[0.03] p-4">
            <Database size={18} className="mb-2 text-accent" />

            <p className="text-sm font-medium text-foreground">Schema Explorer</p>

            <p className="mt-1 text-xs text-muted">Browse tables and relationships.</p>
          </div>

          <div className="rounded-xl border border-border bg-white/[0.03] p-4">
            <ShieldCheck size={18} className="mb-2 text-accent" />

            <p className="text-sm font-medium text-foreground">Secure Access</p>

            <p className="mt-1 text-xs text-muted">Your credentials stay encrypted.</p>
          </div>
        </div>

        <button
          onClick={onCreateConnection}
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-deep px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          <Plus size={18} />
          Create Connection
        </button>

        <p className="mt-5 text-xs text-muted">PostgreSQL • MySQL • MongoDB</p>
      </div>
    </motion.div>
  );
}
