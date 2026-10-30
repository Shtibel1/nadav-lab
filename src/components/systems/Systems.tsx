"use client";

import { useEffect, useRef, useState } from "react";
import { agentRuns, type TraceKind } from "@/content/data";
import { useLocale } from "@/i18n/LocaleContext";
import { cn, prefersReducedMotion } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

const CHAR_MS = 18;
const HOLD_MS = 3400;

const kindTag: Record<TraceKind, { tag: string; className: string }> = {
  cmd: { tag: "EXEC", className: "text-signal" },
  step: { tag: "STEP", className: "text-fog" },
  data: { tag: "DATA", className: "text-tide/80" },
  ok: { tag: "DONE", className: "text-bone" },
};

function runLength(i: number) {
  const lines = agentRuns[i].lines;
  return lines[lines.length - 1].at + 700;
}

export default function Systems() {
  const { t, locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const [{ active, elapsed }, setView] = useState({ active: 0, elapsed: Number.POSITIVE_INFINITY });
  const [inView, setInView] = useState(false);
  const startRef = useRef(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    startRef.current = performance.now();
    const id = window.setInterval(() => {
      if (!startRef.current) startRef.current = performance.now();
      const e = performance.now() - startRef.current;
      if (e > runLength(active) + HOLD_MS) {
        setView({ active: (active + 1) % agentRuns.length, elapsed: 0 });
        return;
      }
      setView({ active, elapsed: e });
    }, 33);
    return () => window.clearInterval(id);
  }, [inView, active]);

  const select = (i: number) => {
    startRef.current = 0;
    setView({ active: i, elapsed: prefersReducedMotion() ? Number.POSITIVE_INFINITY : 0 });
  };

  const run = agentRuns[active];
  const total = runLength(active);
  const progress = Math.min(1, elapsed / total);
  const done = elapsed >= total;

  return (
    <section ref={sectionRef} id="systems" className="relative border-t border-line py-28 md:py-40">
      <div className="shell">
        <SectionHeader index={t.systems.index} label={t.systems.label} title={t.systems.title} intro={t.systems.intro} />

        <div className="mt-16 grid grid-cols-1 border border-line bg-ink-2 md:mt-24 lg:grid-cols-[19rem_1fr]" data-reveal>
          <div className="border-b border-line lg:border-b-0 lg:border-e">
            <div className="label flex h-12 items-center justify-between border-b border-line px-5 text-fog">
              <span>{t.systems.processes}</span>
              <span className="tabular">{String(agentRuns.length).padStart(2, "0")}</span>
            </div>
            <ul className="grid grid-cols-2 lg:grid-cols-1">
              {agentRuns.map((r, i) => {
                const on = i === active;
                return (
                  <li key={r.id} className="border-line max-lg:odd:border-e max-lg:[&:nth-child(-n+2)]:border-b lg:border-b">
                    <button
                      type="button"
                      onClick={() => select(i)}
                      aria-pressed={on}
                      className={cn(
                        "relative flex w-full flex-col items-start gap-1 px-5 py-4 text-start transition-colors duration-500",
                        on ? "bg-ink-3" : "hover:bg-ink-3/60",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute inset-y-0 start-0 w-px bg-signal transition-transform duration-700",
                          on ? "scale-y-100" : "scale-y-0",
                        )}
                      />
                      <span className="flex w-full items-center justify-between gap-3">
                        <span className={cn("mono truncate text-[0.75rem] md:text-[0.8125rem]", on ? "text-bone" : "text-mist")} dir="ltr">
                          {r.title}
                        </span>
                        <span className={cn("pulse-dot", on ? "text-signal" : "text-fog/60 [&::after]:hidden")} />
                      </span>
                      <span className="text-[0.8125rem] text-fog">{r.role[locale]}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex min-w-0 flex-col">
            <div className="relative flex h-12 items-center justify-between gap-4 border-b border-line px-5">
              <span className="mono truncate text-[0.8125rem] text-mist" dir="ltr">
                <span className="text-fog">~/agents/</span>
                {run.title}
                <span className="ms-3 hidden text-fog sm:inline">{run.host}</span>
              </span>
              <span className="label flex shrink-0 items-center gap-3 text-mist">
                <span className={done ? "text-bone" : "text-signal"}>{done ? t.systems.complete : t.systems.streaming}</span>
                <span className="tabular normal-case text-fog" dir="ltr">
                  {(Math.min(elapsed, total) / 1000).toFixed(2)}s
                </span>
              </span>
              <span
                className="absolute bottom-[-1px] start-0 h-px w-full origin-left bg-signal/70 rtl:origin-right"
                style={{ transform: `scaleX(${Number.isFinite(progress) ? progress : 1})` }}
              />
            </div>

            <ol className="mono relative min-h-[20rem] px-5 py-6 text-[0.75rem] leading-6 sm:text-[0.8125rem] md:min-h-[21rem] md:text-[0.875rem] md:leading-7" dir="ltr" aria-live="off">
              {run.lines.map((line, i) => {
                if (elapsed < line.at) return null;
                const tag = kindTag[line.kind];
                const typed =
                  line.kind === "cmd" ? line.text.slice(0, Math.floor((elapsed - line.at) / CHAR_MS)) : line.text;
                const typing = line.kind === "cmd" && typed.length < line.text.length;
                return (
                  <li key={`${run.id}-${i}`} className="grid grid-cols-[2.75rem_1fr] gap-x-3 sm:grid-cols-[4.25rem_3.25rem_1fr] md:grid-cols-[5rem_3.75rem_1fr]">
                    <span className="hidden tabular text-fog/70 sm:block">+{(line.at / 1000).toFixed(2)}</span>
                    <span className={cn("text-[0.6875rem] tracking-[0.12em]", tag.className)}>{tag.tag}</span>
                    <span className={cn("min-w-0 break-words", line.kind === "cmd" ? "text-bone" : line.kind === "ok" ? "text-bone" : "text-mist")}>
                      {line.kind === "cmd" && <span className="me-2 text-signal">$</span>}
                      <span>{typed}</span>
                      {typing && <span className="caret" />}
                    </span>
                  </li>
                );
              })}
              {done && (
                <li className="grid grid-cols-[2.75rem_1fr] gap-x-3 sm:grid-cols-[4.25rem_3.25rem_1fr] md:grid-cols-[5rem_3.75rem_1fr]">
                  <span className="hidden sm:block" />
                  <span />
                  <span>
                    <span className="me-2 text-signal">$</span>
                    <span className="caret" />
                  </span>
                </li>
              )}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
