import fs from "fs";
import path from "path";
import { AboutHero } from "@/components/AboutHero";
import { IconTrail } from "@/components/IconTrail";
import { WorkSlider } from "@/components/WorkSlider";
import { ClientsSection } from "@/components/ClientsSection";
import { Project } from "@/components/3d/HelixCanvas";
import { ThreeDPaper } from "@/components/3d/ThreeDPaper";
import { Signature } from "@/components/ui/signature";

export default function AboutPage() {
  const dbPath = path.join(process.cwd(), "portfolio_db.json");
  const dbData = fs.readFileSync(dbPath, "utf-8");
  const projects: Project[] = JSON.parse(dbData);

  // Take a slice for the slider
  const sliderProjects = projects.slice(0, 10);

  return (
    <main className="relative min-h-screen bg-[#000000] text-[#F2EEE5] pb-24">
      <AboutHero />
      <ClientsSection />
      <WorkSlider projects={sliderProjects} />
      
      {/* Footer / Social Links */}
      <IconTrail>
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center justify-center gap-8 w-full z-10">
          <a
            href="mailto:isshaaannn@gmail.com"
            className="inline-flex items-center justify-center transition-all mb-4 group"
            aria-label="Email Ishan"
          >
            <Signature
              text="isshaaannn@gmail.com"
              fontSize={35}
              color="#F2EEE5"
              fontUrl="/fonts/helvetica-255/Helvetica-Bold.ttf"
              inView={true}
              once={false}
              replayOnHover={true}
            />
          </a>

          {/* 3D Paper Certificate */}
          <div className="w-full max-w-xl my-4">
            <ThreeDPaper />
          </div>

          {/* Clean White Text Social Links */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mt-4">
            {[
              { name: 'Instagram', href: "https://www.instagram.com/1shaaann.n?stkn=OTNyMTRhdWVxdjRo" },
              { name: 'X', href: "https://x.com/ishan575?s=11" },
              { name: 'Behance', href: "https://www.behance.net/isshhaaannn" },
              { name: 'LinkedIn', href: "https://www.linkedin.com/in/ishan-mitra-279385272?utm_source=share_via&utm_content=profile&utm_medium=member_ios" }
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl md:text-2xl font-bold tracking-tighter text-white hover:text-white/70 transition-colors uppercase leading-none"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </IconTrail>
    </main>
  );
}
