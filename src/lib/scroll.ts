import type Lenis from "lenis";

let instance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) instance.scrollTo(el, { offset: id === "top" ? 0 : -8, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}
