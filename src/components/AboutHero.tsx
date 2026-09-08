"use client";

import { useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface IconItem {
  type: "icon";
  id: number;
}

interface TextItem {
  type: "text";
  word: string;
}

type BioItem = TextItem | IconItem;

export function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [0.85, 0.85, 0.4]);
  const subjectY = useTransform(scrollYProgress, [0, 1], ["0%", "3%"]);
  const subjectScale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);

  // Left column: "I'm Ishan, a digital designer blending [Sparkle] brand identity, performance creative,"
  const leftItems: BioItem[] = useMemo(
    () => [
      { type: "text", word: "I'm" },
      { type: "text", word: "Ishan," },
      { type: "text", word: "a" },
      { type: "text", word: "digital" },
      { type: "text", word: "designer" },
      { type: "text", word: "blending" },
      { type: "icon", id: 0 },
      { type: "text", word: "brand" },
      { type: "text", word: "identity," },
      { type: "text", word: "performance" },
      { type: "text", word: "creative," },
    ],
    []
  );

  // Right column: "and [Cube] 3D visual storytelling to build [Lightning] high-converting digital experiences."
  const rightItems: BioItem[] = useMemo(
    () => [
      { type: "text", word: "and" },
      { type: "icon", id: 1 },
      { type: "text", word: "3D" },
      { type: "text", word: "visual" },
      { type: "text", word: "storytelling" },
      { type: "text", word: "to" },
      { type: "text", word: "build" },
      { type: "icon", id: 2 },
      { type: "text", word: "high-converting" },
      { type: "text", word: "digital" },
      { type: "text", word: "experiences." },
    ],
    []
  );

  // Map word-by-word highlight across scroll progress
  const leftItemRanges = useMemo(() => {
    const total = leftItems.length;
    const animLimit = 0.52;
    return leftItems.map((_, i) => {
      const start = (i / total) * animLimit;
      const end = Math.min(animLimit, ((i + 1) / total) * animLimit);
      return [start, end] as [number, number];
    });
  }, [leftItems]);

  const rightItemRanges = useMemo(() => {
    const total = rightItems.length;
    const startOffset = 0.35;
    const animLimit = 0.85;
    const rangeSpan = animLimit - startOffset;
    return rightItems.map((_, i) => {
      const start = startOffset + (i / total) * rangeSpan;
      const end = Math.min(animLimit, startOffset + ((i + 1) / total) * rangeSpan);
      return [start, end] as [number, number];
    });
  }, [rightItems]);

  return (
    <section ref={containerRef} className="relative h-[280vh] bg-black">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden select-none">
        {/* 1. Background Image with warm ambient flare */}
        <motion.div
          style={{ scale: bgScale, opacity: bgOpacity }}
          className="absolute inset-0 pointer-events-none z-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about/hero-bg.png"
            alt=""
            className="w-full h-full object-cover object-center opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,#000000_88%)]" />
        </motion.div>

        {/* 2. Content Layout - Flanking left and right with centered cutout */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-12 flex flex-col md:flex-row items-center justify-between h-full pt-20 pb-6 md:py-0">
          
          {/* Left Text Column */}
          <div className="w-full md:w-[32%] lg:w-[31%] z-20 text-left md:text-right flex flex-col justify-center">
            <h1
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
              }}
              className="text-2xl sm:text-3xl md:text-3xl lg:text-[42px] xl:text-[48px] tracking-[0.03em] leading-[1.25] text-white"
            >
              {leftItems.map((item, itemIdx) => {
                const range = leftItemRanges[itemIdx] || [0, 0.52];

                if (item.type === "text") {
                  return (
                    <span key={itemIdx}>
                      <Word
                        word={item.word}
                        progress={scrollYProgress}
                        range={range}
                      />{" "}
                    </span>
                  );
                }

                return (
                  <span key={itemIdx}>
                    <InteractiveIcon
                      id={item.id}
                      progress={scrollYProgress}
                      range={range}
                    />{" "}
                  </span>
                );
              })}
            </h1>
          </div>

          {/* Center Foreground Subject (Ishan Cutout PNG) */}
          <motion.div
            style={{ y: subjectY, scale: subjectScale }}
            className="relative z-15 flex items-end justify-center min-h-[400px] h-[48vh] sm:h-[58vh] md:h-[88vh] lg:h-[96vh] xl:h-[100vh] w-full md:w-[38%] lg:w-[40%] pointer-events-none mt-auto shrink-0"
          >
            {/* Ambient rim glow behind subject */}
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 md:w-96 md:h-96 bg-orange-500/25 blur-[120px] rounded-full pointer-events-none" />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about/ishan-cutout.png"
              alt="Ishan Mitra"
              className="min-h-[400px] max-h-full w-auto object-contain object-bottom"
              style={{
                maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
              }}
            />
          </motion.div>

          {/* Right Text Column */}
          <div className="w-full md:w-[32%] lg:w-[31%] z-20 text-left flex flex-col justify-center">
            <h1
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
              }}
              className="text-2xl sm:text-3xl md:text-3xl lg:text-[42px] xl:text-[48px] tracking-[0.03em] leading-[1.25] text-white"
            >
              {rightItems.map((item, itemIdx) => {
                const range = rightItemRanges[itemIdx] || [0.35, 0.85];

                if (item.type === "text") {
                  return (
                    <span key={itemIdx}>
                      <Word
                        word={item.word}
                        progress={scrollYProgress}
                        range={range}
                      />{" "}
                    </span>
                  );
                }

                return (
                  <span key={itemIdx}>
                    <InteractiveIcon
                      id={item.id}
                      progress={scrollYProgress}
                      range={range}
                    />{" "}
                  </span>
                );
              })}
            </h1>
          </div>

        </div>
      </div>
    </section>
  );
}

