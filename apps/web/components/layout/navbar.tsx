"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { IconDatabase, IconMenu2, IconX } from "@tabler/icons-react";
import BorderBeam from "../ui/border-beam";

const navigation = [
  {
    name: "Features",
    href: "#features"
  },
  {
    name: "How it Works",
    href: "#how-it-works"
  },
  {
    name: "Docs",
    href: "/docs"
  },
  {
    name: "GitHub",
    href: "https://github.com/shaqibraza/QueryFlow"
  }
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-5 max-w-7xl px-5">
        <nav className="relative flex h-16 items-center justify-between rounded-full border border-white/10 bg-zinc-950/70 px-6 backdrop-blur-xl">
          <BorderBeam beamLength={240} />

          {/* Logo */}

          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <motion.div
              whileHover={{
                rotate: -8,
                scale: 1.08
              }}
              transition={{
                duration: 0.2
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600"
            >
              <IconDatabase size={20} className="text-white" />
            </motion.div>

            <span className="text-lg font-semibold tracking-tight text-white">QueryFlow</span>
          </Link>

          {/* Navigation — desktop only */}

          <div className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions — desktop only */}

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              Sign In
            </Link>

            <motion.div
              whileHover={{
                scale: 1.04
              }}
              whileTap={{
                scale: 0.97
              }}
            >
              <Link
                href="/register"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Get Started →
              </Link>
            </motion.div>
          </div>

          {/* Hamburger — tablet & mobile only */}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/5 hover:text-white md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex"
                >
                  <IconX size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex"
                >
                  <IconMenu2 size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>

        {/* Mobile / tablet dropdown panel */}

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="mt-3 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/90 p-4 backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-4 py-2.5 text-center text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-white px-5 py-2.5 text-center text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                  Get Started →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
