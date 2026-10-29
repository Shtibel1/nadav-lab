"use client";

import { useLocale } from "@/i18n/LocaleContext";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === "he" ? "en" : "he")}
      className={cn(
        "glass rounded-full px-3 py-1.5 text-sm font-medium",
        "hover:bg-surface-elevated transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      )}
      aria-label={locale === "he" ? "Switch to English" : "החלף לעברית"}
    >
      {locale === "he" ? "EN" : "עב"}
    </button>
  );
}
