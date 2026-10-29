"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import createGlobe from "cobe";
import { useLocale } from "@/i18n/LocaleContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

const ISRAEL_COORDS: [number, number] = [31.0461, 34.8516];

const AWS_REGIONS: { name: string; coords: [number, number]; region: string }[] = [
  { name: "Ireland", coords: [53.1424, -7.6921], region: "eu-west-1" },
  { name: "Frankfurt", coords: [50.1109, 8.6821], region: "eu-central-1" },
  { name: "London", coords: [51.5074, -0.1278], region: "eu-west-2" },
  { name: "Virginia", coords: [37.4316, -78.6569], region: "us-east-1" },
  { name: "Oregon", coords: [43.8041, -120.5542], region: "us-west-2" },
  { name: "Singapore", coords: [1.3521, 103.8198], region: "ap-southeast-1" },
  { name: "Tokyo", coords: [35.6762, 139.6503], region: "ap-northeast-1" },
  { name: "Mumbai", coords: [19.076, 72.8777], region: "ap-south-1" },
];

function coordsToAngles(lat: number, lng: number): [number, number] {
  return [
    Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2),
    (lat * Math.PI) / 180,
  ];
}

export default function GlobeSection() {
  const { t, dir } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const { ref: sectionRef, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.2,
  });

  const markers = useMemo(() => [
    { location: ISRAEL_COORDS, size: 0.1 },
    ...AWS_REGIONS.map((r) => ({ location: r.coords, size: 0.05 })),
  ], []);

  useEffect(() => {
    if (!canvasRef.current || !isVisible) return;

    const canvas = canvasRef.current;
    let width = canvas.offsetWidth || 400;
    
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth || 400;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const [focusPhi, focusTheta] = coordsToAngles(ISRAEL_COORDS[0], ISRAEL_COORDS[1]);

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(2, window.devicePixelRatio || 1),
      width: width * 2,
      height: width * 2,
      phi: focusPhi,
      theta: focusTheta - 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 12,
      baseColor: [0.2, 0.2, 0.3],
      markerColor: [1, 0.8, 0.2],
      glowColor: [0.3, 0.4, 0.8],
      markers,
      onRender: (state: { phi: number; width: number; height: number }) => {
        if (!pointerInteracting.current) {
          phiRef.current += 0.003;
        }
        state.phi = focusPhi + phiRef.current + pointerInteractionMovement.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    } as Parameters<typeof createGlobe>[1]);

    const handlePointerDown = (e: PointerEvent) => {
      pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grabbing";
      }
    };

    const handlePointerUp = () => {
      pointerInteracting.current = null;
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grab";
      }
    };

    const handlePointerOut = () => {
      pointerInteracting.current = null;
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grab";
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        const delta = e.clientX - pointerInteracting.current;
        pointerInteractionMovement.current = delta / 200;
      }
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointerout", handlePointerOut);
    canvas.addEventListener("pointermove", handlePointerMove);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointerout", handlePointerOut);
      canvas.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isVisible, markers]);

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden noise-bg"
      id="globe"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className={cn("text-center mb-12", dir === "rtl" && "font-hebrew")}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            {t.globe.title}
          </h2>
          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto">
            {t.globe.subtitle}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="relative w-full max-w-md aspect-square mx-auto lg:mx-0 flex-shrink-0"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="absolute inset-4 bg-accent/20 blur-3xl rounded-full" />
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-grab relative z-10"
              style={{ 
                contain: "layout paint size",
                width: "100%",
                height: "100%",
              }}
            />
          </motion.div>

          <div
            className="w-full lg:w-auto lg:flex-1"
          >
            <div className="grid grid-cols-2 gap-3">
              {AWS_REGIONS.map((region, index) => (
                <motion.div
                  key={region.region}
                  className="glass rounded-lg p-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent pulse-glow" />
                    <div>
                      <div className="text-sm font-medium text-foreground">{region.name}</div>
                      <div className="text-xs text-text-muted font-mono">{region.region}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="glass rounded-lg p-4 mt-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-gold" />
                <span className={cn("font-medium", dir === "rtl" && "font-hebrew")}>
                  {dir === "rtl" ? "מיקום מרכזי: ישראל" : "Central Location: Israel"}
                </span>
              </div>
              <p className={cn("text-sm text-text-muted", dir === "rtl" && "font-hebrew")}>
                {dir === "rtl" 
                  ? "כל השירותים פרוסים מישראל לאזורי AWS ברחבי העולם"
                  : "All services deployed from Israel to AWS regions worldwide"
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
    </section>
  );
}
