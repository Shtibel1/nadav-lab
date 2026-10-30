"use client";

import { stack } from "@/content/data";
import { useLocale } from "@/i18n/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";

const offsets = stack.map((_, gi) => stack.slice(0, gi).reduce((sum, g) => sum + g.items.length, 0));

export default function Stack() {
  const { t, locale } = useLocale();

  return (
    <section id="stack" className="relative border-t border-line py-28 md:py-40">
      <div className="shell">
        <SectionHeader index={t.stack.index} label={t.stack.label} title={t.stack.title} intro={t.stack.intro} />

        <div className="mt-16 border-t border-line-strong md:mt-24">
          {stack.map((group, gi) => (
            <div key={group.id} className="grid grid-cols-12 gap-x-6 border-b border-line" data-reveal style={{ "--d": `${gi * 60}ms` } as React.CSSProperties}>
              <div className="col-span-12 flex items-center gap-3 pb-2 pt-6 md:col-span-3 md:items-start md:py-7">
                <span className="label tabular text-signal">{String.fromCharCode(65 + gi)}</span>
                <span className="label text-mist">{group.label[locale]}</span>
              </div>
              <ul className="col-span-12 md:col-span-9">
                {group.items.map((item, ii) => {
                  const n = offsets[gi] + ii + 1;
                  return (
                    <li
                      key={item.name}
                      className="spec-row grid grid-cols-[1fr_auto] items-baseline gap-x-6 border-line py-4 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_auto] md:py-6 [&:not(:last-child)]:border-b"
                    >
                      <span className="display text-[2rem] text-bone md:text-[2.75rem]" dir="ltr">
                        {item.name}
                      </span>
                      <span className="label tabular text-fog md:order-last">{String(n).padStart(2, "0")}</span>
                      <span className="col-span-2 mt-1 text-[0.975rem] text-mist md:col-span-1 md:mt-0">{item.note[locale]}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
