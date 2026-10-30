"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { origin, regions } from "@/content/data";
import { useLocale } from "@/i18n/LocaleContext";
import { cn, fiberRttMs, formatNumber, greatCircleKm, prefersReducedMotion } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import Globe from "./Globe";

const CYCLE_MS = 4200;

export default function Reach() {
  const { t, locale } = useLocale();
  const [active, setActive] = useState(0);
  const pausedUntil = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);

  const rows = useMemo(
    () =>
      regions.map((r) => {
        const km = greatCircleKm(origin.coords, r.coords);
        return { ...r, km, rtt: fiberRttMs(km) };
      }),
    [],
  );

  const pause = useCallback(() => {
    pausedUntil.current = performance.now() + 9000;
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || prefersReducedMotion()) return;
    let id = 0;
    const io = new IntersectionObserver(([entry]) => {
      window.clearInterval(id);
      if (!entry.isIntersecting) return;
      id = window.setInterval(() => {
        if (performance.now() < pausedUntil.current) return;
        setActive((a) => (a + 1) % regions.length);
      }, CYCLE_MS);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, []);

  const focus = (i: number) => {
    pause();
    setActive(i);
  };

  const current = rows[active];

  return (
    <section ref={sectionRef} id="reach" className="relative overflow-hidden border-t border-line py-28 md:py-40">
      <div className="shell">
        <SectionHeader index={t.reach.index} label={t.reach.label} title={t.reach.title} intro={t.reach.intro} />

        <div className="mt-14 grid grid-cols-12 items-center gap-x-6 gap-y-14 md:mt-20">
          <div className="order-1 col-span-12 lg:order-2 lg:col-span-7" data-reveal>
            <div className="relative mx-auto max-w-[min(42rem,100%)]">
              <Globe
                active={active}
                onInteract={pause}
                labels={{ origin: `${origin.code} · ${origin.city[locale]}`, region: current.city[locale], code: current.code }}
              />
              <p className="label mt-4 text-center text-fog">{t.reach.drag}</p>
            </div>
          </div>

          <div className="order-2 col-span-12 lg:order-1 lg:col-span-5" data-reveal style={{ "--d": "120ms" } as React.CSSProperties}>
            <div className="label grid grid-cols-[1fr_auto_auto] gap-x-4 sm:gap-x-6 border-b border-line-strong pb-3 text-fog">
              <span>{t.reach.region}</span>
              <span className="w-20 whitespace-nowrap text-end">{t.reach.distance}</span>
              <span className="w-16 whitespace-nowrap text-end">{t.reach.rtt}</span>
            </div>
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 sm:gap-x-6 border-b border-line py-4">
              <span className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                <span className="mono self-start text-[0.75rem] text-signal sm:w-[8.5rem] sm:shrink-0 sm:self-auto sm:text-[0.8125rem]" dir="ltr">
                  {origin.code}
                </span>
                <span className="text-bone">{origin.city[locale]}</span>
              </span>
              <span className="label col-span-2 text-end text-signal">{t.reach.origin}</span>
            </div>
            <ul onMouseLeave={pause}>
              {rows.map((r, i) => {
                const on = i === active;
                return (
                  <li key={r.code}>
                    <button
                      type="button"
                      onMouseEnter={() => focus(i)}
                      onFocus={() => focus(i)}
                      onClick={() => focus(i)}
                      aria-pressed={on}
                      className={cn(
                        "spec-row grid w-full grid-cols-[1fr_auto_auto] items-center gap-x-4 sm:gap-x-6 border-b border-line py-3.5 text-start transition-colors duration-500",
                        on ? "text-bone" : "text-mist hover:text-bone",
                      )}
                    >
                      <span className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                        <span
                          className={cn(
                            "mono self-start text-[0.75rem] transition-colors sm:w-[8.5rem] sm:shrink-0 sm:self-auto sm:text-[0.8125rem]",
                            on ? "text-signal" : "text-fog",
                          )}
                          dir="ltr"
                        >
                          {r.code}
                        </span>
                        <span className="truncate text-start">{r.city[locale]}</span>
                      </span>
                      <span className="mono tabular w-20 text-end text-[0.8125rem]">
                        {formatNumber(r.km, locale)}
                        <span className="ms-1 text-fog">{t.reach.km}</span>
                      </span>
                      <span className="mono tabular w-16 text-end text-[0.8125rem]">
                        {r.rtt.toFixed(1)}
                        <span className="ms-1 text-fog">{t.reach.ms}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
