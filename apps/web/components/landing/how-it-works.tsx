"use client";

import { motion } from "framer-motion";
import { IconCode, IconEye, IconMessage, IconPlayerPlay } from "@tabler/icons-react";
import { Badge } from "../ui/badge";

const steps = [
  {
    icon: IconMessage,
    title: "Ask",
    description: "Type your question in plain English — no SQL required."
  },
  {
    icon: IconCode,
    title: "Generate",
    description: "QueryFlow writes the exact query for your database engine."
  },
  {
    icon: IconEye,
    title: "Review",
    description: "See exactly what will run before anything touches your data."
  },
  {
    icon: IconPlayerPlay,
    title: "Execute",
    description: "Run it safely and get clean, readable results back instantly."
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-24 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Badge className="mx-auto">How it Works</Badge>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#FAFAFA] sm:text-4xl">
          From question to result, in four steps
        </h2>
      </div>

      <div className="relative mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* connecting line — desktop only */}
        <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent lg:block" />

        {steps.map(({ icon: Icon, title, description }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
            className="relative flex flex-col items-start"
          >
            <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-[#111113]">
              <Icon size={20} className="text-indigo-300" />
            </span>
            <span className="mt-5 text-xs font-medium text-zinc-500">Step {index + 1}</span>
            <h3 className="mt-1 text-lg font-semibold text-[#FAFAFA]">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#A1A1AA]">{description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
