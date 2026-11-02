"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Jerusalem",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export function LocalTime({ seconds = true }: { seconds?: boolean }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const s = formatter.format(new Date());
      setNow(seconds ? s : s.slice(0, 5));
    };
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [seconds]);

  return (
    <time className="tabular" suppressHydrationWarning>
      {now ?? (seconds ? "--:--:--" : "--:--")}
    </time>
  );
}
