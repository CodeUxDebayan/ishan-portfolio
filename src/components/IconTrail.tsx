"use client";

import { useRef } from "react";

export function IconTrail({ children }: { children?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // A simple trail effect for now that spawns SVGs on mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      // Calculate position relative to container
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const el = document.createElement("div");
      el.className = "absolute pointer-events-none w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
      el.innerHTML = "✦";
      
      containerRef.current.appendChild(el);
      
      // Animate out
      setTimeout(() => {
        el.style.transition = "all 0.5s ease-out";
        el.style.opacity = "0";
        el.style.transform = `translate(-50%, ${-50 - (Math.random() * 50)}%) scale(0.5)`;
      }, 10);
      
      setTimeout(() => {
        if (el.parentNode) el.remove();
      }, 500);
    };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-hidden flex flex-col items-center justify-center py-32"
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
}
