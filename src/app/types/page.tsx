import Link from "next/link";
import { TYPES } from "@/lib/types-data";

const COLORS = [
  "#C97B4A","#D65D6E","#D9A73B","#7B5EA7",
  "#4C6B8A","#4A7A8C","#E08A3E","#A23B3B","#5B8C5A",
];

export default function TypesPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="font-heading font-bold text-4xl tracking-tight">The 9 types</h1>
        <p className="mt-2 text-[var(--color-ink)]/55 text-sm max-w-md">
          Each type reflects a core pattern of thinking, feeling, and behaving. Find yours.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TYPES.map((t, i) => (
          <Link
            key={t.n}
            href={`/types/${t.n}`}
            className="group relative overflow-hidden rounded-2xl border border-black/5 p-6 hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.08)] transition-shadow"
          >
            <span
              className="text-[120px] font-heading font-bold absolute -right-3 -bottom-6 leading-none opacity-[0.06] select-none pointer-events-none transition-transform duration-300 group-hover:scale-110"
              style={{ color: COLORS[i] }}
            >
              {t.n}
            </span>
            <div className="relative">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS[i] }}>
                type {t.n} — {t.theme}
              </span>
              <h2 className="font-heading font-semibold text-xl tracking-tight mt-1 mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                {t.name}
              </h2>
              <p className="text-sm text-[var(--color-ink)]/55 leading-relaxed">{t.blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
