"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/useUIStore";
import { motion } from "framer-motion";

export function Header() {
  const { viewMode, setViewMode, toggleMenu, isMenuOpen, activeProjectId, setActiveProject } = useUIStore();
  const pathname = usePathname();

  const isCloseMode = isMenuOpen || activeProjectId;
  
  const handleClose = () => {
    if (isMenuOpen) toggleMenu();
    if (activeProjectId) setActiveProject(null);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 flex items-center justify-between p-6 pointer-events-none">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold tracking-tighter pointer-events-auto mix-blend-difference text-white">
        ishan.
      </Link>

      {/* Center Toggle (Switcher) - Hidden on about page, menu open, or when project modal is open */}
      {pathname !== '/about' && !isCloseMode && (
        <div className="absolute left-1/2 top-6 -translate-x-1/2 flex items-center pointer-events-auto mix-blend-difference text-white">
          <button
            onClick={() => setViewMode(viewMode === "spiral" ? "list" : "spiral")}
            className="text-white hover:text-white/80 transition-colors text-sm font-medium tracking-widest lowercase"
          >
            {viewMode === "spiral" ? <span className="font-bold">helix</span> : "helix"} ㆍ {viewMode === "list" ? <span className="font-bold">list</span> : "list"}
          </button>
        </div>
      )}

      {/* Right Menu Button */}
      {!isCloseMode ? (
        <button
          id="header-menu-button"
          type="button"
          aria-label="Menu button"
          onClick={toggleMenu}
          className="flex items-center justify-center bg-[#fcfcfc] text-[#100f0c] font-medium rounded-full px-5 py-2 text-sm hover:bg-white shadow-sm hover:shadow transition-all pointer-events-auto cursor-pointer border border-[#100f0c]/10"
        >
          .menu
        </button>
      ) : activeProjectId ? (
        <button
          type="button"
          aria-label="Close project modal"
          onClick={handleClose}
          className="flex items-center gap-1.5 bg-[#fcfcfc] text-[#100f0c] font-medium rounded-full px-5 py-2 text-sm hover:bg-white shadow-sm transition-all pointer-events-auto cursor-pointer border border-[#100f0c]/10"
        >
          <span>close</span>
          <span className="text-sm font-bold leading-none transform -translate-y-px">×</span>
        </button>
      ) : (
        <div id="header-menu-button" className="w-[88px] h-[38px] pointer-events-none opacity-0" />
      )}
    </header>
  );
}
