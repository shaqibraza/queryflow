"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Database, Plus, Trash2, Server, Circle } from "lucide-react";

import { DeleteConnectionDialog } from "./DeleteConnectionDialog";

import { cn } from "@/lib/utils";
import type { DatabaseType } from "@/src/services/connection.service";

export interface DatabaseConnection {
  id: string;
  name: string;
  databaseType: DatabaseType;
  createdAt: string;
}

interface ConnectionSelectorProps {
  connections: DatabaseConnection[];
  selected: DatabaseConnection | null;
  onSelect: (connection: DatabaseConnection) => void;
  onRefresh: () => Promise<void>;
  onAddConnection: () => void;
}

export function ConnectionSelector({
  connections,
  selected,
  onSelect,
  onRefresh,
  onAddConnection
}: ConnectionSelectorProps) {
  const [open, setOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [connectionToDelete, setConnectionToDelete] = useState<DatabaseConnection | null>(null);

  function getDatabaseIcon(type: DatabaseType) {
    switch (type) {
      case "POSTGRESQL":
        return <Database size={15} />;

      case "MYSQL":
        return <Server size={15} />;

      case "MONGODB":
        return <Circle size={11} className="fill-current" />;

      default:
        return <Database size={15} />;
    }
  }

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="focus-ring flex h-11 items-center gap-3 rounded-xl border border-border bg-white/[0.03] px-4 transition-all duration-200 hover:border-accent/30 hover:bg-white/[0.05]"
        >
          {selected ? (
            <>
              <span className="text-accent">{getDatabaseIcon(selected.databaseType)}</span>

              <div className="flex flex-col items-start">
                <span className="max-w-[150px] truncate text-sm font-medium">{selected.name}</span>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  <span className="text-[11px] uppercase tracking-wide text-muted">
                    {selected.databaseType}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <Database size={15} />
              <span>No Connection</span>
            </>
          )}

          <ChevronDown
            size={15}
            className={cn("ml-1 transition-transform duration-200", open && "rotate-180")}
          />
        </button>

        <AnimatePresence>
          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-[calc(100%+8px)] z-50 w-80 overflow-hidden rounded-2xl border border-border bg-[#0d0d12]/95 p-2 shadow-2xl backdrop-blur-xl"
              >
                {connections.length === 0 ? (
                  <div className="py-8 text-center">
                    <Database size={26} className="mx-auto mb-3 text-muted" />

                    <p className="text-sm font-medium">No connections found</p>

                    <p className="mt-1 text-xs text-muted">
                      Create your first database connection.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {connections.map((connection) => {
                      const active = selected?.id === connection.id;

                      return (
                        <div
                          key={connection.id}
                          onClick={() => {
                            onSelect(connection);
                            setOpen(false);
                          }}
                          className={cn(
                            "group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-all duration-150",
                            active ? "bg-accent/10" : "hover:bg-white/[0.05]"
                          )}
                        >
                          <div className="text-accent">
                            {getDatabaseIcon(connection.databaseType)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{connection.name}</p>

                            <div className="mt-1 flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />

                              <span className="rounded-md bg-white/[0.05] px-2 py-[2px] text-[10px] font-medium uppercase tracking-wide text-muted">
                                {connection.databaseType}
                              </span>
                            </div>
                          </div>

                          {active && <Check size={16} className="text-accent" />}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();

                              setOpen(false);

                              setConnectionToDelete(connection);

                              setDeleteOpen(true);
                            }}
                            className="rounded-lg p-2 text-muted opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="my-2 h-px bg-border" />

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);

                    onAddConnection();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-white/[0.05]"
                >
                  <Plus size={16} />

                  <span>Add Connection</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {connectionToDelete && (
        <DeleteConnectionDialog
          open={deleteOpen}
          connectionId={connectionToDelete.id}
          connectionName={connectionToDelete.name}
          onClose={() => {
            setDeleteOpen(false);
            setConnectionToDelete(null);
          }}
          onDeleted={async () => {
            await onRefresh();

            setDeleteOpen(false);

            setConnectionToDelete(null);
          }}
        />
      )}
    </>
  );
}
