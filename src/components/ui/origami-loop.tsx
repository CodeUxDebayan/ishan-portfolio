"use client";

import { motion } from "framer-motion";

export function OrigamiLoop({ className }: { className?: string }) {
  const totalTicks = 40;
  const ticks = Array.from({ length: totalTicks });

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
          {ticks.map((_, i) => {
            const angle = (i * 360) / totalTicks;
            const rad = (angle * Math.PI) / 180;
            
            // Calculate opacity pattern around the loop matching the reference screenshot
            const t = i / totalTicks;
            const wave = Math.pow(Math.sin(t * Math.PI), 1.8);
            const opacity = 0.2 + 0.8 * wave;

            const cx = 80;
            const cy = 80;

            // Inner dark segment
            const rInnerStart = 45;
            const rInnerEnd = 57;
            const x1 = cx + rInnerStart * Math.sin(rad);
            const y1 = cy - rInnerStart * Math.cos(rad);
            const x2 = cx + rInnerEnd * Math.sin(rad);
            const y2 = cy - rInnerEnd * Math.cos(rad);

            // Outer white segment
            const rOuterStart = 57;
            const rOuterEnd = 68;
            const x3 = cx + rOuterStart * Math.sin(rad);
            const y3 = cy - rOuterStart * Math.cos(rad);
            const x4 = cx + rOuterEnd * Math.sin(rad);
            const y4 = cy - rOuterEnd * Math.cos(rad);

            return (
              <g key={i} style={{ opacity }}>
                {/* Inner dark stem line */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#383838"
                  strokeWidth="2.4"
                  strokeLinecap="butt"
                />
                {/* Outer bright tip line */}
                <line
                  x1={x3}
                  y1={y3}
                  x2={x4}
                  y2={y4}
                  stroke="#FFFFFF"
                  strokeWidth="2.4"
                  strokeLinecap="butt"
                />
              </g>
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
}
