"use client";

import { motion } from "framer-motion";

export function ClientsSection() {
  // We'll use placeholders for now until the user provides the real images
  const placeholders = Array(6).fill(null);

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-5xl font-medium mb-16 tracking-tighter text-center">
        Clients I&apos;ve worked with
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 items-center opacity-50 grayscale">
        {placeholders.map((_, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex items-center justify-center aspect-video bg-white/5 rounded-xl border border-white/10 relative overflow-hidden group"
          >
            {/* SVG Placeholder */}
            <svg 
              className="w-12 h-12 text-white/20 group-hover:text-white/40 transition-colors" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="absolute inset-0 bg-linear-to-tr from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
