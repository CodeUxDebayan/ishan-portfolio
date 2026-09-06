"use client";

import { useMemo } from "react";
import { useUIStore } from "@/store/useUIStore";
import { Spiral3DSlider, Spiral3DSlide } from "@/components/ui/spiral-3d-slider";

export type Project = {
  id: string;
  website_project_name: string;
  category_display: string;
  asset_locations: string[];
};

export function HelixCanvas({ projects, onSelect }: { projects: Project[], onSelect: (id: string) => void }) {
  const { setHoveredProject } = useUIStore();

  const items: Spiral3DSlide[] = useMemo(
    () =>
      projects.map((p) => ({
        id: p.id,
        src: encodeURI(p.asset_locations[0]),
        alt: p.website_project_name,
        project: p,
      })),
    [projects]
  );

  return (
    <div className="w-full h-dvh fixed inset-0 z-0 bg-[#000000]">
      <Spiral3DSlider
        items={items}
        onSelect={onSelect}
        onHover={setHoveredProject}
        blurStrength={1.8}
        autoRotate={true}
        autoSpeed={0.35}
        radius={240}
        verticalGap={65}
        cardWidth={260}
        cardAspectRatio={3 / 2}
        bend={0.16}
        className="w-full h-full bg-transparent"
      />
    </div>
  );
}

