"use client";

import { motion } from "framer-motion";
import { ArrowUp, CornerDownLeft } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function resize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    requestAnimationFrame(resize);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-5 pt-2">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-[26px] border border-border bg-white/[0.04] backdrop-blur-xl transition-colors duration-200 focus-within:border-accent/50"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            resize();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your database..."
          suppressHydrationWarning
          className="max-h-[200px] w-full resize-none bg-transparent py-4 pl-5 pr-14 text-[14px] text-foreground placeholder:text-muted/70 focus:outline-none"
        />
        <motion.button
          type="button"
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          whileTap={{ scale: 0.92 }}
          suppressHydrationWarning
          className={cn(
            "focus-ring absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
            value.trim() && !disabled
              ? "bg-gradient-to-r from-accent to-accent-deep text-white shadow-[0_6px_16px_-4px_rgba(99,102,241,0.6)]"
              : "bg-white/[0.06] text-muted"
          )}
          aria-label="Send message"
        >
          <ArrowUp size={16} />
        </motion.button>
      </motion.div>
      <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted/60">
        <CornerDownLeft size={11} />
        <span>to send</span>
        <span className="mx-1">·</span>
        <span>Shift + Enter for a new line</span>
      </div>
    </div>
  );
}
