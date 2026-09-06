"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "./3d/HelixCanvas";

interface ProjectListViewProps {
  projects: Project[];
}

export function ProjectListView({ projects }: ProjectListViewProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imageIndex, setImageIndex] = useState(0);

  // Group projects by category
  const categories = Array.from(new Set(projects.map(p => p.category_display)));
  
  const categoryImages = hoveredCategory 
    ? projects.filter(p => p.category_display === hoveredCategory).flatMap(p => p.asset_locations)
    : [];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!hoveredCategory || categoryImages.length <= 1) return;
    const interval = setInterval(() => {
      setImageIndex(prev => (prev + 1) % categoryImages.length);
    }, 800); // 800ms per image
    return () => clearInterval(interval);
  }, [hoveredCategory, categoryImages.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-10 flex flex-col items-center justify-center p-4 pointer-events-none"
    >
      <div className="relative z-20 flex flex-col items-center justify-center gap-3 md:gap-5 w-full max-w-4xl px-4 pointer-events-auto">
        {categories.map((category) => (
          <div
            key={category}
            onMouseEnter={() => {
              setHoveredCategory(category);
              setImageIndex(0);
            }}
            onMouseLeave={() => setHoveredCategory(null)}
            className="w-full text-center py-2 cursor-pointer group"
          >
            <h2 
              className={`text-[40px] leading-none font-sans font-medium tracking-tighter uppercase transition-all duration-300 ${
                hoveredCategory === null 
                  ? "text-white/80" 
                  : hoveredCategory === category 
                    ? "text-white" 
                    : "text-white/20"
              }`}
            >
              {category}
            </h2>
          </div>
        ))}
      </div>

      {/* Floating Image Preview */}
      <AnimatePresence>
        {hoveredCategory && categoryImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="fixed pointer-events-none z-10 rounded-xl overflow-hidden shadow-2xl bg-black/50 backdrop-blur-sm opacity-35 transition-opacity duration-300"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              x: "-50%",
              y: "-50%",
              width: 320,
              height: 450,
            }}
          >
            {categoryImages.map((imgUrl, i) => (
              <div 
                key={i} 
                className={`absolute inset-0 transition-opacity duration-300 ${i === imageIndex ? "opacity-100" : "opacity-0"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imgUrl} 
                  alt={hoveredCategory}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

