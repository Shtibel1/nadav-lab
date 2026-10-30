"use client";

import { useEffect, useRef } from "react";
import { detectRenderTier, prefersReducedMotion } from "@/lib/utils";
import { buildWaterFragment, WATER_VERTEX, type WaterQuality } from "./waterShader";

export type WaterStatus =
  | { mode: "off" }
  | { mode: "still" }
  | { mode: "live"; fps: number; scale: number; quality: WaterQuality };

interface Props {
  side: 1 | -1;
  onStatus?: (status: WaterStatus) => void;
}

const STILL_TIME = 14.5;
const SCALE_BOUNDS: Record<WaterQuality, [min: number, start: number, max: number]> = {
  full: [0.38, 0.72, 0.9],
  lite: [0.3, 0.5, 0.6],
};

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

export default function WaterCanvas({ side, onStatus }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sideRef = useRef<number>(side);
  const statusRef = useRef(onStatus);

  useEffect(() => {
    sideRef.current = side;
  }, [side]);

  useEffect(() => {
    statusRef.current = onStatus;
  }, [onStatus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const report = (s: WaterStatus) => statusRef.current?.(s);
    const tier = detectRenderTier();
    const still = prefersReducedMotion();
    if (tier === "none") {
      report({ mode: "off" });
      return;
    }
    const quality: WaterQuality = tier === "full" ? "full" : "lite";

    const attrs: WebGLContextAttributes = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    };
    const gl = (canvas.getContext("webgl2", attrs) ?? canvas.getContext("webgl", attrs)) as WebGLRenderingContext | null;
    if (!gl) {
      report({ mode: "off" });
      return;
    }

    let disposed = false;
    let raf = 0;
    let program: WebGLProgram | null = null;
    let uniforms: Record<string, WebGLUniformLocation | null> = {};
    const [minScale, startScale, maxScale] = SCALE_BOUNDS[quality];
    let scale = startScale;
    let visible = true;
    let pageVisible = document.visibilityState === "visible";
    let running = false;
    let simTime = STILL_TIME;
    let last = 0;
    let frames = 0;
    let frameAcc = 0;
    let lastReport = 0;
    let lastPointerMove = -1e9;
    const look = { x: 0, y: 0, tx: 0, ty: 0 };
    const scan = { x: 0.15, y: -0.25, s: 0, tx: 0.15, ty: -0.25, ts: 0 };
    let sideNow = sideRef.current;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (time: number) => {
      if (!program) return;
      gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);
      gl.uniform1f(uniforms.uTime, time);
      gl.uniform2f(uniforms.uLook, look.x, look.y);
      gl.uniform3f(uniforms.uScan, scan.x, scan.y, scan.s);
      gl.uniform1f(uniforms.uSide, sideNow);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const markReady = () => {
      canvas.dataset.ready = "";
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60;
      last = now;
      simTime += dt;

      const k = 1 - Math.exp(-dt * 2.4);
      if (now - lastPointerMove > 3500) {
        const t = simTime * 0.18;
        scan.tx = Math.sin(t) * 0.45 * (canvas.clientWidth / canvas.clientHeight) * 0.6;
        scan.ty = -0.22 + Math.sin(t * 1.7) * 0.06;
        scan.ts = quality === "full" ? 0.7 : 0.3;
        look.tx = Math.sin(t * 0.7) * 0.25;
        look.ty = 0;
      }
      look.x += (look.tx - look.x) * k;
      look.y += (look.ty - look.y) * k;
      scan.x += (scan.tx - scan.x) * k * 1.6;
      scan.y += (scan.ty - scan.y) * k * 1.6;
      scan.s += (scan.ts - scan.s) * k;
      sideNow += (sideRef.current - sideNow) * (1 - Math.exp(-dt * 1.5));

      draw(simTime);

      frames += 1;
      frameAcc += dt;
      if (frameAcc >= 1) {
        const avg = frameAcc / frames;
        let next = scale;
        if (avg > 1 / 40 && scale > minScale) next = Math.max(minScale, scale * 0.85);
        else if (avg < 1 / 57 && scale < maxScale) next = Math.min(maxScale, scale * 1.05);
        if (next !== scale) {
          scale = next;
          resize();
        }
        if (now - lastReport > 900) {
          lastReport = now;
          report({ mode: "live", fps: Math.round(frames / frameAcc), scale, quality });
        }
        frames = 0;
        frameAcc = 0;
      }
    };

    const start = () => {
      if (running || still || !program || disposed) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const sync = () => (visible && pageVisible ? start() : stop());

    const link = () => {
      const vs = compile(gl, gl.VERTEX_SHADER, WATER_VERTEX);
      const fs = compile(gl, gl.FRAGMENT_SHADER, buildWaterFragment(quality));
      const prog = gl.createProgram();
      if (!vs || !fs || !prog) return;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);

      const parallel = gl.getExtension("KHR_parallel_shader_compile");
      const finish = () => {
        if (disposed) return;
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          console.warn(gl.getShaderInfoLog(fs) ?? gl.getProgramInfoLog(prog));
          report({ mode: "off" });
          return;
        }
        program = prog;
        gl.useProgram(prog);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, "aPos");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        uniforms = Object.fromEntries(
          ["uRes", "uTime", "uLook", "uScan", "uSide"].map((n) => [n, gl.getUniformLocation(prog, n)]),
        );
        resize();
        if (still) {
          scan.s = 0;
          draw(STILL_TIME);
          report({ mode: "still" });
        } else {
          draw(simTime);
          sync();
        }
        requestAnimationFrame(markReady);
      };

      if (parallel) {
        const poll = () => {
          if (disposed) return;
          if (gl.getProgramParameter(prog, parallel.COMPLETION_STATUS_KHR)) finish();
          else setTimeout(poll, 50);
        };
        poll();
      } else {
        finish();
      }
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      if (e.clientY > rect.bottom) return;
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      look.tx = (nx - 0.5) * 2;
      look.ty = (0.5 - ny) * 2;
      scan.tx = (nx - 0.5) * (rect.width / rect.height);
      scan.ty = 0.5 - ny;
      scan.ts = 1;
      lastPointerMove = performance.now();
    };

    const onLeave = () => {
      scan.ts = 0;
    };

    const onVisibility = () => {
      pageVisible = document.visibilityState === "visible";
      sync();
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      stop();
      program = null;
      delete canvas.dataset.ready;
      report({ mode: "off" });
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    const ro = new ResizeObserver(() => {
      resize();
      if (still && program) draw(STILL_TIME);
    });

    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle ? window.requestIdleCallback(link, { timeout: 900 }) : window.setTimeout(link, 300);

    io.observe(canvas);
    ro.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("webglcontextlost", onContextLost);

    return () => {
      disposed = true;
      stop();
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      if (program) gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className="water-canvas absolute inset-0 h-full w-full" aria-hidden="true" />;
}
