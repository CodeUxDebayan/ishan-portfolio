"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useVelocity, useAnimationFrame, useMotionValue } from "framer-motion";

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

export function WorkSlider({ projects }: { projects: { asset_locations: string[], website_project_name: string }[] }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [-1000, 1000], [-2, 2], {
    clamp: false
  });

  const directionFactor = useRef<number>(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * -3 * (delta / 1000); // base speed (slow & elegant)

    // Adjust speed by scroll velocity
    moveBy += moveBy * Math.abs(velocityFactor.get());
    
    // Change direction if scrolling up rapidly
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    baseX.set(baseX.get() + moveBy);
  });

  // Since we duplicate the items once, we wrap between 0% and -50% to create a seamless loop
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  
  // Duplicate projects to allow seamless scrolling
  const items = [...projects, ...projects];

  return (
    <div className="py-20 overflow-hidden flex">
      <motion.div style={{ x }} className="flex gap-8 px-6 w-max">
        {items.map((project, i) => (
          <div key={i} className="relative group w-75 h-100 rounded-2xl overflow-hidden cursor-pointer shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={project.asset_locations[0]} 
              alt={project.website_project_name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-white text-black px-6 py-3 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                View project
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
