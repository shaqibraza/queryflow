"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IconArrowRight } from "@tabler/icons-react";
import { GlassCard } from "../ui/glass-card";

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <GlassCard className="relative overflow-hidden px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#6366F1_0%,transparent_60%)] opacity-[0.08]" />

          <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1 text-xs text-indigo-300">
            AI Powered Database Workspace
          </span>

          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Build Faster.
            <br />
            Let AI Handle Your Queries.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Generate, review and execute production-ready SQL and MongoDB queries with confidence.
          </p>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="relative mt-8 inline-block"
          >
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Get Started
              <IconArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
