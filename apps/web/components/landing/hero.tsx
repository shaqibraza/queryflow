"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IconArrowRight, IconBrandGithub, IconCheck, IconSparkles } from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import { ChatMockup } from "./chat-mockup";

const indicators = ["PostgreSQL", "MySQL", "MongoDB", "AI Powered"];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export function Hero() {
  return (
    <section className="relative mx-auto flex max-w-7xl flex-col items-center gap-16 px-5 pb-24 pt-40 lg:flex-row lg:gap-12 lg:pb-32 lg:pt-40">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex max-w-xl flex-col items-start text-left"
      >
        <motion.div variants={item}>
          <Badge>
            <IconSparkles size={13} className="text-yellow-500" />
            AI Powered Database Assistant
          </Badge>
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-6 text-[2.75rem] font-semibold leading-[1.08] tracking-tight text-[#FAFAFA] sm:text-6xl"
        >
          Talk to Your Database.
          <br />
          <span className="text-zinc-500">As Naturally as You Think.</span>
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-lg text-lg leading-relaxed text-[#A1A1AA]">
          Describe what you need, and QueryFlow generates accurate, production-ready queries while
          keeping you in complete control before execution.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Get Started
              <IconArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <a
              href="https://github.com/shaqibraza/QueryFlow"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              <IconBrandGithub size={16} />
              View GitHub
            </a>
          </motion.div>
        </motion.div>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2">
          {indicators.map((label) => (
            <span key={label} className="flex items-center gap-1.5 text-sm text-zinc-500">
              <IconCheck size={14} className="text-indigo-400" />
              {label}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="flex w-full justify-center lg:justify-end"
      >
        <ChatMockup />
      </motion.div>
    </section>
  );
}
