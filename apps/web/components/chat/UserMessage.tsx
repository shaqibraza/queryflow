"use client";

import { motion } from "framer-motion";

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex justify-end"
    >
      <div className="max-w-[75%] rounded-2xl rounded-tr-md bg-gradient-to-r from-accent to-accent-deep px-4 py-2.5 text-[13.5px] leading-relaxed text-white">
        {content}
      </div>
    </motion.div>
  );
}
