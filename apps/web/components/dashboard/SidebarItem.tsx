"use client";

import { motion } from "framer-motion";
import { Check, Loader2, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
  label: string;
  meta?: string;
  active?: boolean;
  onClick?: () => void;

  onRename?: (title: string) => void;
  onDelete?: () => void;

  isLoading?: boolean;
}

export function SidebarItem({
  label,
  meta,
  active,
  onClick,
  onRename,
  onDelete,
  isLoading = false
}: SidebarItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(label);

  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(label);
  }, [label]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function startRename() {
    setMenuOpen(false);
    setEditing(true);
  }

  function cancelRename() {
    setTitle(label);
    setEditing(false);
  }

  function submitRename() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitle(label);
      setEditing(false);
      return;
    }

    if (trimmedTitle === label) {
      setEditing(false);
      return;
    }

    onRename?.(trimmedTitle);
    setEditing(false);
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      submitRename();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelRename();
    }
  }

  return (
    <div className="group relative">
      {editing ? (
        <div
          className={cn(
            "flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5",
            "bg-white/[0.05] ring-1 ring-accent/40"
          )}
        >
          <input
            ref={inputRef}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={isLoading}
            className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none"
          />

          <button
            type="button"
            onClick={submitRename}
            disabled={isLoading}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-success transition hover:bg-success/10 disabled:opacity-50"
            aria-label="Save conversation name"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          </button>

          <button
            type="button"
            onClick={cancelRename}
            disabled={isLoading}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted transition hover:bg-white/[0.05] hover:text-foreground disabled:opacity-50"
            aria-label="Cancel rename"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <motion.button
          type="button"
          onClick={onClick}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          suppressHydrationWarning
          className={cn(
            "focus-ring group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 pr-9 text-left text-[13px] transition-colors duration-150",
            active
              ? "bg-accent/10 text-foreground"
              : "text-muted hover:bg-white/[0.05] hover:text-foreground",
            isLoading && "cursor-not-allowed opacity-60"
          )}
        >
          <span className="min-w-0 flex-1 truncate">{label}</span>

          {meta && <span className="shrink-0 text-[11px] text-muted/70">{meta}</span>}
        </motion.button>
      )}

      {!editing && (
        <div ref={menuRef} className="absolute right-1.5 top-1/2 z-20 -translate-y-1/2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen((previous) => !previous);
            }}
            disabled={isLoading}
            aria-label="Conversation options"
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md",
              "text-muted opacity-0 transition-all",
              "hover:bg-white/[0.08] hover:text-foreground",
              "group-hover:opacity-100",
              menuOpen && "bg-white/[0.08] text-foreground opacity-100"
            )}
          >
            <MoreHorizontal size={15} />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-32 overflow-hidden rounded-lg border border-border bg-[#111116] p-1 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={startRename}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-foreground transition hover:bg-white/[0.06]"
              >
                <Pencil size={13} />
                Rename
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete?.();
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-danger transition hover:bg-danger/10"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
