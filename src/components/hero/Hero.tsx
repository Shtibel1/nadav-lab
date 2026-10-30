"use client";

import { useCallback, useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowInline } from "@/components/ui/Glyphs";
import { LocalTime } from "@/components/ui/LocalTime";
import WaterCanvas, { type WaterStatus } from "./WaterCanvas";

function Corners() {
  return (
    <div className="pointer-events-none absolute inset-x-[var(--gutter)] top-[calc(var(--nav-h)+0.5rem)] bottom-[4.5rem] hidden md:block" aria-hidden="true">
      <span className="frame-corner start-0 top-0 border-s border-t" />
      <span className="frame-corner end-0 top-0 border-e border-t" />
      <span className="frame-corner start-0 bottom-0 border-s border-b" />
      <span className="frame-corner end-0 bottom-0 border-e border-b" />
    </div>
  );
}

export default function Hero() {
  const { t, dir, locale } = useLocale();
  const [status, setStatus] = useState<WaterStatus | null>(null);
  const onStatus = useCallback((s: WaterStatus) => setStatus(s), []);

  const simLabel =
    status?.mode === "live"
      ? `${t.hero.sim} · ${String(status.fps).padStart(2, "0")} fps · ${status.scale.toFixed(2)}×`
      : status?.mode === "still"
        ? t.hero.still
        : "\u00A0";

  return (
    <section id="top" className="relative isolate h-[100svh] min-h-[620px] overflow-hidden" aria-label={t.hero.name.join(" ")}>
      <div className="water-poster absolute inset-0 -z-20" aria-hidden="true" />
      <div className="absolute inset-0 -z-10">
        <WaterCanvas side={dir === "rtl" ? -1 : 1} onStatus={onStatus} />
      </div>
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(5_8_10/0.65)_0%,transparent_18%,transparent_48%,rgb(5_8_10/0.55)_78%,#05080a_100%)]"
        aria-hidden="true"
      />
      <Corners />

      <div className="shell relative flex h-full flex-col justify-end pb-[5.75rem] md:pb-[7rem]">
        <p className="label hero-fade mb-6 flex items-center gap-3 text-bone/80" style={{ "--i": 0 } as React.CSSProperties}>
          <span className="h-px w-8 bg-signal" />
          {t.hero.eyebrow}
        </p>

        <h1
          className={cn(
            "display text-bone",
            locale === "he" ? "text-[clamp(5.25rem,17vw,15rem)]" : "text-[clamp(4.5rem,15vw,14.5rem)]",
          )}
        >
          {t.hero.name.map((line, i) => (
            <span className="line-mask" key={line}>
              <span
                className={cn("hero-rise", locale === "en" && i === 1 && "italic ps-[0.08em]")}
                style={{ "--i": i } as React.CSSProperties}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-8 grid grid-cols-12 items-end gap-6 md:mt-10">
          <p
            className="hero-fade col-span-12 max-w-[34rem] text-[1.0625rem] leading-relaxed text-bone/80 md:col-span-7 md:text-lg lg:col-span-5"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            {t.hero.statement}
          </p>
          <div
            className="hero-fade col-span-12 flex flex-wrap items-center gap-x-8 gap-y-4 md:col-span-5 md:justify-end lg:col-span-7"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("work");
              }}
              className="group inline-flex items-center gap-3 bg-bone px-5 py-3 text-sm font-medium text-ink transition-colors duration-500 hover:bg-signal"
            >
              {t.hero.ctaWork}
              <ArrowInline className="transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("contact");
              }}
              className="u-link pb-1 text-sm text-bone/85 hover:text-bone"
            >
              {t.hero.ctaContact}
            </a>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-line">
        <div className="shell label flex h-14 items-center justify-between gap-6 text-mist">
          <span className="flex min-w-0 items-center gap-3">
            <span className={cn("pulse-dot shrink-0", status?.mode === "live" ? "text-signal" : "text-fog")} />
            <span className="truncate tabular" dir="ltr">
              {simLabel}
            </span>
          </span>
          <span className="hidden tabular md:inline" dir="ltr">
            {t.hero.coords}
          </span>
          <span className="hidden items-center gap-2 sm:flex">
            {t.hero.local}
            <span className="text-bone" dir="ltr">
              <LocalTime />
            </span>
          </span>
          <button
            type="button"
            onClick={() => scrollToId("work")}
            className="flex shrink-0 items-center gap-2 transition-colors hover:text-bone"
          >
            {t.hero.scroll}
            <ArrowDown />
          </button>
        </div>
      </div>
    </section>
  );
}
