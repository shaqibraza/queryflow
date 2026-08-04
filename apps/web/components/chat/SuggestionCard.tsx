"use client";

import { motion } from "framer-motion";
import { Copy, PackageX, TrendingUp, Users, type LucideIcon } from "lucide-react";
import type { Suggestion } from "@/lib/mock-data";
import { GlassCard } from "@/components/ui/GlassCard";

const iconMap: Record<Suggestion["icon"], LucideIcon> = {
  users: Users,
  "trending-up": TrendingUp,
  "copy-x": Copy,
  "package-x": PackageX
};

interface SuggestionCardProps {
  suggestion: Suggestion;
  onSelect: (suggestion: Suggestion) => void;
  delay?: number;
}

export function SuggestionCard({ suggestion, onSelect, delay = 0 }: SuggestionCardProps) {
  const Icon = iconMap[suggestion.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -2 }}
    >
      <GlassCard
        interactive
        onClick={() => onSelect(suggestion)}
        className="flex h-full flex-col gap-3 p-4"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon size={16} />
        </div>
        <div>
          <p className="text-[13.5px] font-medium text-foreground">{suggestion.label}</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{suggestion.description}</p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
