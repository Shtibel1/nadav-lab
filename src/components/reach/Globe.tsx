"use client";

import { useEffect, useRef } from "react";
import type { Arc, Globe as CobeGlobe, Marker } from "cobe";
import { origin, regions } from "@/content/data";
import { hasFastWebGL, prefersReducedMotion } from "@/lib/utils";

const RADIUS = 0.8;
const TAU = Math.PI * 2;
const SIGNAL: [number, number, number] = [1, 0.4, 0.16];
const DIM_ARC: [number, number, number] = [0.2, 0.26, 0.28];
const BONE: [number, number, number] = [0.86, 0.85, 0.8];

function toVec([lat, lng]: [number, number]): [number, number, number] {
  const r = (lat * Math.PI) / 180;
  const a = (lng * Math.PI) / 180 - Math.PI;
  const c = Math.cos(r);
  return [-c * Math.cos(a), Math.sin(r), c * Math.sin(a)];
}

function project(v: [number, number, number], phi: number, theta: number, lift = 0.02) {
  const r = RADIUS + lift;
  const [x, y, z] = [v[0] * r, v[1] * r, v[2] * r];
  const cp = Math.cos(phi), sp = Math.sin(phi), ct = Math.cos(theta), st = Math.sin(theta);
  const c = cp * x + sp * z;
  const s = sp * st * x + ct * y - cp * st * z;
  const depth = -sp * ct * x + st * y + cp * ct * z;
  return { x: (c + 1) / 2, y: (-s + 1) / 2, front: depth >= 0 };
}

function slerp(a: number[], b: number[], t: number): [number, number, number] {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  const so = Math.sin(omega) || 1;
  const ka = Math.sin((1 - t) * omega) / so;
  const kb = Math.sin(t * omega) / so;
  return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb];
}

function svgPath(points: [number, number, number][], phi: number, theta: number, lift: (t: number) => number) {
  let d = "";
  let pen = false;
  points.forEach((v, i) => {
    const p = project(v, phi, theta, lift(i / (points.length - 1)));
    if (!p.front) {
      pen = false;
      return;
    }
    d += `${pen ? "L" : "M"}${(p.x * 100).toFixed(2)} ${(p.y * 100).toFixed(2)}`;
    pen = true;
  });
  return d;
}

const GRATICULE: [number, number, number][][] = [
  ...Array.from({ length: 12 }, (_, m) =>
    Array.from({ length: 37 }, (_, i) => toVec([-90 + i * 5, -180 + m * 30])),
  ),
  ...[-60, -30, 0, 30, 60].map((lat) => Array.from({ length: 73 }, (_, i) => toVec([lat, -180 + i * 5]))),
];

function anglesFor([lat, lng]: [number, number]) {
  return { phi: (3 * Math.PI) / 2 - (lng * Math.PI) / 180, theta: (lat * Math.PI) / 180 };
}

function midpoint(a: [number, number], b: [number, number]): [number, number] {
  const va = toVec(a), vb = toVec(b);
  const m = [va[0] + vb[0], va[1] + vb[1], va[2] + vb[2]];
  const len = Math.hypot(m[0], m[1], m[2]) || 1;
  const lat = (Math.asin(m[1] / len) * 180) / Math.PI;
  const lng = (Math.atan2(m[2], -m[0]) * 180) / Math.PI + 180;
  return [lat, ((lng + 540) % 360) - 180];
}

function wrap(a: number) {
  return ((((a + Math.PI) % TAU) + TAU) % TAU) - Math.PI;
}

function formatLatLng(phi: number, theta: number) {
  const lat = (theta * 180) / Math.PI;
  let lng = ((3 * Math.PI) / 2 - phi) * (180 / Math.PI);
  lng = ((((lng + 180) % 360) + 360) % 360) - 180;
  const f = (n: number, w: number) => Math.abs(n).toFixed(2).padStart(w, "0");
  return `LAT ${f(lat, 5)}°${lat >= 0 ? "N" : "S"}   LON ${f(lng, 6)}°${lng >= 0 ? "E" : "W"}`;
}

interface Props {
  active: number;
  labels: { origin: string; region: string; code: string };
  onInteract: () => void;
}

