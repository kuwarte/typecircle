import { Fragment } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TYPES } from "@/lib/types-data";

export default function TypesPage() {
  return (
    <main>
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-8 md:pb-12">
        <div className="max-w-2xl">
          <h1 className="font-heading font-semibold text-3xl md:text-5xl leading-[1.05] tracking-tight">
            Enneagram Personality Types
          </h1>
        </div>

        {/* Real index, not decoration — every number below is an actual type */}
        <nav
          aria-label="Jump to a type"
          className="mt-6 flex flex-wrap items-baseline gap-y-2"
        >
          {TYPES.map((type, i) => (
            <Fragment key={type.n}>
              <Link
                href={`/types/${type.n}`}
                className="group inline-flex items-baseline gap-1.5 text-sm text-[var(--color-ink)]/55 hover:text-[var(--color-accent)] transition-colors"
              >
                <span className="font-heading font-semibold text-[var(--color-ink)]/30 group-hover:text-[var(--color-accent)] transition-colors">
                  0{type.n}
                </span>
                {type.name}
              </Link>
              {i < TYPES.length - 1 && (
                <span
                  aria-hidden="true"
                  className="mx-2.5 text-[var(--color-ink)]/15"
                >
                  /
                </span>
              )}
            </Fragment>
          ))}
        </nav>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TYPES.map((type) => {
            return (
              <Link
                key={type.n}
                href={`/types/${type.n}`}
                className="group relative overflow-hidden rounded-2xl bg-[var(--color-accent)] text-[var(--color-paper)] px-7 py-8 min-h-[300px] flex flex-col transition-shadow duration-200 hover:shadow-[8px_8px_0_0_rgba(0,0,0,0.15)]"
              >
                <div className="relative">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-paper)]/70">
                    type {type.n} / {type.theme}
                  </span>
                  <h2 className="mt-4 font-heading font-semibold text-2xl tracking-tight leading-snug">
                    {type.name}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-paper)]/75">
                    {type.blurb}
                  </p>
                </div>
                <div className="relative mt-auto pt-8 flex items-end justify-between gap-4">
                  <p className="text-xs leading-relaxed max-w-[13rem] text-[var(--color-paper)]/55">
                    {type.wing}
                  </p>
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[var(--color-paper)]/15 text-[var(--color-paper)] flex items-center justify-center group-hover:bg-[var(--color-paper)] group-hover:text-[var(--color-accent)] transition-colors">
                    <ArrowUpRight size={16} strokeWidth={2.25} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
