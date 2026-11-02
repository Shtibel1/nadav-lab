import { memo } from "react";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 600;
const H = 300;
const LINES = 15;
const POINTS = 26;

function buildField(seed: number) {
  const rand = mulberry32(seed);
  const peaks = Array.from({ length: 3 }, () => ({
    x: 0.15 + rand() * 0.7,
    y: 0.2 + rand() * 0.6,
    r: 0.12 + rand() * 0.18,
    a: (rand() > 0.35 ? 1 : -1) * (26 + rand() * 40),
  }));
  const waves = Array.from({ length: 3 }, (_, i) => ({
    f: (1.2 + rand() * 2.4) * (i + 1),
    p: rand() * Math.PI * 2,
    a: (10 - i * 3) * (0.5 + rand()),
  }));

  const lines: string[] = [];
  for (let l = 0; l < LINES; l++) {
    const base = ((l + 1) / (LINES + 1)) * H;
    let d = "";
    for (let i = 0; i <= POINTS; i++) {
      const u = i / POINTS;
      const v = base / H;
      let y = base;
      for (const w of waves) y += Math.sin(u * w.f * Math.PI + w.p + v * 2.1) * w.a * 0.6;
      for (const pk of peaks) {
        const dx = (u - pk.x) / pk.r;
        const dy = (v - pk.y) / (pk.r * 1.6);
        y -= pk.a * Math.exp(-(dx * dx + dy * dy));
      }
      d += `${i ? "L" : "M"}${(u * W).toFixed(1)} ${y.toFixed(1)}`;
    }
    lines.push(d);
  }
  const trace = Math.floor(LINES * (0.35 + rand() * 0.3));
  const marks = peaks.map((p) => ({ x: p.x * W, y: p.y * H }));
  return { lines, trace, marks };
}

function SignatureImpl({ seed, className }: { seed: number; className?: string }) {
  const { lines, trace, marks } = buildField(seed);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      {[0, 1, 2].map((layer) => (
        <g key={layer} className="sig-layer" style={{ "--depth": layer - 1 } as React.CSSProperties}>
          {lines.map((d, i) =>
            i % 3 === layer && i !== trace ? (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="rgb(214 226 230)"
                strokeOpacity={0.09 + layer * 0.055}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ) : null,
          )}
        </g>
      ))}
      <path d={lines[trace]} fill="none" stroke="rgb(214 226 230)" strokeOpacity={0.25} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <path
        d={lines[trace]}
        pathLength={1}
        className="sig-trace"
        fill="none"
        stroke="#ff6224"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
      {marks.map((m, i) => (
        <g key={i} transform={`translate(${m.x.toFixed(1)} ${m.y.toFixed(1)})`} stroke="rgb(235 231 222)" strokeOpacity={0.5}>
          <path d="M-6 0H6M0 -6V6" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        </g>
      ))}
    </svg>
  );
}

export const Signature = memo(SignatureImpl);
