"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useLocale } from "@/i18n/LocaleContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { canRenderOcean, cn } from "@/lib/utils";
import { ScrambleText } from "@/components/ui/ScrambleText";
import OceanFallback from "./OceanFallback";

const OceanScene = dynamic(() => import("./OceanScene"), {
  ssr: false,
  loading: () => <OceanFallback />,
});

export default function HeroSection() {
  const { t, dir } = useLocale();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canRender3D] = useState(() => {
    if (typeof window === "undefined") return false;
    return canRenderOcean();
  });
  const heroRef = useRef<HTMLElement>(null);
  const { ref: observerRef, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / windowHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-[200vh] overflow-hidden"
      id="hero"
    >
      <div
        ref={observerRef}
        className="sticky top-0 h-screen w-full flex items-center justify-center"
      >
        {canRender3D ? (
          <OceanScene scrollProgress={scrollProgress} isVisible={isVisible} />
        ) : (
          <OceanFallback />
        )}

        <div className="underwater-gradient absolute inset-0 pointer-events-none" 
          style={{ 
            opacity: scrollProgress * 0.8,
            transition: "opacity 0.1s ease-out"
          }} 
        />

        <motion.div
          className={cn(
            "relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto",
            dir === "rtl" && "font-hebrew"
          )}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            transform: `translateY(${scrollProgress * -100}px)`,
            opacity: 1 - scrollProgress * 1.5,
          }}
        >
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-white/80 mb-4"
          >
            {t.hero.greeting}
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          >
            <ScrambleText
              text={t.hero.name}
              className="gradient-text drop-shadow-2xl"
              delay={500}
              speed={40}
            />
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-4xl font-medium text-white/90 mb-6"
          >
            {t.hero.title}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-12 flex items-center justify-center gap-2 text-white/50"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </motion.div>
            <span className="text-sm">{t.hero.scrollHint}</span>
          </motion.div>
        </motion.div>

        <div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-20"
          style={{ opacity: Math.min(1, scrollProgress * 2) }}
        />
      </div>
    </section>
  );
}
