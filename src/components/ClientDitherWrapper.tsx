"use client";

import { useUIStore } from "@/store/useUIStore";
import { RetroDither } from "@/components/canvasui/RetroDither";

export function ClientDitherWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
