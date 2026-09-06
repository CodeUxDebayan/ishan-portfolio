"use client";

import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { parse, type Font } from "opentype.js";
import { cn } from "@/lib/utils";

interface SignatureProps {
  /** Text to generate signature for */
  text?: string;
  /** Color of the signature path */
  color?: string;
  /** Font size of the signature */
  fontSize?: number;
  /** Animation duration in seconds per character */
  duration?: number;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
  /** Only animate when in view */
  inView?: boolean;
  /** Only animate once when scrolled in view */
  once?: boolean;
  /** Custom font URL to load */
  fontUrl?: string;
  /** Replay animation when hovered */
  replayOnHover?: boolean;
}

export function Signature({
  text = "isshaaannn@gmail.com",
  color = "#F2EEE5",
  fontSize = 35,
  duration = 0.7,
  delay = 0,
  className,
  inView = true,
  once = false,
  fontUrl = "/fonts/helvetica-255/Helvetica-Bold.ttf",
  replayOnHover = true,
}: SignatureProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [width, setWidth] = useState<number>(300);
  const [animKey, setAnimKey] = useState<number>(0);
  const height = fontSize * 1.6;
  const horizontalPadding = fontSize * 0.1;
  const topMargin = fontSize * 1.15;
  const baseline = topMargin;
  const maskId = `signature-reveal-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        let font: Font | null = null;
        const fontPaths = fontUrl
          ? [fontUrl, "/fonts/helvetica-255/Helvetica.ttf"]
          : [
              "/fonts/helvetica-255/Helvetica-Bold.ttf",
              "/fonts/helvetica-255/Helvetica.ttf",
            ];

        for (const path of fontPaths) {
          try {
            const res = await fetch(path);
            if (res.ok) {
              const buffer = await res.arrayBuffer();
              font = parse(buffer) as Font;
              if (font) break;
            }
          } catch {
            // Try next
          }
        }

        if (!font || isCancelled) return;

        let x = horizontalPadding;
        const newPaths: string[] = [];

        for (const char of text) {
          const glyph = font.charToGlyph(char);
          const path = glyph.getPath(x, baseline, fontSize);
          newPaths.push(path.toPathData(3));

          const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm;
          x += advanceWidth * (fontSize / font.unitsPerEm);
        }

        if (!isCancelled) {
          setPaths(newPaths);
          setWidth(x + horizontalPadding);
        }
      } catch (error) {
        console.error("Signature component font load error:", error);
      }
    }

    load();
    return () => {
      isCancelled = true;
    };
  }, [text, fontSize, baseline, horizontalPadding, fontUrl]);

  const handleMouseEnter = () => {
    if (replayOnHover) {
      setAnimKey((prev) => prev + 1);
    }
  };

  const variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  if (paths.length === 0) {
    return (
      <span
        style={{ fontSize: `${fontSize}px` }}
        className={cn("font-bold tracking-tight text-[#F2EEE5] inline-block", className)}
      >
        {text}
      </span>
    );
  }

  const stagger = Math.min(0.04, 0.8 / paths.length);

  return (
    <motion.svg
      key={`${paths.length}-${animKey}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      onMouseEnter={handleMouseEnter}
      className={cn("text-foreground overflow-visible cursor-pointer select-none", className)}
      initial="hidden"
      whileInView={inView ? "visible" : undefined}
      animate={inView ? undefined : "visible"}
      viewport={{ once }}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {paths.map((d, i) => (
            <motion.path
              key={`mask-${i}`}
              d={d}
              stroke="white"
              strokeWidth={fontSize * 0.28}
              fill="none"
              variants={variants}
              transition={{
                pathLength: {
                  delay: delay + i * stagger,
                  duration,
                  ease: "easeInOut",
                },
                opacity: {
                  delay: delay + i * stagger + 0.01,
                  duration: 0.01,
                },
              }}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </mask>
      </defs>

      {/* Stroke drawing lines */}
      {paths.map((d, i) => (
        <motion.path
          key={`stroke-${i}`}
          d={d}
          stroke={color}
          strokeWidth={1.5}
          fill="none"
          variants={variants}
          transition={{
            pathLength: {
              delay: delay + i * stagger,
              duration,
              ease: "easeInOut",
            },
            opacity: {
              delay: delay + i * stagger + 0.01,
              duration: 0.01,
            },
          }}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* Solid fill reveal under mask */}
      <g mask={`url(#${maskId})`}>
        {paths.map((d, i) => (
          <path key={`fill-${i}`} d={d} fill={color} />
        ))}
      </g>
    </motion.svg>
  );
}
