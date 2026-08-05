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
        return <Circle size={12} className="fill-current" />;

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
          className="focus-ring flex items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-3 py-2 text-[13px] font-medium transition-colors duration-200 hover:bg-white/[0.05]"
        >
          {selected ? (
            <>
              <span className="text-accent">{getDatabaseIcon(selected.databaseType)}</span>

              <span className="max-w-[130px] truncate">{selected.name}</span>

              <span className="text-muted">· {selected.databaseType}</span>
            </>
          ) : (
            <>
              <Database size={15} />
              No Connection
            </>
          )}

          <ChevronDown
            size={14}
            className={cn("transition-transform duration-200", open && "rotate-180")}
          />
        </button>

        <AnimatePresence>
          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

              <motion.div
                initial={{
                  opacity: 0,
                  y: -8
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  y: -8
                }}
                transition={{
                  duration: 0.15
                }}
                className="absolute left-0 top-[calc(100%+8px)] z-50 w-80 overflow-hidden rounded-xl border border-border bg-[#0d0d12]/95 p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,.7)] backdrop-blur-xl"
              >
                {connections.length === 0 ? (
                  <div className="px-3 py-5 text-center text-sm text-muted">
                    No database connections
                  </div>
                ) : (
                  connections.map((connection) => (
                    <div
                      key={connection.id}
                      onClick={() => {
                        onSelect(connection);
                        setOpen(false);
                      }}
                      className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-150 hover:bg-white/[0.05]"
                    >
                      <div className="text-accent">{getDatabaseIcon(connection.databaseType)}</div>

                      <div className="min-w-0 flex-1 text-left">
                        <p className="truncate text-sm font-medium text-foreground">
                          {connection.name}
                        </p>

                        <p className="text-xs text-muted">{connection.databaseType}</p>
                      </div>

                      {selected?.id === connection.id && (
                        <Check size={15} className="text-accent" />
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          setOpen(false);

                          setConnectionToDelete(connection);

                          setDeleteOpen(true);
                        }}
                        className="rounded-md p-1 text-muted opacity-0 transition duration-150 hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))
                )}

                <div className="my-2 h-px bg-border" />

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);

                    onAddConnection();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/[0.05]"
                >
                  <Plus size={16} />
                  Add Connection
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
