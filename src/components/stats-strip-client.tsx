// src/components/stats-strip-client.tsx
"use client";

import { useEffect, useRef, useState } from "react";

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

function CountUp({ to, suffix = "", format, active }: {
  to: number; suffix?: string; format?: (n: number) => string; active: boolean;
}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setValue(to); return; }
    const duration = 900;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [active, to]);
  return <>{format ? format(value) : value}{suffix}</>;
}

export function StatsStripClient({ circleCount }: { circleCount: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const stats = [
    { value: null as number | null, suffix: "", label: "type accuracy", detail: "validated against retake results" },
    { value: circleCount, suffix: "+", label: "active circles", detail: "small groups matched by type", format: (n: number) => n.toLocaleString() },
    { value: null as number | null, suffix: "", label: "avg. time to results", detail: "from first question to type" },
  ];

  return (
    <div
      ref={ref}
      className="grid grid-cols-3 divide-x divide-[var(--color-ink)]/10 border-y border-[var(--color-ink)]/10 overflow-x-auto"
    >
      {stats.map((stat) => (
        <div key={stat.label} className="px-5 py-8 sm:px-8 sm:py-10 min-w-[120px]">
          <span className="block text-xs sm:text-sm font-medium text-[var(--color-ink)]/45 mb-3">
            {stat.label}
          </span>
          <div className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-[var(--color-accent)] tabular-nums">
            {stat.value === null ? "?" : <CountUp to={stat.value} suffix={stat.suffix} format={stat.format} active={inView} />}
          </div>
          <p className="mt-2 text-xs sm:text-sm text-[var(--color-ink)]/50 leading-snug">
            {stat.detail}
          </p>
        </div>
      ))}
    </div>
  );
}
