import fs from "fs";
import path from "path";
import { Project } from "@/components/3d/HelixCanvas";
import { MainView } from "@/components/MainView";

export default async function Home() {
  const dbPath = path.join(process.cwd(), "portfolio_db.json");
  const dbData = fs.readFileSync(dbPath, "utf-8");
  const projects: Project[] = JSON.parse(dbData);

  return (
    <main className="relative min-h-dvh bg-transparent text-[#F2EEE5] overflow-hidden">
      <MainView projects={projects} />
    </main>
  );
}