interface WordProps {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}

function Word({ word, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0.35, 1]);
  const color = useTransform(progress, range, ["#777777", "#FFFFFF"]);

  return (
    <motion.span
      style={{ opacity, color }}
      className="inline-block transition-colors"
    >
      {word}
    </motion.span>
  );
}

interface InteractiveIconProps {
  id: number;
  progress: MotionValue<number>;
  range: [number, number];
}

function InteractiveIcon({ id, progress, range }: InteractiveIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const opacity = useTransform(progress, range, [0.25, 1]);
  const scale = useTransform(progress, range, [0.85, 1]);
  const iconColor = useTransform(progress, range, ["#777777", "#FFFFFF"]);

  return (
    <motion.span
      style={{ opacity, scale }}
      className="inline-flex items-center align-middle mx-1 my-0.5"
    >
      <motion.button
        type="button"
        aria-label={`Interactive icon ${id}`}
        className="relative inline-flex items-center justify-center h-6 md:h-7 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-2 transition-colors cursor-pointer overflow-hidden backdrop-blur-md"
        animate={{ width: isHovered ? 56 : 32 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {id === 0 && (
          <motion.div
            style={{ color: iconColor }}
            animate={{ rotate: isHovered ? 180 : 0, scale: isHovered ? 1.15 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center justify-center shrink-0"
          >
            {/* Sparkle */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </motion.div>
        )}
        {id === 1 && (
          <motion.div
            style={{ color: iconColor }}
            animate={{ rotate: isHovered ? 90 : 0, scale: isHovered ? 1.2 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center justify-center shrink-0"
          >
            {/* 3D Cube */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </motion.div>
        )}
        {id === 2 && (
          <motion.div
            style={{ color: iconColor }}
            animate={{ scale: isHovered ? 1.25 : 1, x: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center justify-center shrink-0"
          >
            {/* Lightning */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
            </svg>
          </motion.div>
        )}
      </motion.button>
    </motion.span>
  );
}
