"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PASSWORD_REQUIREMENTS, getPasswordStrength } from "@/lib/password";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label, color } = getPasswordStrength(password);
  const segments = 5;

  return (
    <div className="mt-3">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: segments }).map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full"
              initial={false}
              animate={{
                width: i < score ? "100%" : "0%",
                backgroundColor: color
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        ))}
      </div>

      {password.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-1.5 text-[12px] font-medium"
          style={{ color }}
        >
          {label} password
        </motion.p>
      )}

      <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {PASSWORD_REQUIREMENTS.map((req) => {
          const met = req.test(password);
          return (
            <li key={req.id} className="flex items-center gap-1.5 text-[12px] text-muted">
              <motion.span
                initial={false}
                animate={{
                  scale: met ? 1 : 0.9,
                  backgroundColor: met ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                  borderColor: met ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.12)"
                }}
                transition={{ duration: 0.2 }}
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
              >
                {met && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Check size={10} strokeWidth={3} className="text-success" />
                  </motion.span>
                )}
              </motion.span>
              <span className={met ? "text-foreground/80" : ""}>{req.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
