"use client";

import { motion } from "framer-motion";

export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#09090B]">
      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #FAFAFA 1px, transparent 1px), linear-gradient(to bottom, #FAFAFA 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }}
      />

      {/* slow-drifting soft blobs */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-40 left-1/4 h-[520px] w-[520px] rounded-full bg-[#6366F1]/[0.10] blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0]
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/3 right-0 h-[460px] w-[460px] rounded-full bg-[#6366F1]/[0.08] blur-[130px]"
      />
      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-indigo-500/[0.06] blur-[120px]"
      />

      {/* vignette so edges stay dark and content stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#09090B_85%)]" />
    </div>
  );
}
