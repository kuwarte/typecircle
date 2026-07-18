// src/components/stats-strip.tsx
"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  {
    value: 94,
    suffix: "%",
    label: "type accuracy",
    detail: "validated against retake results",
  },
  {
    value: 3200,
    suffix: "+",
    label: "active circles",
    detail: "small groups matched by type",
    format: (n: number) => n.toLocaleString(),
  },
  {
    value: 8,
    suffix: " min",
    label: "avg. time to results",
    detail: "from first question to type",
  },
];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function CountUp({
  to,
  suffix = "",
  format,
  active,
}: {
  to: number;
  suffix?: string;
  format?: (n: number) => string;
  active: boolean;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(to);
      return;
    }
    const duration = 900;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(to * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [active, to]);

  return (
    <>
      {format ? format(value) : value}
      {suffix}
    </>
  );
}

export function StatsStrip() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-12">
      <div
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-ink)]/10 border-y border-[var(--color-ink)]/10"
      >
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="px-8 py-10 first:pt-0 sm:first:pt-10 sm:px-8"
          >
            <span className="block text-sm font-medium text-[var(--color-ink)]/45 mb-4">
              {stat.label}
            </span>
            <div className="font-heading font-bold text-5xl md:text-6xl tracking-tight text-[var(--color-accent)] tabular-nums">
              <CountUp
                to={stat.value}
                suffix={stat.suffix}
                format={stat.format}
                active={inView}
              />
            </div>
            <p className="mt-3 text-base text-[var(--color-ink)]/50">
              {stat.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
