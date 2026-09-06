"use client";

import { HelixCanvas, Project } from "./3d/HelixCanvas";
import { useUIStore } from "@/store/useUIStore";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectModal } from "./ProjectModal";

interface SpiralSliderProps {
  projects: Project[];
}

export function SpiralSlider({ projects }: SpiralSliderProps) {
  const { activeProjectId, setActiveProject, hoveredProject } = useUIStore();

  const selectedProject = activeProjectId ? projects.find(p => p.id === activeProjectId) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-0"
    >
      <HelixCanvas projects={projects} onSelect={setActiveProject} />
      
      <AnimatePresence>
        {hoveredProject && !activeProjectId && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-8 md:bottom-12 left-1/2 z-20 flex items-center gap-3 bg-white text-black p-1.5 pr-6 rounded-full shadow-2xl pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hoveredProject.asset_locations[0]} className="w-full h-full object-cover" alt="" />
            </div>
            <span className="font-sans font-medium text-sm md:text-base tracking-tight whitespace-nowrap">
              {hoveredProject.website_project_name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            key="modal"
            project={selectedProject} 
            allProjects={projects}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
