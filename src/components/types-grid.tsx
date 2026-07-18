// src/components/types-grid.tsx
import Link from "next/link";
import { TYPES } from "@/lib/types-data";

export function TypesGrid() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-28">
      <div className="mb-10 md:mb-14">
        <h2 className="font-heading font-bold text-4xl md:text-6xl tracking-tight leading-[1.05] max-w-2xl">
          Nine ways of seeing the world.
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {TYPES.map((t) => (
          <Link
            key={t.n}
            href={`/types/${t.n}`}
            className="group relative overflow-hidden rounded-2xl bg-[var(--color-accent)] text-[var(--color-paper)] px-7 py-8 min-h-[280px] flex flex-col transition-shadow duration-200 hover:shadow-[8px_8px_0_0_rgba(0,0,0,0.15)]"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-paper)]/70 mb-4">
              type {t.n} — {t.theme}
            </span>

            <h3 className="font-heading font-semibold text-2xl tracking-tight leading-snug mb-2">
              {t.name}
            </h3>

            <p className="text-sm text-[var(--color-paper)]/75 leading-relaxed">
              {t.blurb}
            </p>

            <div className="mt-auto pt-5 flex items-center justify-between gap-3">
              <span className="text-xs text-[var(--color-paper)]/50">
                {t.wing}
              </span>
              <span className="flex-shrink-0 aspect-square w-8 h-8 rounded-full bg-[var(--color-paper)]/15 text-[var(--color-paper)] flex items-center justify-center group-hover:bg-[var(--color-paper)] group-hover:text-[var(--color-accent)] transition-colors duration-200">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="none"
                >
                  <path
                    d="M4 12L12 4M12 4H5.5M12 4V10.5"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
