"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { LocaleProvider } from "@/i18n/LocaleContext";
import { registerLenis } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/utils";
import Nav from "@/components/Nav";
import Hero from "@/components/hero/Hero";
import Work from "@/components/work/Work";
import Systems from "@/components/systems/Systems";
import Reach from "@/components/reach/Reach";
import Stack from "@/components/stack/Stack";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/Footer";

function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    registerLenis(lenis);
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      registerLenis(null);
      lenis.destroy();
    };
  }, []);
}

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("[data-reveal]:not([data-in])").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Site() {
  useSmoothScroll();
  useReveal();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Work />
        <Systems />
        <Reach />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <LocaleProvider>
      <Site />
    </LocaleProvider>
  );
}
