"use client";

import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/content/data";
import { useLocale } from "@/i18n/LocaleContext";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "@/components/ui/Glyphs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Signature } from "./Signature";

const spanClass: Record<Project["span"], string> = {
  wide: "md:col-span-7",
  narrow: "md:col-span-5",
  third: "md:col-span-6 lg:col-span-4",
};

function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
      el.style.setProperty("--rx", `${(0.5 - y) * 3.2}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * 4.2}deg`);
    };
    const leave = () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);
  return ref;
}

function Star() {
  return (
    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden="true">
      <path d="M6 .8 7.5 4.3l3.7.3-2.8 2.4.9 3.7L6 8.7 2.7 10.7l.9-3.7L.8 4.6l3.7-.3z" fill="currentColor" />
    </svg>
  );
}

function ProjectCard({ project, index, stars }: { project: Project; index: number; stars: number | null }) {
  const { t, locale } = useLocale();
  const ref = useTilt<HTMLAnchorElement & HTMLDivElement>();
  const wide = project.span !== "third";
  const num = String(index + 1).padStart(2, "0");

  const body = (
    <>
      <div className="label flex items-center justify-between gap-4 px-6 pt-5 text-mist md:px-7">
        <span className="flex items-center gap-3">
          <span className="tabular text-signal">{num}</span>
          <span>{project.kind[locale]}</span>
        </span>
        <span className="flex items-center gap-3 text-fog">
          {stars !== null && stars > 0 && (
            <span className="flex items-center gap-1.5 text-mist tabular" aria-label={`${stars} ${t.work.stars}`}>
              <Star />
              {stars}
            </span>
          )}
          <span>{project.isPrivate ? t.work.visibilityPrivate : t.work.visibilityPublic}</span>
        </span>
      </div>

      <div
        className={cn(
          "relative mx-6 mt-5 overflow-hidden border border-line bg-[radial-gradient(120%_80%_at_50%_100%,rgb(143_211_204/0.05),transparent_60%)] md:mx-7",
          wide ? "h-48 md:h-64" : "h-40 md:h-44",
        )}
      >
        <Signature seed={project.seed} className="absolute inset-0 h-full w-full [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]" />
        <span className="label absolute bottom-3 start-3 text-[0.625rem] text-fog tabular" dir="ltr">
          {project.repo.split("/")[1].toLowerCase()}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-7 md:px-7 md:pb-7">
        <h3 className={cn("display text-bone", wide ? "text-[2.5rem] md:text-[3.25rem]" : "text-[2.25rem]")}>
          {project.name[locale]}
        </h3>
        <p className={cn("mt-4 text-mist", wide ? "max-w-md text-[1.0625rem]" : "text-[0.975rem]")}>
          {project.description[locale]}
        </p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-8">
          <span className="label text-fog" dir="ltr">
            {project.tags.join("  /  ")}
          </span>
          <span className="label flex shrink-0 items-center gap-2 text-bone">
            {project.isPrivate ? (
              <span className="text-fog">{t.work.private}</span>
            ) : (
              <>
                <span className="hidden sm:inline">{t.work.repo}</span>
                <ArrowUpRight className="card-arrow text-signal" />
              </>
            )}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <li className={cn("col-span-12", spanClass[project.span])} data-reveal style={{ "--d": `${(index % 3) * 90}ms` } as React.CSSProperties}>
      {project.isPrivate ? (
        <div ref={ref} className="card flex h-full flex-col">
          {body}
        </div>
      ) : (
        <a
          ref={ref}
          href={`https://github.com/${project.repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="card flex h-full flex-col"
        >
          {body}
        </a>
      )}
    </li>
  );
}

async function fetchStars(repo: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export default function Work() {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const [stars, setStars] = useState<Record<string, number | null>>({});

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        Promise.all(
          projects.filter((p) => !p.isPrivate).map(async (p) => [p.id, await fetchStars(p.repo)] as const),
        ).then((pairs) => setStars(Object.fromEntries(pairs)));
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader index={t.work.index} label={t.work.label} title={t.work.title} intro={t.work.intro} />
        <ul className="mt-16 grid grid-cols-12 gap-4 md:mt-24 md:gap-5">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} stars={stars[p.id] ?? null} />
          ))}
        </ul>
      </div>
    </section>
  );
}
