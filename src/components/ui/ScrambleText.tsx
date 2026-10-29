"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrambleTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  scrambleChars?: string;
}

export function ScrambleText({
  text,
  className,
  speed = 50,
  delay = 0,
  scrambleChars = "אבגדהוזחטיכלמנסעפצקרשתABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let iteration = 0;
      const maxIterations = text.length;

      intervalRef.current = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              if (char === " ") return " ";
              return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            })
            .join("")
        );

        if (iteration >= maxIterations) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setDisplayText(text);
        }

        iteration += 1 / 3;
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, speed, delay, scrambleChars]);

  return (
    <span className={cn("inline-block", className)} aria-label={text}>
      {displayText}
    </span>
  );
}
