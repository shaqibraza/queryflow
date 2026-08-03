"use client";

import { motion } from "framer-motion";
import { IconBrain, IconShieldCheck, IconStack2 } from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import { GlassCard } from "../ui/glass-card";

const features = [
  {
    icon: IconBrain,
    title: "AI Powered",
    description:
      "Describe what you need in plain English — QueryFlow turns it into precise, production-ready SQL."
  },
  {
    icon: IconShieldCheck,
    title: "Safe Execution",
    description:
      "Every UPDATE, DELETE, or DROP is shown to you first. Nothing runs against your data without confirmation."
  },
  {
    icon: IconStack2,
    title: "Multi Database",
    description:
      "One assistant for PostgreSQL, MySQL and MongoDB — no need to context-switch between query languages."
  }
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-5 py-24 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Badge className="mx-auto">Why QueryFlow</Badge>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#FAFAFA] sm:text-4xl">
          Built for how you actually work with data
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[#A1A1AA]">
          No new query language to learn, no risky surprises in production.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map(({ icon: Icon, title, description }) => (
          <motion.div key={title} variants={item} whileHover={{ y: -4 }}>
            <GlassCard className="h-full p-7 transition-colors duration-300 hover:border-white/[0.16]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10">
                <Icon size={20} className="text-indigo-300" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-[#FAFAFA]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#A1A1AA]">{description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
