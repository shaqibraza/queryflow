"use client";

import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { GlassCard } from "../ui/glass-card";
import { SiPostgresql, SiMysql, SiMongodb } from "react-icons/si";

const databases = [
  {
    name: "PostgreSQL",
    blurb: "Full support for complex joins, CTEs and window functions.",
    accent: "#336791",
    icon: SiPostgresql
  },
  {
    name: "MySQL",
    blurb: "Optimized queries for the world's most popular open-source database.",
    accent: "#00758F",
    icon: SiMysql
  },
  {
    name: "MongoDB",
    blurb: "Natural language directly into MongoDB queries and aggregation pipelines.",
    accent: "#47A248",
    icon: SiMongodb
  }
];

export function SupportedDatabases() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Badge className="mx-auto">Supported Databases</Badge>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#FAFAFA] sm:text-4xl">
          Works with the databases you already run
        </h2>
      </div>

      <div className="mt-16 grid gap-5 sm:grid-cols-3">
        {databases.map(({ name, blurb, accent, icon: Icon }, index) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 5 + index,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <GlassCard className="group relative overflow-hidden p-7 transition-colors duration-300 hover:border-white/[0.16]">
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-20"
                  style={{ backgroundColor: accent }}
                />
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-semibold"
                  style={{
                    backgroundColor: `${accent}1A`,
                    color: accent
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color: accent }} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-[#FAFAFA]">{name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#A1A1AA]">{blurb}</p>
              </GlassCard>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
