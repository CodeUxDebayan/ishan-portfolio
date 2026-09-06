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

  const bioItems: BioItem[] = useMemo(
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
      { type: "text", word: "Generating" },
      { type: "icon", id: 3 },
      { type: "text", word: "15M+" },
      { type: "text", word: "Views" },
      { type: "text", word: "through" },
      { type: "text", word: "IG" },
      { type: "text", word: "carousels" },
      { type: "text", word: "only." },
    ],
    []
  );

  // Map word-by-word highlight and icon fade-in across scroll progress
  // Section remains pinned until all words are highlighted in pure white
  const itemRanges = useMemo(() => {
    const total = bioItems.length;
    const animLimit = 0.82; // All words and icons finish turning white by 82% of scroll

    return bioItems.map((_, i) => {
      const start = (i / total) * animLimit;
      const end = Math.min(animLimit, ((i + 1) / total) * animLimit);
      return [start, end] as [number, number];
    });
  }, [bioItems]);

  return (
    <section ref={containerRef} className="relative h-[280vh] bg-black">
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center px-6 sm:px-12 md:px-20 max-w-4xl mx-auto overflow-hidden">
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            textAlign: "justify",
            textJustify: "inter-word",
          }}
          className="text-[25px] tracking-[0.05em] leading-[1.65] text-white text-justify w-full select-none"
        >
          {bioItems.map((item, itemIdx) => {
            const range = itemRanges[itemIdx] || [0, 0.82];

            if (item.type === "text") {
              return (
                <span key={itemIdx}>
                  <Word
                    word={item.word}
                    progress={scrollYProgress}
                    range={range}
                  />
                  {" "}
                </span>
              );
            }

            return (
              <span key={itemIdx}>
                <InteractiveIcon
                  id={item.id}
                  progress={scrollYProgress}
                  range={range}
                />
                {" "}
              </span>
            );
          })}
        </h1>
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
  // Normally light gray (#777777), smoothly highlighting to pure white (#FFFFFF) on scroll
  const opacity = useTransform(progress, range, [0.38, 1]);
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
  // Fade in alongside surrounding words from dim light gray to pure white
  const opacity = useTransform(progress, range, [0.2, 1]);
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
        {id === 3 && (
          <motion.div
            style={{ color: iconColor }}
            animate={{ scale: isHovered ? 1.25 : 1, rotate: isHovered ? [0, -10, 10, 0] : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center justify-center shrink-0"
          >
            {/* Fire / Trending Carousel Icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 23c4.97 0 9-4.03 9-9 0-4.07-3.04-8.08-5.32-10.32a1.003 1.003 0 0 0-1.6.36C13.2 6.55 12 8.44 12 10.5c0 .28-.22.5-.5.5-.28 0-.5-.22-.5-.5 0-2.31-1.35-4.42-2.47-5.91-.42-.56-1.3-.43-1.54.23C5.7 8.35 3 12.01 3 14c0 4.97 4.03 9 9 9z" />
            </svg>
          </motion.div>
        )}
      </motion.button>
    </motion.span>
  );
}
