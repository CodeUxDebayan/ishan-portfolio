"use client";

import { motion } from "framer-motion";

const TOTAL_TICKS = 40;
const CX = 80;
const CY = 80;
const R_INNER_START = 45;
const R_INNER_END = 57;
const R_OUTER_START = 57;
const R_OUTER_END = 68;

const round = (val: number) => Math.round(val * 100) / 100;

// Precompute static geometry outside component render to guarantee identical SSR & client output
const TICKS = Array.from({ length: TOTAL_TICKS }, (_, i) => {
  const angle = (i * 360) / TOTAL_TICKS;
  const rad = (angle * Math.PI) / 180;

  const t = i / TOTAL_TICKS;
  const wave = Math.pow(Math.sin(t * Math.PI), 1.8);
  const opacity = round(0.2 + 0.8 * wave);

  const sin = Math.sin(rad);
  const cos = Math.cos(rad);

  return {
    id: i,
    opacity,
    x1: round(CX + R_INNER_START * sin),
    y1: round(CY - R_INNER_START * cos),
    x2: round(CX + R_INNER_END * sin),
    y2: round(CY - R_INNER_END * cos),
    x3: round(CX + R_OUTER_START * sin),
    y3: round(CY - R_OUTER_START * cos),
    x4: round(CX + R_OUTER_END * sin),
    y4: round(CY - R_OUTER_END * cos),
  };
});

export function OrigamiLoop({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className || ""}`}>
      <motion.div
        className="relative w-36 h-36 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 160 160" className="w-full h-full">
          {TICKS.map((tick) => (
            <g key={tick.id} style={{ opacity: tick.opacity }}>
              {/* Inner dark stem line */}
              <line
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                stroke="#383838"
                strokeWidth="2.4"
                strokeLinecap="butt"
              />
              {/* Outer bright tip line */}
              <line
                x1={tick.x3}
                y1={tick.y3}
                x2={tick.x4}
                y2={tick.y4}
                stroke="#FFFFFF"
                strokeWidth="2.4"
                strokeLinecap="butt"
              />
            </g>
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
