import { cn } from "@/lib/utils";

interface Props {
  index: string;
  label: string;
  title: readonly string[];
  intro?: string;
  className?: string;
}

export function SectionHeader({ index, label, title, intro, className }: Props) {
  return (
    <header className={cn("grid grid-cols-12 gap-x-6 gap-y-8", className)}>
      <div className="col-span-12 flex items-center gap-4 text-mist" data-reveal>
        <span className="label tabular text-signal">{index}</span>
        <span className="h-px w-10 bg-line-strong" />
        <span className="label">{label}</span>
      </div>
      <h2
        className="display col-span-12 text-[clamp(2.75rem,7.2vw,6.75rem)] text-bone lg:col-span-8"
        data-reveal="lines"
      >
        {title.map((line, i) => (
          <span className="line-mask" key={i}>
            <span style={{ "--i": i } as React.CSSProperties}>{line}</span>
          </span>
        ))}
      </h2>
      {intro && (
        <p
          className="col-span-12 max-w-md self-end text-[1.0625rem] leading-relaxed text-mist lg:col-span-4"
          data-reveal
          style={{ "--d": "200ms" } as React.CSSProperties}
        >
          {intro}
        </p>
      )}
    </header>
  );
}
