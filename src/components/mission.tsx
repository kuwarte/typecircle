// src/components/mission.tsx
import { Compass, Users2, Sparkles } from "lucide-react";

const PILLARS = [
  {
    label: "Our mission",
    icon: Compass,
    bg: "bg-[var(--color-accent)]",
    bgVar: "var(--color-accent)",
    fg: "text-[var(--color-paper)]",
    title: "Give people a real, honest mirror",
    body: "Not a horoscope. A framework grounded in decades of psychology, built to explain the why behind how you act.",
  },
  {
    label: "Our approach",
    icon: Users2,
    bg: "bg-[var(--color-ink)]",
    bgVar: "var(--color-ink)",
    fg: "text-[var(--color-paper)]",
    title: "Type is a starting point, not a label",
    body: "We treat your result as a lens to understand patterns, growth edges, and relationships — not a box to sit in.",
  },
  {
    label: "Our community",
    icon: Sparkles,
    bg: "bg-[var(--color-paper)]",
    bgVar: "var(--color-paper)",
    fg: "text-[var(--color-ink)]",
    title: "Better understood, together",
    body: "Circles connect you with people who share your type, or challenge it — either way, you see yourself more clearly.",
  },
];

export function Mission() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16">
        <h2 className="font-heading font-bold text-4xl md:text-6xl tracking-tight leading-[1.05] max-w-2xl">
          Understand yourself, honestly.
        </h2>
        <p className="max-w-xs text-[var(--color-ink)]/55 text-base md:text-right">
          No horoscopes, no vague affirmations — real people to talk it through
          with.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PILLARS.map((p) => {
          const Icon = p.icon;
          const isLight = p.bg === "bg-[var(--color-paper)]";
          return (
            <div
              key={p.label}
              className={`group relative overflow-hidden rounded-2xl h-full min-h-[340px] flex flex-col ${p.bg} ${p.fg} px-8 py-10 transition-shadow duration-300 hover:shadow-[8px_8px_0_0_rgba(0,0,0,0.40)] ${
                isLight ? "border border-[var(--color-ink)]/10" : ""
              }`}
            >
              <Icon
                aria-hidden="true"
                size={150}
                strokeWidth={1}
                className={`absolute -right-6 -bottom-6 transition-transform duration-500 group-hover:scale-110 ${
                  isLight
                    ? "opacity-[0.06] text-[var(--color-ink)]"
                    : "opacity-[0.18]"
                }`}
              />
              {/* Scrim: fades from the card's own bg color over the icon, keeping text legible regardless of overlap */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(115deg, ${p.bgVar} 55%, transparent 90%)`,
                }}
              />
              <div className="relative">
                <h4 className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-5">
                  {p.label}
                </h4>
                <h3 className="font-heading font-semibold text-xl md:text-2xl tracking-tight leading-snug mb-3">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed opacity-70">{p.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
