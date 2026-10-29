"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ScrambleTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export function ScrambleText({
  text,
  className,
  speed = 50,
  delay = 0,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const completionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const revealedRef = useRef(0);
  
  const getScrambleChar = useCallback((originalChar: string) => {
    if (originalChar === " ") return " ";
    const hebrewChars = "אבגדהוזחטיכלמנסעפצקרשת";
    const latinChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const isHebrew = /[\u0590-\u05FF]/.test(originalChar);
    const chars = isHebrew ? hebrewChars : latinChars;
    return chars[Math.floor(Math.random() * chars.length)];
  }, []);

  useEffect(() => {
    revealedRef.current = 0;
    setIsComplete(false);
    setDisplayText(text);
    
    const startScramble = () => {
      intervalRef.current = setInterval(() => {
        revealedRef.current += 0.5;
        const revealed = Math.floor(revealedRef.current);
        
        if (revealed >= text.length) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setDisplayText(text);
          setIsComplete(true);
          return;
        }
        
        const newText = text
          .split("")
          .map((char, index) => {
            if (index < revealed) return text[index];
            if (char === " ") return " ";
            return getScrambleChar(char);
          })
          .join("");
        
        setDisplayText(newText);
      }, speed);
    };
    
    const timeoutId = setTimeout(startScramble, delay);
    
    const maxDuration = delay + (text.length * speed * 3) + 500;
    completionTimeoutRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDisplayText(text);
      setIsComplete(true);
    }, maxDuration);

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
    };
  }, [text, speed, delay, getScrambleChar]);

  return (
    <span className={cn("inline-block", className)}>
      {isComplete ? text : displayText}
    </span>
  );
}
