"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon?: LucideIcon;
  label: string;
  meta?: string;
  active?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ icon: Icon, label, meta, active, onClick }: SidebarItemProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      suppressHydrationWarning
      className={cn(
        "focus-ring group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors duration-150",
        active
          ? "bg-accent/10 text-foreground"
          : "text-muted hover:bg-white/[0.05] hover:text-foreground"
      )}
    >
      {Icon && (
        <Icon
          size={15}
          className={cn(
            "shrink-0 transition-colors duration-150",
            active ? "text-accent" : "text-muted group-hover:text-foreground"
          )}
        />
      )}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {meta && <span className="shrink-0 text-[11px] text-muted/70">{meta}</span>}
    </motion.button>
  );
}
