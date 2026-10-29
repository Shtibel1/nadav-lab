"use client";

import { useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/i18n/LocaleContext";
import { cn } from "@/lib/utils";

interface TechItem {
  name: string;
  icon: string;
  category: "language" | "framework" | "tool" | "cloud" | "ai";
  description: string;
  descriptionHe: string;
}

const techStack: TechItem[] = [
  { name: "TypeScript", icon: "TS", category: "language", description: "Type-safe JavaScript for scalable applications", descriptionHe: "JavaScript עם טיפוסים לאפליקציות מדרגיות" },
  { name: "Python", icon: "PY", category: "language", description: "AI/ML and automation scripting", descriptionHe: "סקריפטים של AI/ML ואוטומציה" },
  { name: "Next.js", icon: "NX", category: "framework", description: "Full-stack React framework", descriptionHe: "פריימוורק Full-stack React" },
  { name: "Node.js", icon: "NO", category: "framework", description: "Server-side JavaScript runtime", descriptionHe: "סביבת JavaScript בצד שרת" },
  { name: "React", icon: "RE", category: "framework", description: "Component-based UI library", descriptionHe: "ספריית UI מבוססת קומפוננטות" },
  { name: "Docker", icon: "DK", category: "tool", description: "Containerization and orchestration", descriptionHe: "קונטיינרים ואורקסטרציה" },
  { name: "AWS", icon: "AW", category: "cloud", description: "Cloud infrastructure and services", descriptionHe: "תשתית ושירותי ענן" },
  { name: "PostgreSQL", icon: "PG", category: "tool", description: "Relational database", descriptionHe: "בסיס נתונים רלציוני" },
  { name: "Redis", icon: "RD", category: "tool", description: "In-memory data store", descriptionHe: "מאגר נתונים בזיכרון" },
  { name: "OpenAI", icon: "AI", category: "ai", description: "LLM integration and agents", descriptionHe: "אינטגרציית LLM וסוכנים" },
  { name: "MCP", icon: "MC", category: "ai", description: "Model Context Protocol tools", descriptionHe: "כלי Model Context Protocol" },
];

const categoryColors: Record<TechItem["category"], string> = {
  language: "#3b82f6",
  framework: "#8b5cf6",
  tool: "#10b981",
  cloud: "#f59e0b",
  ai: "#ec4899",
};

function TechBadge({ tech, index }: { tech: TechItem; index: number }) {
  const { locale } = useLocale();
  const description = locale === "he" ? tech.descriptionHe : tech.description;

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div
        className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-elevated border border-border hover:border-transparent transition-all duration-300 cursor-default"
        style={{
          boxShadow: `0 0 0 1px ${categoryColors[tech.category]}00`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 0 30px ${categoryColors[tech.category]}30`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `0 0 0 1px ${categoryColors[tech.category]}00`;
        }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
          style={{ background: `${categoryColors[tech.category]}20`, color: categoryColors[tech.category] }}
        >
          {tech.icon}
        </div>
        <div>
          <div className="font-medium text-foreground">{tech.name}</div>
          <div className="text-xs text-text-muted">{description}</div>
        </div>
      </div>
    </motion.div>
  );
}

function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      time += 0.005;
      
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(
        width * 0.5 + Math.sin(time) * 100,
        height * 0.5 + Math.cos(time * 0.7) * 100,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.08)");
      gradient.addColorStop(0.3, "rgba(139, 92, 246, 0.05)");
      gradient.addColorStop(0.6, "rgba(236, 72, 153, 0.03)");
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const gradient2 = ctx.createRadialGradient(
        width * 0.3 + Math.cos(time * 1.2) * 150,
        height * 0.7 + Math.sin(time * 0.9) * 150,
        0,
        width * 0.3,
        height * 0.7,
        Math.max(width, height) * 0.6
      );
      
      gradient2.addColorStop(0, "rgba(245, 166, 35, 0.06)");
      gradient2.addColorStop(0.5, "rgba(16, 185, 129, 0.04)");
      gradient2.addColorStop(1, "transparent");

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}

export default function TimelineSection() {
  const { t, dir } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const grouped = techStack.reduce((acc, tech) => {
      if (!acc[tech.category]) acc[tech.category] = [];
      acc[tech.category].push(tech);
      return acc;
    }, {} as Record<string, TechItem[]>);
    
    return Object.entries(grouped);
  }, []);

  const categoryLabels: Record<TechItem["category"], { en: string; he: string }> = {
    language: { en: "Languages", he: "שפות" },
    framework: { en: "Frameworks", he: "פריימוורקים" },
    tool: { en: "Tools", he: "כלים" },
    cloud: { en: "Cloud", he: "ענן" },
    ai: { en: "AI/ML", he: "בינה מלאכותית" },
  };

  return (
    <section
      ref={containerRef}
      className="relative py-24 sm:py-32 overflow-hidden"
      id="timeline"
    >
      <ShaderBackground />

      <div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className={cn("text-center mb-16", dir === "rtl" && "font-hebrew")}>
          <motion.h2
            className="text-4xl sm:text-5xl font-bold mb-4 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t.timeline.title}
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t.timeline.subtitle}
          </motion.p>
        </div>

        <div className="space-y-12">
          {categories.map(([category, techs], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: categoryColors[category as TechItem["category"]] }}
                />
                <h3 className={cn("text-xl font-semibold text-foreground", dir === "rtl" && "font-hebrew")}>
                  {categoryLabels[category as TechItem["category"]][dir === "rtl" ? "he" : "en"]}
                </h3>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {techs.map((tech, index) => (
                  <TechBadge key={tech.name} tech={tech} index={index + categoryIndex * 4} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
    </section>
  );
}
