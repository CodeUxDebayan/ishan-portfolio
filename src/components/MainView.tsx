"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";
import { Project } from "./3d/HelixCanvas";
import { SpiralSlider } from "./SpiralSlider";
import { ProjectListView } from "./ProjectListView";
import { OrigamiLoop } from "@/components/ui/origami-loop";
import { AnimatePresence, motion } from "framer-motion";

export function MainView({ projects }: { projects: Project[] }) {
  const { viewMode } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Instant reveal on mount without artificial delay
    const frame = requestAnimationFrame(() => {
      setIsLoading(false);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="page-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-[#000000] flex flex-col items-center justify-center pointer-events-auto"
          >
            <OrigamiLoop />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {viewMode === "spiral" ? (
          <SpiralSlider key="spiral" projects={projects} />
        ) : (
          <ProjectListView key="list" projects={projects} />
        )}
      </AnimatePresence>
    </>
  );
}

