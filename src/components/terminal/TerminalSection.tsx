"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/i18n/LocaleContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

interface TerminalLine {
  type: "command" | "output" | "success" | "error" | "info";
  content: string;
  delay?: number;
}

const agentRuns: TerminalLine[][] = [
  [
    { type: "info", content: "🤖 AgentHub MCP Server v2.1.0" },
    { type: "command", content: "$ agent run invoice-processor --input scan.pdf", delay: 800 },
    { type: "output", content: "▸ Loading Hebrew OCR model...", delay: 400 },
    { type: "output", content: "▸ Extracting invoice data...", delay: 600 },
    { type: "output", content: "▸ Detected: ח.פ 514825370, סכום: ₪12,450.00", delay: 500 },
    { type: "output", content: "▸ Validating against schema...", delay: 300 },
    { type: "success", content: "✓ Invoice processed successfully", delay: 400 },
    { type: "output", content: "  → Saved to account-management/invoices/2024-01-inv-0847.json", delay: 200 },
  ],
  [
    { type: "info", content: "📱 WhatsApp Bot Gateway" },
    { type: "command", content: "$ bot listen --channel support", delay: 600 },
    { type: "output", content: "▸ Connected to WhatsApp Business API", delay: 400 },
    { type: "output", content: "▸ Incoming message from +972-50-***-1234", delay: 800 },
    { type: "output", content: '▸ User: "מה סטטוס ההזמנה שלי?"', delay: 500 },
    { type: "output", content: "▸ Querying order database...", delay: 400 },
    { type: "output", content: "▸ Generating Hebrew response...", delay: 300 },
    { type: "success", content: "✓ Response sent: Order #8472 shipped, arriving tomorrow", delay: 400 },
  ],
  [
    { type: "info", content: "🔄 CI/CD Pipeline - BlueApps" },
    { type: "command", content: "$ pipeline run --trigger push --branch main", delay: 500 },
    { type: "output", content: "▸ Installing dependencies...", delay: 600 },
    { type: "output", content: "▸ Running tests (47 specs)...", delay: 800 },
    { type: "success", content: "✓ All tests passed", delay: 400 },
    { type: "output", content: "▸ Building Docker image...", delay: 700 },
    { type: "output", content: "▸ Pushing to ECR eu-west-1...", delay: 500 },
    { type: "output", content: "▸ Deploying to ECS cluster...", delay: 600 },
    { type: "success", content: "✓ Deployment complete - v2.4.1 live", delay: 400 },
  ],
  [
    { type: "info", content: "🎯 Chess API Analysis Engine" },
    { type: "command", content: "$ chess analyze --fen 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R' --depth 20", delay: 700 },
    { type: "output", content: "▸ Initializing Stockfish engine...", delay: 400 },
    { type: "output", content: "▸ Position: Italian Game, Giuoco Piano", delay: 500 },
    { type: "output", content: "▸ Calculating best moves...", delay: 800 },
    { type: "output", content: "▸ Depth 20 reached: 1.2M nodes/sec", delay: 400 },
    { type: "success", content: "✓ Best move: d2d4 (eval: +0.42)", delay: 300 },
    { type: "output", content: "  → Top line: d4 exd4 e5 Ne4 O-O", delay: 200 },
  ],
];

function TerminalWindow({ lines, isActive }: { lines: TerminalLine[]; isActive: boolean }) {
  const [displayedLines, setDisplayedLines] = useState<TerminalLine[]>(lines);
  const [currentIndex, setCurrentIndex] = useState(lines.length);
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      setDisplayedLines(lines);
      setCurrentIndex(lines.length);
      return;
    }
    
    if (!isActive) {
      return;
    }

    if (currentIndex >= lines.length) {
      const resetTimeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentIndex(0);
      }, 4000);
      return () => clearTimeout(resetTimeout);
    }

    const currentLine = lines[currentIndex];
    const delay = currentLine.delay || 500;

    setIsTyping(true);
    timeoutRef.current = setTimeout(() => {
      setDisplayedLines((prev) => [...prev, currentLine]);
      setCurrentIndex((prev) => prev + 1);
      setIsTyping(false);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, lines, isActive]);

  return (
    <div className="glass rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-3 bg-surface-elevated border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-sm text-text-muted font-mono ml-2">agent-terminal</span>
      </div>

      <div className="p-4 font-mono text-sm min-h-[280px] overflow-hidden bg-[#0d0d14]">
        {displayedLines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "py-0.5",
              line.type === "command" && "text-accent",
              line.type === "output" && "text-text-muted",
              line.type === "success" && "text-green-400",
              line.type === "error" && "text-red-400",
              line.type === "info" && "text-gold"
            )}
          >
            {line.content}
          </motion.div>
        ))}
        {isTyping && (
          <span className="terminal-cursor" />
        )}
      </div>
    </div>
  );
}

export default function TerminalSection() {
  const { t, dir } = useLocale();
  const [activeRunIndex, setActiveRunIndex] = useState(0);
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.3,
  });

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveRunIndex((prev) => (prev + 1) % agentRuns.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 noise-bg"
      id="agents"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className={cn("text-center mb-16", dir === "rtl" && "font-hebrew")}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            {t.terminal.title}
          </h2>
          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto">
            {t.terminal.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-3xl" />
          
          <TerminalWindow
            lines={agentRuns[activeRunIndex]}
            isActive={isVisible}
          />

          <div className="flex justify-center gap-2 mt-6">
            {agentRuns.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveRunIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === activeRunIndex
                    ? "bg-accent w-6"
                    : "bg-border hover:bg-text-muted"
                )}
                aria-label={`Show agent run ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      </div>
    </section>
  );
}
