"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface OceanFallbackProps {
  className?: string;
}

export default function OceanFallback({ className }: OceanFallbackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawStaticOcean();
    };

    const drawStaticOcean = () => {
      const width = canvas.width;
      const height = canvas.height;

      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, "#0a1628");
      skyGradient.addColorStop(0.25, "#1a3a5c");
      skyGradient.addColorStop(0.45, "#2a5a8c");
      skyGradient.addColorStop(0.55, "#f5a623");
      skyGradient.addColorStop(0.7, "#ff6b35");
      skyGradient.addColorStop(1, "#ff8844");

      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      const sunX = width * 0.5;
      const sunY = height * 0.42;
      const sunRadius = Math.min(width, height) * 0.06;

      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 4);
      sunGlow.addColorStop(0, "rgba(255, 228, 181, 0.8)");
      sunGlow.addColorStop(0.3, "rgba(255, 214, 153, 0.4)");
      sunGlow.addColorStop(0.6, "rgba(255, 180, 100, 0.1)");
      sunGlow.addColorStop(1, "transparent");

      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 4, 0, Math.PI * 2);
      ctx.fill();

      const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
      sunGradient.addColorStop(0, "#fffaf0");
      sunGradient.addColorStop(0.5, "#ffe4b5");
      sunGradient.addColorStop(1, "#ffd699");

      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      const horizonY = height * 0.55;
      const waterGradient = ctx.createLinearGradient(0, horizonY, 0, height);
      waterGradient.addColorStop(0, "#2a5a8c");
      waterGradient.addColorStop(0.3, "#1a3a5c");
      waterGradient.addColorStop(1, "#0a1628");

      ctx.fillStyle = waterGradient;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      const reflectionGradient = ctx.createLinearGradient(sunX - sunRadius * 2, horizonY, sunX + sunRadius * 2, horizonY);
      reflectionGradient.addColorStop(0, "transparent");
      reflectionGradient.addColorStop(0.3, "rgba(255, 214, 153, 0.15)");
      reflectionGradient.addColorStop(0.5, "rgba(255, 214, 153, 0.3)");
      reflectionGradient.addColorStop(0.7, "rgba(255, 214, 153, 0.15)");
      reflectionGradient.addColorStop(1, "transparent");

      ctx.fillStyle = reflectionGradient;
      ctx.beginPath();
      ctx.moveTo(sunX - sunRadius * 3, horizonY);
      ctx.lineTo(sunX + sunRadius * 3, horizonY);
      ctx.lineTo(sunX + sunRadius * 0.5, height);
      ctx.lineTo(sunX - sunRadius * 0.5, height);
      ctx.closePath();
      ctx.fill();

      for (let i = 0; i < 8; i++) {
        const waveY = horizonY + (height - horizonY) * (i / 8);
        const alpha = 0.05 - i * 0.005;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let x = 0; x <= width; x += 5) {
          const y = waveY + Math.sin(x * 0.02 + i) * 3;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full", className)}
      aria-hidden="true"
    />
  );
}
