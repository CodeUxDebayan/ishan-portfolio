"use client";

import { useEffect } from "react";

export function ClientDitherWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suppress deprecated THREE.Clock warning emitted from internal libraries
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].includes("THREE.Clock: This module has been deprecated")) {
        return;
      }
      originalWarn.apply(console, args);
    };
    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return <>{children}</>;
}
