"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { ArrowInline, ArrowUpRight } from "@/components/ui/Glyphs";
import { SectionHeader } from "@/components/ui/SectionHeader";

const EMAIL = "nadavshtibel@gmail.com";

export default function Contact() {
  const { t } = useLocale();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const subject = `Hello from ${form.name}`;
    const body = `${form.message}\n\n— ${form.name} <${form.email}>`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.setTimeout(() => setSending(false), 1500);
  };

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line pb-16 pt-28 md:pt-40">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(60%_70%_at_50%_100%,rgb(255_98_36/0.08),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="shell relative">
        <SectionHeader index={t.contact.index} label={t.contact.label} title={t.contact.title} intro={t.contact.intro} />

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-16 md:mt-24">
          <div className="col-span-12 lg:col-span-6" data-reveal>
            <p className="label text-fog">{t.contact.direct}</p>
            <a
              href={`mailto:${EMAIL}`}
              className="group mt-5 inline-flex items-center gap-4 text-bone transition-colors duration-500 hover:text-signal"
              dir="ltr"
            >
              <span className="display u-link text-[clamp(1.85rem,4.4vw,3.6rem)] leading-[1.1]">{EMAIL}</span>
              <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform duration-700 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
              <a
                href="https://github.com/Shtibel1"
                target="_blank"
                rel="noopener noreferrer"
                className="label u-link pb-1 text-mist hover:text-bone"
              >
                GitHub — Shtibel1
              </a>
              <span className="label text-fog">{t.contact.based}</span>
            </div>
          </div>

          <form onSubmit={submit} className="col-span-12 grid gap-8 lg:col-span-5 lg:col-start-8" data-reveal style={{ "--d": "120ms" } as React.CSSProperties}>
            <div className="grid gap-8 sm:grid-cols-2">
              <label className="block">
                <span className="label text-fog">{t.contact.name}</span>
                <input
                  className="field"
                  name="name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="label text-fog">{t.contact.email}</span>
                <input
                  className="field"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
            </div>
            <label className="block">
              <span className="label text-fog">{t.contact.message}</span>
              <textarea
                className="field resize-none"
                name="message"
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </label>
            <button
              type="submit"
              disabled={sending}
              className="group inline-flex items-center justify-between gap-6 bg-bone px-6 py-4 text-sm font-medium text-ink transition-colors duration-500 hover:bg-signal disabled:opacity-70 sm:justify-self-start"
            >
              {sending ? t.contact.sending : t.contact.send}
              <ArrowInline className="transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
