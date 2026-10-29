import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isWebGL2Supported(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    return gl !== null;
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false;
  const connection = (navigator as unknown as { connection?: { effectiveType?: string } }).connection;
  if (connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g") {
    return true;
  }
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    return true;
  }
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  if (memory && memory <= 2) {
    return true;
  }
  return false;
}

export function canRenderOcean(): boolean {
  return isWebGL2Supported() && !prefersReducedMotion() && !isLowEndDevice();
}
