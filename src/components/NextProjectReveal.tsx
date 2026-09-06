"use client";

import { motion, MotionValue } from "framer-motion";
import { Project } from "./3d/HelixCanvas";

interface NextProjectRevealProps {
  project: Project;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  onNext: () => void;
}

export function NextProjectReveal({ project, scale, opacity, onNext }: NextProjectRevealProps) {
  return (
    <div className="fixed inset-0 z-0 flex items-end justify-center pb-12 pointer-events-none">
      <motion.div 
        style={{ scale, opacity }}
        className="w-full max-w-5xl bg-[#1a1a1a] rounded-4xl p-8 md:p-12 text-[#F2EEE5] flex flex-col items-center cursor-pointer pointer-events-auto"
        onClick={onNext}
      >
        <div className="flex gap-2 mb-8">
          <span className="border border-white/20 rounded-full px-4 py-1 text-sm bg-white/5">next up...</span>
          <span className="border border-white/20 rounded-full px-4 py-1 text-sm bg-white/5">keep scrolling !</span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 text-center">
          {project.website_project_name}
        </h2>
        
        <div className="w-full h-75 rounded-xl overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={project.asset_locations[0]} 
            alt={project.website_project_name}
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        
        <div className="mt-8 text-white/50 hover:text-white transition-colors uppercase tracking-widest text-sm font-medium">
          ( click to view )
        </div>
      </motion.div>
    </div>
  );
}
