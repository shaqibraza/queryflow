"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Database, X } from "lucide-react";
import { useState } from "react";
import { ConnectionService, DatabaseType } from "@/src/services/connection.service";

interface CreateConnectionDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function CreateConnectionDialog({ open, onClose, onCreated }: CreateConnectionDialogProps) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");

  const [databaseType, setDatabaseType] = useState<DatabaseType>("POSTGRESQL");

  const [databaseUrl, setDatabaseUrl] = useState("");

  async function handleCreate() {
    try {
      setLoading(true);

      await ConnectionService.createConnection({
        name,
        databaseType,
        databaseUrl
      });

      onCreated?.();

      onClose();

      setName("");
      setDatabaseUrl("");
      setDatabaseType("POSTGRESQL");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-2xl border border-border bg-[#0d0d12] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-deep">
                    <Database size={18} className="text-white" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Create Connection</h2>

                    <p className="text-xs text-muted">Connect a new database</p>
                  </div>
                </div>

                <button onClick={onClose} className="rounded-lg p-2 hover:bg-white/[0.05]">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">Connection Name</label>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Production Database"
                    className="h-11 w-full rounded-xl border border-border bg-background px-4"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Database Type</label>

                  <select
                    value={databaseType}
                    onChange={(e) => setDatabaseType(e.target.value as DatabaseType)}
                    className="h-11 w-full rounded-xl border border-border bg-background px-4"
                  >
                    <option value="POSTGRESQL">PostgreSQL</option>

                    <option value="MYSQL">MySQL</option>

                    <option value="MONGODB">MongoDB</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Database URL</label>

                  <textarea
                    rows={4}
                    value={databaseUrl}
                    onChange={(e) => setDatabaseUrl(e.target.value)}
                    placeholder="postgresql://username:password@localhost:5432/db"
                    className="w-full rounded-xl border border-border bg-background p-4"
                  />
                </div>

                <button
                  disabled={loading}
                  onClick={handleCreate}
                  className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-accent to-accent-deep font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Creating..." : "Create Connection"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
