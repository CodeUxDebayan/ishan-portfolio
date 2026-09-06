"use client";

import { motion } from "framer-motion";

export function ThreeDotsLoader({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 select-none ${className || ""}`}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{
            scale: [0.8, 1.35, 0.8],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.85,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.16,
          }}
          className="w-2 h-2 rounded-full bg-[#fcfcfc] block"
        />
      ))}
    </div>
  );
}

// Backwards compatibility export
export const OrigamiLoop = ThreeDotsLoader;

