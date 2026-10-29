"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/i18n/LocaleContext";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  repo: string;
  tags: string[];
  featured?: boolean;
  color: string;
  icon: string;
}

const projects: Project[] = [
  {
    id: "account-management",
    name: "Account Management",
    nameHe: "ניהול חשבונות",
    description: "Hebrew invoice OCR system with automated data extraction and validation",
    descriptionHe: "מערכת OCR לחשבוניות בעברית עם חילוץ נתונים אוטומטי ואימות",
    repo: "Shtibel1/account-management",
    tags: ["OCR", "Hebrew", "Automation"],
    featured: true,
    color: "#3b82f6",
    icon: "📄",
  },
  {
    id: "blueapps",
    name: "BlueApps",
    nameHe: "BlueApps",
    description: "E-commerce platform with modern stack and payment integrations",
    descriptionHe: "פלטפורמת אי-קומרס עם סטאק מודרני ואינטגרציות תשלום",
    repo: "Shtibel1/blueapps",
    tags: ["E-commerce", "Next.js", "Payments"],
    featured: true,
    color: "#8b5cf6",
    icon: "🛒",
  },
  {
    id: "chessapi",
    name: "Chess API",
    nameHe: "Chess API",
    description: "RESTful chess analysis API with Stockfish engine integration",
    descriptionHe: "API לניתוח שחמט עם אינטגרציה למנוע Stockfish",
    repo: "Shtibel1/ChessApi",
    tags: ["API", "Chess", "Stockfish"],
    featured: false,
    color: "#f5a623",
    icon: "♟️",
  },
  {
    id: "alex",
    name: "Alex",
    nameHe: "אלכס",
    description: "AI assistant framework with multi-modal capabilities",
    descriptionHe: "מסגרת עוזר AI עם יכולות מרובות מדיומים",
    repo: "Shtibel1/Alex",
    tags: ["AI", "Assistant", "Multi-modal"],
    featured: true,
    color: "#10b981",
    icon: "🤖",
  },
  {
    id: "installersapi2",
    name: "Installers API",
    nameHe: "Installers API",
    description: "Service management and installer scheduling platform",
    descriptionHe: "פלטפורמת ניהול שירות ותזמון מתקינים",
    repo: "Shtibel1/InstallersApi2",
    tags: ["API", "Scheduling", "Services"],
    featured: false,
    color: "#ec4899",
    icon: "🔧",
  },
];

async function fetchGitHubStars(repo: string): Promise<number | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
}

function ProjectCard({ project, stars, index }: { project: Project; stars: number | null; index: number }) {
  const { t, locale, dir } = useLocale();
  const [isHovered, setIsHovered] = useState(false);

  const name = locale === "he" ? project.nameHe : project.name;
  const description = locale === "he" ? project.descriptionHe : project.description;

  return (
    <motion.a
      href={`https://github.com/${project.repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block rounded-2xl overflow-hidden",
        "bg-surface-elevated border border-border",
        "transition-all duration-500 hover:border-transparent",
        project.featured ? "col-span-2 row-span-2" : "col-span-1 row-span-1",
        project.featured ? "min-h-[320px]" : "min-h-[200px]"
      )}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered ? `0 0 60px ${project.color}20` : "none",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${project.color}10, transparent 40%)`,
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
      />

      <div className={cn("relative h-full p-6 flex flex-col", dir === "rtl" && "font-hebrew")}>
        <div className="flex items-start justify-between mb-4">
          <span className="text-3xl">{project.icon}</span>
          
          <div className="flex items-center gap-3">
            {stars !== null && (
              <div className="flex items-center gap-1 text-sm text-text-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-gold"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>{stars}</span>
              </div>
            )}
            
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-muted group-hover:text-foreground transition-colors"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </div>
        </div>

        <h3 className={cn(
          "font-bold mb-2 group-hover:text-foreground transition-colors",
          project.featured ? "text-2xl" : "text-lg"
        )}>
          {name}
        </h3>

        <p className={cn(
          "text-text-muted mb-4 leading-relaxed flex-grow",
          project.featured ? "text-base" : "text-sm"
        )}>
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-surface border border-border"
            >
              {tag}
            </span>
          ))}
        </div>

        <motion.div
          className="absolute bottom-4 right-4 flex items-center gap-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
          initial={false}
          animate={{ x: isHovered ? 0 : -10 }}
        >
          <span>{t.projects.viewCode}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={dir === "rtl" ? "rotate-180" : ""}
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </motion.div>
      </div>
    </motion.a>
  );
}

export default function ProjectsSection() {
  const { t, dir } = useLocale();
  const [stars, setStars] = useState<Record<string, number | null>>({});

  useEffect(() => {
    const fetchAllStars = async () => {
      const results: Record<string, number | null> = {};
      
      await Promise.all(
        projects.map(async (project) => {
          const starCount = await fetchGitHubStars(project.repo);
          results[project.id] = starCount;
        })
      );
      
      setStars(results);
    };

    fetchAllStars();
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8" id="projects">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className={cn("text-center mb-16", dir === "rtl" && "font-hebrew")}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            {t.projects.title}
          </h2>
          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto">
            {t.projects.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              stars={stars[project.id] ?? null}
              index={index}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
