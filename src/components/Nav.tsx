"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";

const items = [
  { id: "work", key: "work", index: "01" },
  { id: "systems", key: "systems", index: "02" },
  { id: "reach", key: "reach", index: "03" },
  { id: "stack", key: "stack", index: "04" },
  { id: "contact", key: "contact", index: "05" },
] as const;

function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="label flex items-center gap-1" role="group" aria-label="Language">
      {(["he", "en"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-fog">/</span>}
          <button
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={locale === l}
            lang={l}
            className={cn("px-1 py-1 transition-colors", locale === l ? "text-bone" : "text-fog hover:text-mist")}
          >
            {l === "he" ? "עב" : "EN"}
          </button>
        </span>
      ))}
    </div>
  );
}

export default function Nav() {
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
      const probe = window.scrollY + window.innerHeight * 0.4;
      let current = "top";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= probe) current = item.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <a
        href="#work"
        className="label fixed start-4 top-4 z-[80] -translate-y-24 bg-bone px-3 py-2 text-ink focus:translate-y-0"
      >
        {t.nav.skip}
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-700",
          scrolled || open
            ? "border-b border-line bg-ink/70 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent",
        )}
      >
        <nav className="shell flex h-[var(--nav-h)] items-center justify-between gap-6">
          <button type="button" onClick={() => go("top")} className="group flex items-center gap-3" aria-label="Nadav Shtibel">
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              <circle cx="9" cy="10.5" r="3.25" className="fill-signal" />
              <rect x="3" y="13" width="18" height="1.25" className="fill-bone" />
              <path d="M3 17.5c2 0 2-1.25 4.5-1.25S9.5 17.5 12 17.5s2-1.25 4.5-1.25 2.5 1.25 4.5 1.25" fill="none" className="stroke-bone/50" strokeWidth="1.1" />
            </svg>
            <span className="label text-bone" dir="ltr">
              N. Shtibel <span className="text-fog transition-colors group-hover:text-signal">/ Lab</span>
            </span>
          </button>

          <ul className="hidden items-center gap-8 lg:flex">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.id);
                  }}
                  aria-current={active === item.id ? "true" : undefined}
                  className={cn(
                    "label group flex items-center gap-2 transition-colors duration-500",
                    active === item.id ? "text-bone" : "text-mist hover:text-bone",
                  )}
                >
                  <span className={cn("tabular transition-colors", active === item.id ? "text-signal" : "text-fog")}>
                    {item.index}
                  </span>
                  {t.nav[item.key]}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <LanguageToggle />
            <button
              type="button"
              className="label flex items-center gap-2 text-bone lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="relative block h-2 w-4" aria-hidden="true">
                <span className={cn("absolute inset-x-0 top-0 h-px bg-current transition-transform duration-500", open && "translate-y-1 rotate-45")} />
                <span className={cn("absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-500", open && "-translate-y-[3px] -rotate-45")} />
              </span>
              {open ? t.nav.close : t.nav.menu}
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl transition-[opacity,visibility] duration-500 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
        aria-hidden={!open}
      >
        <ul className="shell flex h-full flex-col justify-center gap-2 pt-[var(--nav-h)]">
          {items.map((item, i) => (
            <li key={item.id} className="border-b border-line">
              <a
                href={`#${item.id}`}
                tabIndex={open ? 0 : -1}
                onClick={(e) => {
                  e.preventDefault();
                  go(item.id);
                }}
                className={cn(
                  "flex items-baseline gap-5 py-4 transition-[opacity,transform] duration-700",
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              >
                <span className="label tabular text-signal">{item.index}</span>
                <span className="display text-5xl text-bone">{t.nav[item.key]}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
