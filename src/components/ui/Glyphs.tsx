import { cn } from "@/lib/utils";

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cn("h-3.5 w-3.5", className)} aria-hidden="true">
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cn("h-3.5 w-3.5", className)} aria-hidden="true">
      <path d="M8 2.5v11M3.5 9 8 13.5 12.5 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowInline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cn("h-3.5 w-3.5 rtl:-scale-x-100", className)} aria-hidden="true">
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
    </svg>
  );
}
