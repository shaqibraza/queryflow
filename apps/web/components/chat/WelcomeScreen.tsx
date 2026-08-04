"use client";

import { motion } from "framer-motion";
import { suggestions, type Suggestion } from "@/lib/mock-data";
import { SuggestionCard } from "./SuggestionCard";

interface WelcomeScreenProps {
  onSelectSuggestion: (suggestion: Suggestion) => void;
}

export function WelcomeScreen({ onSelectSuggestion }: WelcomeScreenProps) {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-[28px] font-semibold tracking-tight text-foreground sm:text-[32px]"
      >
        Welcome back 👋
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
        className="mt-2.5 text-[14.5px] text-muted"
      >
        Ask anything about your databases using natural language.
      </motion.p>

      <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {suggestions.map((suggestion, index) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onSelect={onSelectSuggestion}
            delay={0.1 + index * 0.05}
          />
        ))}
      </div>
    </div>
  );
}
