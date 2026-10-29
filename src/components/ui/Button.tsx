"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-accent text-white hover:bg-accent/90 active:scale-[0.98]":
              variant === "primary",
            "bg-surface-elevated text-foreground hover:bg-surface-elevated/80":
              variant === "secondary",
            "bg-transparent text-foreground hover:bg-surface":
              variant === "ghost",
            "border border-border bg-transparent text-foreground hover:bg-surface hover:border-text-muted":
              variant === "outline",
            "px-3 py-1.5 text-sm rounded-md": size === "sm",
            "px-4 py-2 text-base rounded-lg": size === "md",
            "px-6 py-3 text-lg rounded-xl": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
