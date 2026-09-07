"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/useUIStore";
import { AudioPlayer } from "@/components/AudioPlayer";

export function Header() {
  const { viewMode, setViewMode, toggleMenu, isMenuOpen, activeProjectId, setActiveProject } = useUIStore();
  const pathname = usePathname();

  const isCloseMode = isMenuOpen || activeProjectId;
  
  const handleClose = () => {
    if (isMenuOpen) toggleMenu();
    if (activeProjectId) setActiveProject(null);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 flex items-center justify-between p-4 sm:p-6 pointer-events-none">
      {/* Logo */}
      <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tighter pointer-events-auto mix-blend-difference text-white">
        ishan.
      </Link>

      {/* Center Toggle (Switcher) - Responsive: floating glass pill below header on mobile, centered in header on desktop */}
      {pathname !== '/about' && !isCloseMode && (
        <div className="fixed top-18 md:top-6 left-1/2 -translate-x-1/2 flex items-center pointer-events-auto mix-blend-difference text-white z-30">
          <button
            onClick={() => setViewMode(viewMode === "spiral" ? "list" : "spiral")}
            className="text-white/80 hover:text-white transition-all text-xs md:text-sm font-medium tracking-widest lowercase bg-white/10 md:bg-transparent backdrop-blur-md md:backdrop-blur-none px-3.5 py-1.5 md:p-0 rounded-full border border-white/15 md:border-none shadow-sm md:shadow-none"
          >
            {viewMode === "spiral" ? <span className="font-bold text-white">helix</span> : <span className="text-white/60">helix</span>} ㆍ {viewMode === "list" ? <span className="font-bold text-white">list</span> : <span className="text-white/60">list</span>}
          </button>
        </div>
      )}

      {/* Right Controls (Audio Toggle & Menu Button) */}
      <div className={`flex items-center gap-2 sm:gap-2.5 ${isMenuOpen ? "pointer-events-none" : "pointer-events-auto"}`}>
        <div className="pointer-events-auto">
          <AudioPlayer />
        </div>
        {!isCloseMode ? (
          <button
            id="header-menu-button"
            type="button"
            aria-label="Menu button"
            onClick={toggleMenu}
            className="flex items-center justify-center bg-[#fcfcfc] text-[#100f0c] font-medium rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-white shadow-sm hover:shadow transition-all pointer-events-auto cursor-pointer border border-[#100f0c]/10"
          >
            .menu
          </button>
        ) : activeProjectId ? (
          <button
            type="button"
            aria-label="Close project modal"
            onClick={handleClose}
            className="flex items-center gap-1.5 bg-[#fcfcfc] text-[#100f0c] font-medium rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-white shadow-sm transition-all pointer-events-auto cursor-pointer border border-[#100f0c]/10"
          >
            <span>close</span>
            <span className="text-sm font-bold leading-none transform -translate-y-px">×</span>
          </button>
        ) : (
          <div id="header-menu-button" className="w-[88px] h-[38px] pointer-events-none opacity-0" />
        )}
      </div>
    </header>
  );
}
