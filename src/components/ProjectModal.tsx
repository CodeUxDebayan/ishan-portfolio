"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Project } from "./3d/HelixCanvas";

import { useUIStore } from "@/store/useUIStore";

interface ProjectModalProps {
  project: Project;
  allProjects?: Project[];
}

export function ProjectModal({ project, allProjects = [] }: ProjectModalProps) {
  const { setActiveProject } = useUIStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Find next project
  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  const nextProject = allProjects.length > 0 && currentIndex !== -1
    ? allProjects[(currentIndex + 1) % allProjects.length]
    : null;

  // This will handle the physics of pulling up the sheet
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "end start"]
  });

  const yOffset = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  useEffect(() => {
    // Disable body scroll when modal is open, let this container handle scrolling
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: "0%" }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-100 bg-[#000000] overflow-y-auto overflow-x-hidden"
    >
      <motion.div 
        ref={containerRef}
        style={{ y: yOffset }}
        className="relative z-10 bg-[#F2EEE5] text-[#000000] min-h-screen rounded-b-[3rem] pb-32"
      >
        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 pt-12">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8">{project.website_project_name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div className="md:col-span-1 text-lg font-medium opacity-60 uppercase tracking-widest">
              {project.category_display}
            </div>
            <div className="md:col-span-2 text-xl md:text-3xl font-medium leading-relaxed">
              {/* Fallback description if content_narrative is missing */}
              {project.category_display} project showcasing world-class design and performance creative.
            </div>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
            {project.asset_locations.map((src, i) => {
              const spanClasses = [
                "md:col-span-12",
                "md:col-span-6",
                "md:col-span-6",
                "md:col-span-8",
                "md:col-span-4",
                "md:col-span-4",
                "md:col-span-4",
                "md:col-span-4",
                "md:col-span-12"
              ][i % 9];
              return (
                <div key={i} className={`rounded-2xl overflow-hidden bg-black/5 ${spanClasses}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={encodeURI(src)} alt={`${project.website_project_name} - ${i}`} className="w-full h-full object-cover" />
                </div>
              );
            })}
          </div>

          {/* Next Project Section */}
          {nextProject && (
            <div className="pt-20 border-t border-black/10 text-center">
              <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-black/50 block mb-6">
                Next Project
              </span>
              <button
                onClick={() => {
                  setActiveProject(nextProject.id);
                  if (containerRef.current) {
                    containerRef.current.scrollTop = 0;
                  }
                }}
                className="group flex flex-col items-center gap-8 w-full cursor-pointer"
              >
                <h2 className="text-4xl md:text-7xl font-bold tracking-tighter group-hover:italic transition-all duration-300">
                  {nextProject.website_project_name}
                </h2>
                {nextProject.asset_locations[0] && (
                  <div className="w-full max-w-3xl h-64 md:h-105 rounded-3xl overflow-hidden relative shadow-2xl group-hover:scale-[1.01] transition-transform duration-500">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={encodeURI(nextProject.asset_locations[0])}
                      alt={nextProject.website_project_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="bg-[#100F0C] text-[#F2EEE5] px-8 py-4 rounded-full text-base font-sans font-medium shadow-xl transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                        View Next Project →
                      </span>
                    </div>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

