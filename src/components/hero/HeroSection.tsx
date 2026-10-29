"use client";

import { useState } from "react";
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
  const [canRender3D] = useState(() => {
    if (typeof window === "undefined") return false;
    return canRenderOcean();
  });
  const { ref: observerRef, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
  });

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
      className="relative h-screen overflow-hidden"
      id="hero"
    >
      <div
        ref={observerRef}
        className="absolute inset-0 w-full h-full flex items-center justify-center"
      >
        {canRender3D ? (
          <OceanScene scrollProgress={0} isVisible={isVisible} />
        ) : (
          <OceanFallback />
        )}

        <motion.div
          className={cn(
            "relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto",
            dir === "rtl" && "font-hebrew"
          )}
          variants={containerVariants}
          initial="visible"
          animate="visible"
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
        />
      </div>
    </section>
  );
}
