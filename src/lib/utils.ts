import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function allowSoftwareGL(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("force-gl");
}

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render|mesa offscreen/i;

export function isSoftwareRenderer(gl: WebGLRenderingContext): boolean {
  if (allowSoftwareGL()) return false;
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
  return SOFTWARE_RENDERER.test(renderer);
}

export function hasFastWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const attrs = { failIfMajorPerformanceCaveat: !allowSoftwareGL() };
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2", attrs) ?? c.getContext("webgl", attrs)) as WebGLRenderingContext | null;
    if (!gl) return false;
    const fast = !isSoftwareRenderer(gl);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return fast;
  } catch {
    return false;
  }
}

export type RenderTier = "none" | "lite" | "full";

export function detectRenderTier(): RenderTier {
  if (typeof window === "undefined") return "none";
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (nav.connection?.saveData || /(^|-)2g$/.test(nav.connection?.effectiveType ?? "")) return "none";
  if ((nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2) return "none";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 600;
  if (coarse || small || (nav.hardwareConcurrency ?? 8) <= 4) return "lite";
  return "full";
}

const EARTH_RADIUS_KM = 6371;
const FIBER_KM_PER_MS = 204.19;

export function greatCircleKm([lat1, lng1]: [number, number], [lat2, lng2]: [number, number]): number {
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLng = (lng2 - lng1) * toRad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

export function fiberRttMs(km: number): number {
  return (2 * km) / FIBER_KM_PER_MS;
}

export function formatNumber(n: number, locale: string) {
  return new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US", { maximumFractionDigits: 0 }).format(n);
}
