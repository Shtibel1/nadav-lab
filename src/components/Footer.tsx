"use client";

import { useLocale } from "@/i18n/LocaleContext";
import { scrollToId } from "@/lib/scroll";
import { LocalTime } from "@/components/ui/LocalTime";

export default function Footer() {
  const { t } = useLocale();
  return (
    <footer className="relative">
      <div className="shell">
        <div
          className="display select-none overflow-hidden whitespace-nowrap border-t border-line pt-10 text-center text-[clamp(3.5rem,15.5vw,16.5rem)] leading-[0.8] text-bone/[0.07]"
          aria-hidden="true"
          dir="ltr"
        >
          Nadav Shtibel
        </div>
        <div className="label flex flex-col gap-4 border-t border-line py-7 text-fog md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} Nadav Shtibel · {t.footer.rights}
          </span>
          <span className="flex items-center gap-2" dir="ltr">
            lab.nadav-shtibel.com
          </span>
          <span className="flex items-center gap-2">
            {t.footer.city}
            <span className="text-mist" dir="ltr">
              <LocalTime seconds={false} />
            </span>
          </span>
          <button type="button" onClick={() => scrollToId("top")} className="u-link self-start pb-0.5 text-mist hover:text-bone md:self-auto">
            {t.footer.top}
          </button>
        </div>
      </div>
    </footer>
  );
}
