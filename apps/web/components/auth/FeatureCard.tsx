"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group glass relative flex items-start gap-3.5 rounded-xl2 p-4 transition-colors duration-300 hover:border-accent/40 hover:shadow-[0_0_32px_-8px_rgba(99,102,241,0.35)]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white/[0.03] text-accent-soft transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:animate-float">
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <div>
        <h3 className="text-[14px] font-medium text-foreground">{title}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">{description}</p>
      </div>
    </motion.div>
  );
}
