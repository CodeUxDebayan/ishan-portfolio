import type { Metadata } from "next";
import "./globals.css";
import { GridBackground } from "@/components/ui/GridBackground";
import { Header } from "@/components/Header";
import { MenuOverlay } from "@/components/MenuOverlay";
import { ClientDitherWrapper } from "@/components/ClientDitherWrapper";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Ishan. | Portfolio",
  description: "Graphic Design Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-background text-foreground overflow-x-clip">
        <ClientDitherWrapper>
          <GridBackground />
          <MenuOverlay />
          <Header />
          {children}
        </ClientDitherWrapper>
      </body>
    </html>
  );
}
