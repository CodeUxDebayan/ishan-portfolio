"use client";

import { motion, type Variants } from "framer-motion";

export interface ClientItem {
  name: string;
  category?: string;
  logo: string;
  theme?: "invert" | "contained" | "normal" | "accent";
}

const CLIENTS: ClientItem[] = [
  {
    name: "Daily Mail",
    category: "Media & Editorial",
    logo: "/clients/dailymail.png",
    theme: "normal",
  },
  {
    name: "EUVC",
    category: "Venture Capital",
    logo: "/clients/euvc.png",
    theme: "normal",
  },
  {
    name: "Kelme India",
    category: "Sports & Apparel",
    logo: "/clients/kelme.png",
    theme: "contained",
  },
  {
    name: "MetroMedia",
    category: "Agency & Tech",
    logo: "/clients/metromedia.png",
    theme: "contained",
  },
  {
    name: "Berribot",
    category: "AI Recruiting Platform",
    logo: "/clients/berribot.png",
    theme: "normal",
  },
  {
    name: "Firi",
    category: "Skincare & Haircare",
    logo: "/clients/firi.png",
    theme: "accent",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function ClientsSection() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="text-xs uppercase tracking-[0.3em] text-white/50 mb-3 font-mono"
        >
          Selected Collaborations
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-5xl font-medium tracking-tighter leading-[1.15]"
        >
          Trusted by ambitious founders, media leaders &amp; breakthrough brands
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm md:text-base text-white/60 mt-4 max-w-xl mx-auto leading-relaxed"
        >
          From global editorial publications to venture capital funds and high-growth consumer brands.
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 items-stretch"
      >
        {CLIENTS.map((client) => (
          <motion.div
            key={client.name}
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 380, damping: 25 }}
            className="group relative flex flex-col items-center justify-center p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-white/30 transition-colors duration-300 min-h-[160px] overflow-hidden cursor-default shadow-lg hover:shadow-white/[0.04]"
          >
            {/* Ambient hover light sweep */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Logo Container */}
            <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
              {client.theme === "contained" ? (
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white p-2 flex items-center justify-center shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : client.theme === "accent" ? (
                <div className="flex items-center justify-center px-2.5 py-1 rounded-lg bg-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-7 w-auto object-contain brightness-110"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shadow-md flex items-center justify-center bg-white/5 p-1 border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              )}
            </div>

            {/* Client Name */}
            <span className="font-medium text-xs md:text-sm text-white/90 group-hover:text-white transition-colors text-center tracking-tight">
              {client.name}
            </span>

            {/* Category Subtitle */}
            {client.category && (
              <span className="text-[10px] text-white/40 group-hover:text-white/60 transition-colors tracking-wider text-center mt-0.5">
                {client.category}
              </span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
