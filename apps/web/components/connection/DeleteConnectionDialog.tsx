"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { ConnectionService } from "@/src/services/connection.service";

interface DeleteConnectionDialogProps {
  open: boolean;
  connectionId: string;
  connectionName: string;
  onClose: () => void;
  onDeleted: () => Promise<void>;
}

export function DeleteConnectionDialog({
  open,
  connectionId,
  connectionName,
  onClose,
  onDeleted
}: DeleteConnectionDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);

      await ConnectionService.deleteConnection(connectionId);

      await onDeleted();

      onClose();
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
            className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-border bg-[#0d0d12] p-7 shadow-2xl"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15">
                <AlertTriangle className="text-red-400" size={28} />
              </div>

              <h2 className="mt-5 text-center text-xl font-semibold">Delete Connection</h2>

              <p className="mt-3 text-center text-sm text-muted">Are you sure you want to delete</p>

              <p className="mt-2 text-center font-semibold text-foreground">{connectionName}</p>

              <p className="mt-4 text-center text-xs text-muted">This action cannot be undone.</p>

              <div className="mt-8 flex gap-3">
                <button onClick={onClose} className="h-11 flex-1 rounded-xl border border-border">
                  Cancel
                </button>

                <button
                  disabled={loading}
                  onClick={handleDelete}
                  className="h-11 flex-1 rounded-xl bg-red-600 font-medium text-white"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
