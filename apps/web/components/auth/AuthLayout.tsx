"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-[520px] items-center justify-center bg-background px-6 py-14 lg:h-full lg:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="glass w-full max-w-[430px] rounded-xl2 p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] sm:p-10"
      >
        <div className="mb-8">
          <h2 className="text-[22px] font-semibold text-foreground flex items-center justify-center gap-2">
            Welcome 👋
          </h2>
          <p className="mt-1 text-[15px] text-foreground/90 flex items-center justify-center gap-2">
            Make Your QueryFlow Account
          </p>
          <p className="mt-2 text-[13.5px] text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="focus-ring relative font-medium text-accent-soft after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-accent-soft after:transition-all after:duration-300 hover:after:w-full"
            >
              Sign In
            </Link>
          </p>
        </div>

        {children}

        <p className="mt-7 text-center text-[12px] leading-relaxed text-muted">
          By creating an account you agree to our{" "}
          <Link
            href="/terms"
            className="focus-ring relative text-foreground/80 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-foreground/50 after:transition-all after:duration-300 hover:text-foreground hover:after:w-full"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="focus-ring relative text-foreground/80 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-foreground/50 after:transition-all after:duration-300 hover:text-foreground hover:after:w-full"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </motion.div>
    </div>
  );
}
