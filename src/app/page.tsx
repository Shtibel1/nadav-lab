"use client";

import { useEffect } from "react";
import { LocaleProvider } from "@/i18n/LocaleContext";
import { useLenis } from "@/hooks/useLenis";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/hero/HeroSection";
import TerminalSection from "@/components/terminal/TerminalSection";
import ProjectsSection from "@/components/projects/ProjectsSection";
import TimelineSection from "@/components/timeline/TimelineSection";
import GlobeSection from "@/components/globe/GlobeSection";
import ContactSection from "@/components/contact/ContactSection";
import Footer from "@/components/Footer";

function Portfolio() {
  useLenis();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll<HTMLElement>("[data-spotlight]");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mouse-x", `${x}%`);
        card.style.setProperty("--mouse-y", `${y}%`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <Navigation />
      <main className="flex-1 overflow-x-clip">
        <HeroSection />
        <div className="section-divider" />
        <TerminalSection />
        <div className="section-divider" />
        <ProjectsSection />
        <div className="section-divider" />
        <TimelineSection />
        <div className="section-divider" />
        <GlobeSection />
        <div className="section-divider" />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <LocaleProvider>
      <Portfolio />
    </LocaleProvider>
  );
}
