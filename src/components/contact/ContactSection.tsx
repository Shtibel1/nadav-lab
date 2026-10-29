"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/i18n/LocaleContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function ContactSection() {
  const { t, dir } = useLocale();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const subject = `Portfolio Contact from ${formData.name}`;
    const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
    
    window.location.href = `mailto:nadavshtibel@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
  };

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const inputClasses = cn(
    "w-full px-4 py-3 rounded-xl",
    "bg-surface-elevated border border-border",
    "text-foreground placeholder:text-text-muted",
    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
    "transition-all duration-200",
    dir === "rtl" && "text-right"
  );

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8" id="contact">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className={cn("text-center mb-12", dir === "rtl" && "font-hebrew")}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            {t.contact.title}
          </h2>
          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto">
            {t.contact.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute -inset-4 bg-accent/5 blur-3xl rounded-3xl" />

          <div className="relative glass rounded-2xl p-8 sm:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-accent"
                >
                  <path d="M12 8V4H8" />
                  <rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2" />
                  <path d="M20 14h2" />
                  <path d="M15 13v2" />
                  <path d="M9 13v2" />
                </svg>
              </div>
              <div>
                <h3 className={cn("text-xl font-bold", dir === "rtl" && "font-hebrew")}>
                  {t.contact.askAgent}
                </h3>
                <p className="text-sm text-text-muted">nadavshtibel@gmail.com</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="sr-only">{t.contact.namePlaceholder}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder={t.contact.namePlaceholder}
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">{t.contact.emailPlaceholder}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={t.contact.emailPlaceholder}
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="sr-only">{t.contact.messagePlaceholder}</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder={t.contact.messagePlaceholder}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={cn(inputClasses, "resize-none")}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t.contact.sending}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t.contact.send}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={dir === "rtl" ? "rotate-180" : ""}
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="https://github.com/Shtibel1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-text-muted hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </a>

                <a
                  href="mailto:nadavshtibel@gmail.com"
                  className="flex items-center gap-2 text-text-muted hover:text-foreground transition-colors"
                >
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
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-1/3 -left-32 w-64 h-64 bg-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
