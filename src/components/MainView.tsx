"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";
import { Project } from "./3d/HelixCanvas";
import { SpiralSlider } from "./SpiralSlider";
import { ProjectListView } from "./ProjectListView";
import { OrigamiLoop } from "@/components/ui/origami-loop";
import { AnimatePresence, motion } from "framer-motion";

export function MainView({ projects }: { projects: Project[] }) {
  const { viewMode, activeProjectId, setActiveProject } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Instant reveal on mount without artificial delay
    const frame = requestAnimationFrame(() => {
      setIsLoading(false);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Deep linking: read initial ?project=... on load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const projId = searchParams.get("project");
    if (projId && projects.some((p) => p.id === projId)) {
      setActiveProject(projId);
    }
  }, [projects, setActiveProject]);

  // Sync activeProjectId with browser URL and history
  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const currentParam = searchParams.get("project");

    if (activeProjectId) {
      if (currentParam !== activeProjectId) {
        searchParams.set("project", activeProjectId);
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({ project: activeProjectId }, "", newUrl);
      }
    } else if (currentParam) {
      searchParams.delete("project");
      const newUrl = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      window.history.pushState({}, "", newUrl);
    }
  }, [activeProjectId]);

  // Listen to popstate (back button / forward button / mobile swipe-back)
  useEffect(() => {
    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const projId = searchParams.get("project");
      if (projId && projects.some((p) => p.id === projId)) {
        setActiveProject(projId);
      } else {
        setActiveProject(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [projects, setActiveProject]);

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

