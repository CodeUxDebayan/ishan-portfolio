"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useUIStore } from "@/store/useUIStore";
import Link from "next/link";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(MorphSVGPlugin);
}

// Generate exact 4-corner cubic bezier rounded rectangle SVG path
function getRoundedRectPath(x: number, y: number, w: number, h: number, r: number): string {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  const k = radius * 0.55228475; // Cubic bezier circle approximation constant

  return [
    `M ${x + radius} ${y}`,
    `L ${x + w - radius} ${y}`,
    `C ${x + w - radius + k} ${y}, ${x + w} ${y + radius - k}, ${x + w} ${y + radius}`,
    `L ${x + w} ${y + h - radius}`,
    `C ${x + w} ${y + h - radius + k}, ${x + w - radius + k} ${y + h}, ${x + w - radius} ${y + h}`,
    `L ${x + radius} ${y + h}`,
    `C ${x + radius - k} ${y + h}, ${x} ${y + h - radius + k}, ${x} ${y + h - radius}`,
    `L ${x} ${y + radius}`,
    `C ${x} ${y + radius - k}, ${x + radius - k} ${y}, ${x + radius} ${y}`,
    `Z`
  ].join(" ");
}

export function MenuOverlay() {
  const { isMenuOpen, closeMenu } = useUIStore();
  const [isVisible, setIsVisible] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  const backdropRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Update window dimensions
  const updateDimensions = useCallback(() => {
    if (typeof window !== "undefined") {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // Layout parameters matching user requirements
  const marginTop = 25;
  const marginRight = 25;
  const marginBottom = 25;
  const sidebarRadius = 18;
  const sidebarWidth = Math.min(460, Math.max(280, dimensions.width - marginRight - 25));
  const sidebarHeight = Math.max(200, dimensions.height - marginTop - marginBottom);
  const sidebarX = dimensions.width - marginRight - sidebarWidth;
  const sidebarY = marginTop;

  // Calculate button coordinates
  const getButtonCoords = useCallback(() => {
    if (typeof window === "undefined") {
      return { x: dimensions.width - 24 - 110, y: 24, w: 110, h: 42, r: 21 };
    }
    const btn = document.getElementById("header-menu-button");
    if (btn) {
      const rect = btn.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return {
          x: rect.left,
          y: rect.top,
          w: rect.width,
          h: rect.height,
          r: rect.height / 2,
        };
      }
    }
    return {
      x: dimensions.width - 24 - 110,
      y: 24,
      w: 110,
      h: 42,
      r: 21,
    };
  }, [dimensions.width]);

  // Handle open / close animations with GSAP MorphSVG & power3.inOut
  useEffect(() => {
    if (isMenuOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";

      // Small tick to ensure DOM nodes are ready
      const timer = requestAnimationFrame(() => {
        if (!pathRef.current || !backdropRef.current || !contentRef.current) return;

        const btn = getButtonCoords();
        const buttonPath = getRoundedRectPath(btn.x, btn.y, btn.w, btn.h, btn.r);
        const sidebarPath = getRoundedRectPath(sidebarX, sidebarY, sidebarWidth, sidebarHeight, sidebarRadius);

        // Kill any previous timeline
        if (timelineRef.current) {
          timelineRef.current.kill();
        }

        // Set starting state
        pathRef.current.setAttribute("d", buttonPath);
        gsap.set(backdropRef.current, { opacity: 0 });
        gsap.set(contentRef.current, { opacity: 0, scale: 0.98, pointerEvents: "none" });
        const validNavItems = navItemsRef.current.filter(Boolean);
        if (validNavItems.length > 0) {
          gsap.set(validNavItems, { opacity: 0, y: 24 });
        }
        if (footerRef.current) {
          gsap.set(footerRef.current, { opacity: 0, y: 15 });
        }

        // Create opening timeline
        const tl = gsap.timeline({
          onComplete: () => {
            if (contentRef.current) {
              contentRef.current.style.pointerEvents = "auto";
            }
          },
        });

        // 1. Backdrop fade in
        tl.to(
          backdropRef.current,
          {
            opacity: 1,
            duration: 0.65,
            ease: "power3.inOut",
          },
          0
        );

        // 2. Smooth SVG morph from menu button pill to open sidebar
        tl.to(
          pathRef.current,
          {
            morphSVG: sidebarPath,
            duration: 0.75,
            ease: "power3.inOut",
          },
          0
        );

        // 3. Reveal content inside the sidebar
        tl.to(
          contentRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: "power3.out",
          },
          0.22
        );

        // 4. Stagger navigation items
        if (validNavItems.length > 0) {
          tl.to(
            validNavItems,
            {
              opacity: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.45,
              ease: "power3.out",
            },
            0.28
          );
        }

        // 5. Reveal footer
        if (footerRef.current) {
          tl.to(
            footerRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              ease: "power3.out",
            },
            0.36
          );
        }

        timelineRef.current = tl;
      });

      return () => cancelAnimationFrame(timer);
    } else if (isVisible) {
      document.body.style.overflow = "";

      if (!pathRef.current || !backdropRef.current || !contentRef.current) {
        setIsVisible(false);
        return;
      }

      const btn = getButtonCoords();
      const buttonPath = getRoundedRectPath(btn.x, btn.y, btn.w, btn.h, btn.r);

      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      if (contentRef.current) {
        contentRef.current.style.pointerEvents = "none";
      }

      // Closing timeline
      const tl = gsap.timeline({
        onComplete: () => {
          setIsVisible(false);
        },
      });

      // 1. Fast fade out of text contents
      tl.to(
        contentRef.current,
        {
          opacity: 0,
          scale: 0.97,
          duration: 0.22,
          ease: "power3.in",
        },
        0
      );

      // 2. Smooth SVG morph back to menu button shape with power3.inOut
      tl.to(
        pathRef.current,
        {
          morphSVG: buttonPath,
          duration: 0.7,
          ease: "power3.inOut",
        },
        0.04
      );

      // 3. Fade out backdrop
      tl.to(
        backdropRef.current,
        {
          opacity: 0,
          duration: 0.65,
          ease: "power3.inOut",
        },
        0.04
      );

      timelineRef.current = tl;
    }
  }, [isMenuOpen, dimensions, sidebarX, sidebarY, sidebarWidth, sidebarHeight, sidebarRadius, getButtonCoords]);

  // Keyboard shortcut (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  if (!isVisible && !isMenuOpen) {
    return null;
  }

  const navLinks = [
    { name: "works", href: "/" },
    { name: "about", href: "/about" },
    { name: "contact", href: "mailto:isshaaannn@gmail.com" },
  ];

  return (
    <div className="fixed inset-0 z-60 pointer-events-none">
      {/* Dark backdrop */}
      <div
        ref={backdropRef}
        onClick={closeMenu}
        className="fixed inset-0 bg-black/45 backdrop-blur-sm pointer-events-auto cursor-pointer"
        aria-label="Close menu backdrop"
      />

      {/* SVG Canvas for MorphSVG */}
      <svg
        ref={svgRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-60 overflow-visible"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="menu-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="18" stdDeviation="28" floodColor="#000000" floodOpacity="0.28" />
          </filter>
        </defs>
        <path
          ref={pathRef}
          fill="#fcfcfc"
          filter="url(#menu-shadow)"
          className="pointer-events-auto transition-colors"
        />
      </svg>

      {/* Close button positioned at the exact same location as the unopened .menu button */}
      <button
        type="button"
        onClick={closeMenu}
        aria-label="Close menu"
        className="fixed top-6 right-6 z-80 flex items-center justify-center gap-1.5 bg-[#fcfcfc] text-[#100f0c] font-medium rounded-full px-5 py-2 text-sm hover:bg-white shadow-sm hover:shadow transition-all pointer-events-auto cursor-pointer border border-[#100f0c]/10 group"
      >
        <span className="group-hover:opacity-75 transition-opacity">close</span>
        <span className="text-sm font-bold leading-none text-[#100f0c] transform -translate-y-px">×</span>
      </button>

      {/* Sidebar Content Container matching top/right/bottom margins & 18px radius */}
      <div
        ref={contentRef}
        style={{
          top: `${marginTop}px`,
          right: `${marginRight}px`,
          width: `${sidebarWidth}px`,
          height: `${sidebarHeight}px`,
          borderRadius: `${sidebarRadius}px`,
        }}
        className="fixed z-70 flex flex-col justify-between p-7 sm:p-10 md:p-12 text-[#100f0c] pointer-events-none overflow-hidden select-none"
      >
        {/* Top spacer */}
        <div className="h-6 w-full" />

        {/* Nav Links */}
        <nav className="flex flex-col gap-3 md:gap-5 my-auto">
          {navLinks.map((item, i) => (
            <div
              key={item.name}
              ref={(el) => {
                navItemsRef.current[i] = el;
              }}
            >
              <Link
                href={item.href}
                onClick={closeMenu}
                className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight transition-all duration-300 flex items-center group font-sans relative text-[#100f0c] pointer-events-auto"
              >
                {/* Unclipped circular hover dot with power2.out easing */}
                <span className="inline-flex items-center justify-center w-0 group-hover:w-7 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0,0,0.2,1)] overflow-visible shrink-0 mr-0 group-hover:mr-1">
                  <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#100f0c] block transition-transform duration-300 ease-[cubic-bezier(0,0,0.2,1)] scale-0 group-hover:scale-100 shrink-0" />
                </span>
                <span className="transition-transform duration-300 ease-[cubic-bezier(0,0,0.2,1)] group-hover:translate-x-1">
                  {item.name}
                </span>
              </Link>
            </div>
          ))}
        </nav>

        {/* Footer info & socials */}
        <div
          ref={footerRef}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 w-full pt-4 border-t border-[#100f0c]/10"
        >
          <a
            href="mailto:isshaaannn@gmail.com"
            className="text-sm font-sans text-[#100f0c]/75 hover:text-[#100f0c] transition-colors pointer-events-auto"
          >
            isshaaannn@gmail.com
          </a>

          <div className="flex gap-2">
            {[
              { name: "Ig", href: "https://www.instagram.com/1shaaann.n?stkn=OTNyMTRhdWVxdjRo", label: "Instagram" },
              { name: "X", href: "https://x.com/ishan575?s=11", label: "X" },
              { name: "Bē", href: "https://www.behance.net/isshhaaannn", label: "Behance" },
              { name: "in", href: "https://www.linkedin.com/in/ishan-mitra-279385272?utm_source=share_via&utm_content=profile&utm_medium=member_ios", label: "LinkedIn" },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#100f0c] text-white flex items-center justify-center hover:scale-110 hover:bg-[#333] transition-all font-sans text-xs sm:text-sm pointer-events-auto"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