export default function Globe({ active, labels, onInteract }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bezelRef = useRef<SVGGElement>(null);
  const originRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const gridRef = useRef<SVGPathElement>(null);
  const arcsRef = useRef<SVGPathElement>(null);
  const activeArcRef = useRef<SVGPathElement>(null);
  const activeRef = useRef(active);
  const globeRef = useRef<CobeGlobe | null>(null);
  const interactRef = useRef(onInteract);

  useEffect(() => {
    interactRef.current = onInteract;
  }, [onInteract]);

  useEffect(() => {
    activeRef.current = active;
    globeRef.current?.update({ arcs: buildArcs(active), markers: buildMarkers(active) });
  }, [active]);

  useEffect(() => {
    const wrapEl = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrapEl || !canvas) return;

    const reduced = prefersReducedMotion();
    let disposed = false;
    let raf = 0;
    let visible = false;
    let size = wrapEl.offsetWidth;
    const start = anglesFor(midpoint(origin.coords, regions[activeRef.current].coords));
    const view = { phi: start.phi, theta: start.theta, vPhi: 0, vTheta: 0 };
    const drag = { on: false, x: 0, y: 0, last: 0, idleUntil: 0 };

    const place = (el: HTMLElement | null, coords: [number, number]) => {
      if (!el) return;
      const p = project(toVec(coords), view.phi, view.theta);
      el.style.transform = `translate3d(${(p.x * size).toFixed(1)}px, ${(p.y * size).toFixed(1)}px, 0)`;
      el.style.opacity = p.front ? "1" : "0";
      const tag = el.querySelector<HTMLElement>(".gl-text");
      const room = size - p.x * size - (tag ? tag.offsetWidth + 28 : 0);
      if (room < 0) el.dataset.flip = "";
      else if (room > 24) delete el.dataset.flip;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - (drag.last || now)) / 1000) || 1 / 60;
      drag.last = now;

      if (!drag.on) {
        if (now < drag.idleUntil) {
          view.phi += view.vPhi * dt;
          view.theta += view.vTheta * dt;
          const decay = Math.exp(-dt * 3.2);
          view.vPhi *= decay;
          view.vTheta *= decay;
        } else {
          const target = anglesFor(midpoint(origin.coords, regions[activeRef.current].coords));
          const k = reduced ? 1 : 1 - Math.exp(-dt * 2.2);
          view.phi += wrap(target.phi - view.phi) * k;
          view.theta += (target.theta * 0.7 - view.theta) * k;
        }
      }
      view.theta = Math.max(-0.6, Math.min(0.9, view.theta));

      globeRef.current?.update({ phi: view.phi, theta: view.theta });
      place(originRef.current, origin.coords);
      place(targetRef.current, regions[activeRef.current].coords);
      if (bezelRef.current) bezelRef.current.setAttribute("transform", `rotate(${((-view.phi * 180) / Math.PI).toFixed(2)} 50 50)`);
      if (readoutRef.current) readoutRef.current.textContent = formatLatLng(view.phi, view.theta);
      if (fallback) drawFallback();
    };

    const drawFallback = () => {
      const flat = () => 0.004;
      gridRef.current?.setAttribute("d", GRATICULE.map((line) => svgPath(line, view.phi, view.theta, flat)).join(""));
      const from = toVec(origin.coords);
      const arcs = regions.map((r) => {
        const to = toVec(r.coords);
        const pts = Array.from({ length: 33 }, (_, i) => slerp(from, to, i / 32));
        return svgPath(pts, view.phi, view.theta, (t) => Math.sin(Math.PI * t) * 0.12);
      });
      const a = activeRef.current;
      arcsRef.current?.setAttribute("d", arcs.filter((_, i) => i !== a).join(""));
      activeArcRef.current?.setAttribute("d", arcs[a]);
    };

    const run = () => {
      cancelAnimationFrame(raf);
      if (visible && !disposed) raf = requestAnimationFrame(frame);
    };

    const fallback = !hasFastWebGL();
    if (fallback) wrapEl.dataset.fallback = "";

    const init = async () => {
      if (fallback) {
        globeRef.current = { update: () => {}, destroy: () => {} };
        run();
        return;
      }
      const { default: createGlobe } = await import("cobe");
      if (disposed) return;
      globeRef.current = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: size,
        height: size,
        phi: view.phi,
        theta: view.theta,
        dark: 1,
        diffuse: 1.15,
        mapSamples: 22000,
        mapBrightness: 5.2,
        mapBaseBrightness: 0.02,
        baseColor: [0.12, 0.155, 0.165],
        markerColor: SIGNAL,
        glowColor: [0.07, 0.1, 0.105],
        arcColor: SIGNAL,
        arcWidth: 0.55,
        arcHeight: 0.22,
        markerElevation: 0.015,
        markers: buildMarkers(activeRef.current),
        arcs: buildArcs(activeRef.current),
      });
      wrapEl.dataset.ready = "";
      run();
    };

    const onDown = (e: PointerEvent) => {
      drag.on = true;
      drag.x = e.clientX;
      drag.y = e.clientY;
      view.vPhi = 0;
      view.vTheta = 0;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
      interactRef.current();
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.on) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.x = e.clientX;
      drag.y = e.clientY;
      const k = 3.2 / size;
      view.phi += dx * k;
      view.theta += dy * k;
      view.vPhi = (dx * k) / (1 / 60);
      view.vTheta = (dy * k) / (1 / 60);
    };
    const onUp = (e: PointerEvent) => {
      if (!drag.on) return;
      drag.on = false;
      drag.idleUntil = performance.now() + 5000;
      canvas.style.cursor = "";
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !globeRef.current) init();
        else run();
      },
      { rootMargin: "200px" },
    );
    const ro = new ResizeObserver(() => {
      size = wrapEl.offsetWidth;
      globeRef.current?.update({ width: size, height: size });
    });

    io.observe(wrapEl);
    ro.observe(wrapEl);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      globeRef.current?.destroy();
      globeRef.current = null;
    };
  }, []);

  return (
    <div ref={wrapRef} className="globe group relative aspect-square w-full select-none">
      <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="globe-halo" cx="50%" cy="50%" r="50%">
            <stop offset="76%" stopColor="#8fd3cc" stopOpacity="0.08" />
            <stop offset="86%" stopColor="#8fd3cc" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#8fd3cc" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#globe-halo)" />
        <circle cx="50" cy="50" r="46.5" fill="none" stroke="rgb(214 226 230 / 0.12)" strokeWidth="0.15" />
        <circle cx="50" cy="50" r="49.5" fill="none" stroke="rgb(214 226 230 / 0.07)" strokeWidth="0.15" />
        <g ref={bezelRef}>
          {Array.from({ length: 72 }, (_, i) => {
            const a = (i / 72) * TAU;
            const long = i % 6 === 0;
            const r1 = 46.5;
            const r2 = long ? 48.6 : 47.5;
            return (
              <line
                key={i}
                x1={50 + Math.cos(a) * r1}
                y1={50 + Math.sin(a) * r1}
                x2={50 + Math.cos(a) * r2}
                y2={50 + Math.sin(a) * r2}
                stroke={i === 0 ? "#ff6224" : "rgb(214 226 230 / 0.35)"}
                strokeWidth={i === 0 ? 0.45 : 0.18}
              />
            );
          })}
        </g>
        <path d="M50 1.2v2.6M50 96.2v2.6M1.2 50h2.6M96.2 50h2.6" stroke="rgb(235 231 222 / 0.5)" strokeWidth="0.2" />
        <g className="hidden group-data-[fallback]:inline">
          <circle cx="50" cy="50" r="40" fill="#0b1214" stroke="rgb(214 226 230 / 0.18)" strokeWidth="0.2" />
          <path ref={gridRef} fill="none" stroke="rgb(214 226 230 / 0.13)" strokeWidth="0.15" />
          <path ref={arcsRef} fill="none" stroke="rgb(143 160 165 / 0.45)" strokeWidth="0.2" />
          <path ref={activeArcRef} fill="none" stroke="#ff6224" strokeWidth="0.35" />
        </g>
      </svg>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-grab touch-pan-y opacity-0 transition-opacity duration-1000 group-data-[ready]:opacity-100"
        style={{ contain: "layout paint size" }}
      />

      <div className="pointer-events-none absolute inset-0" dir="ltr">
        <div ref={originRef} className="absolute left-0 top-0 transition-opacity duration-300">
          <span className="absolute -left-[7px] -top-[7px] h-[14px] w-[14px] rounded-full border border-signal/80" />
          <span className="gl-text label absolute left-3 top-2 whitespace-nowrap bg-ink/70 px-1.5 py-0.5 text-[0.625rem] text-signal backdrop-blur-sm">{labels.origin}</span>
        </div>
        <div ref={targetRef} className="absolute left-0 top-0 transition-opacity duration-300">
          <span className="absolute -left-[5px] -top-[5px] h-[10px] w-[10px] border border-bone/80" />
          <span className="gl-lead absolute left-[6px] top-[-28px] h-[22px] w-px origin-bottom rotate-[35deg] bg-bone/40" />
          <span className="gl-text gl-text-far label absolute left-[20px] top-[-42px] whitespace-nowrap bg-ink/70 px-2 py-1 text-[0.625rem] text-bone backdrop-blur-sm">
            {labels.code}
            <span className="ms-2 text-fog">{labels.region}</span>
          </span>
        </div>
      </div>

      <div className="label pointer-events-none absolute inset-x-0 bottom-0 flex justify-center text-[0.625rem] text-fog" dir="ltr">
        <span ref={readoutRef} className="tabular whitespace-pre" />
      </div>
    </div>
  );
}

function buildArcs(active: number): Arc[] {
  return regions.map((r, i) => ({
    from: origin.coords,
    to: r.coords,
    color: i === active ? SIGNAL : DIM_ARC,
  }));
}

function buildMarkers(active: number): Marker[] {
  return [
    { location: origin.coords, size: 0.06, color: SIGNAL },
    ...regions.map((r, i) => ({
      location: r.coords,
      size: i === active ? 0.045 : 0.028,
      color: i === active ? SIGNAL : BONE,
    })),
  ];
}
