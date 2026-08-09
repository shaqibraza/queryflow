"use client";

import { motion } from "framer-motion";
import { Database, MessagesSquare, ShieldCheck, Sparkles } from "lucide-react";
import { AmbientBackground } from "./AmbientBackground";
import { FeatureCard } from "./FeatureCard";
import { Logo } from "./Logo";
import { QueryPreview } from "./QueryPreview";

const FEATURES = [
  {
    icon: MessagesSquare,
    title: "Natural Language Queries",
    description:
      "Describe what you need in plain English and generate production-ready database queries instantly."
  },
  {
    icon: ShieldCheck,
    title: "Safe Execution",
    description: "Review every generated query before execution with built-in safety checks."
  },
  {
    icon: Database,
    title: "Multiple Databases",
    description: "Supports PostgreSQL, MySQL and MongoDB with a unified AI experience."
  }
];

export function MarketingPanel() {
  return (
    <div className="relative flex min-h-[480px] flex-col overflow-hidden items-center bg-background px-8 py-32 lg:h-full lg:px-16 lg:py-36 xl:px-20">
      <AmbientBackground />

      <div className="relative z-10 flex h-full flex-col">
        <Logo />

        <div className="mt-14 max-w-[520px] lg:mt-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[12px] font-medium text-accent-soft"
          >
            <Sparkles size={13} strokeWidth={2} />
            AI Powered Database Workspace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-5 text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.12] tracking-tight text-foreground"
          >
            Create Your QueryFlow Account
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-4 max-w-[460px] text-[15px] leading-relaxed text-muted"
          >
            Start exploring your databases with AI-powered natural language queries. Connect
            PostgreSQL, MySQL or MongoDB and work faster with complete confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-9 block"
          >
            <QueryPreview />
          </motion.div>

          <div className="mt-9 grid grid-cols-1 gap-3 ">
            {FEATURES.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={0.3 + i * 0.08}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
