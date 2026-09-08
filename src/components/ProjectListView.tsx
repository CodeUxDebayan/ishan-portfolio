"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "./3d/HelixCanvas";
import { useUIStore } from "@/store/useUIStore";

interface ProjectListViewProps {
  projects: Project[];
}

export function ProjectListView({ projects }: ProjectListViewProps) {
  const { setActiveProject } = useUIStore();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imageIndex, setImageIndex] = useState(0);

  // Group projects by category
  const categories = Array.from(new Set(projects.map((p) => p.category_display)));

  const categoryProjects = hoveredCategory
    ? projects.filter((p) => p.category_display === hoveredCategory)
    : [];
  const categoryImages = categoryProjects.flatMap((p) => p.asset_locations);

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
      setImageIndex((prev) => (prev + 1) % Math.min(categoryImages.length, 8));
    }, 700);
    return () => clearInterval(interval);
  }, [hoveredCategory, categoryImages.length]);

  const handleCategoryClick = (category: string) => {
    const firstProject = projects.find((p) => p.category_display === category);
    if (firstProject) {
      setActiveProject(firstProject.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-10 flex flex-col items-center justify-center p-4 pointer-events-none"
    >
      <div className="relative z-20 flex flex-col items-center justify-center gap-2 md:gap-4 w-full max-w-4xl px-4 pointer-events-auto">
        {categories.map((category) => {
          const count = projects.filter((p) => p.category_display === category).length;
          const isHovered = hoveredCategory === category;

          return (
            <button
              type="button"
              key={category}
              onClick={() => handleCategoryClick(category)}
              onMouseEnter={() => {
                setHoveredCategory(category);
                setImageIndex(0);
              }}
              onMouseLeave={() => setHoveredCategory(null)}
              className="w-full text-center py-2 sm:py-3 cursor-pointer group flex items-center justify-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
            >
              <h2
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-none font-sans font-medium tracking-tighter uppercase transition-all duration-300 ${
                  hoveredCategory === null
                    ? "text-white/80"
                    : isHovered
                      ? "text-white"
                      : "text-white/20"
                }`}
              >
                {category}
              </h2>
              <span
                className={`text-xs md:text-sm font-mono transition-opacity duration-300 ${
                  isHovered ? "text-white/70 opacity-100" : "text-white/30 opacity-0 group-hover:opacity-100"
                }`}
              >
                [{count}]
              </span>
            </button>
          );
        })}
      </div>

      {/* Floating Image Preview (Desktop) */}
      <AnimatePresence>
        {hoveredCategory && categoryImages.length > 0 && categoryImages[imageIndex] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
            className="fixed pointer-events-none z-10 rounded-2xl overflow-hidden shadow-2xl bg-black/60 backdrop-blur-md border border-white/10 hidden md:block"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              x: "-50%",
              y: "-50%",
              width: 300,
              height: 400,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={categoryImages[imageIndex]}
              src={categoryImages[imageIndex]}
              alt={hoveredCategory}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

