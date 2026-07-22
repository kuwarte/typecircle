// src/app/types/[n]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TYPES, getType } from "@/lib/types-data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return TYPES.map((type) => ({ n: String(type.n) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const type = getType(Number(n));
  if (!type) return {};
  return {
    title: `${type.name} - Type ${type.n} | typecircle`,
    description: type.blurb,
  };
}

export default async function TypePage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const type = getType(Number(n));
  if (!type) notFound();

  const total = TYPES.length;
  const prevN = ((type.n - 2 + total) % total) + 1;
  const nextN = (type.n % total) + 1;
  const prevType = getType(prevN);
  const nextType = getType(nextN);

  return (
    <main className="max-w-6xl mx-auto px-6 pt-10 pb-16 md:pb-24">
      <Link
        href="/types"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink)]/55 hover:text-[var(--color-accent)] transition-colors mb-6"
      >
        <ArrowLeft size={16} strokeWidth={2.25} />
        All types
      </Link>

      {/* Header — the number now bleeds off the bottom-right corner on
          purpose (with a top fade) instead of getting hard-clipped */}
      <section className="relative overflow-hidden pt-4 pb-10 md:pb-14 border-b border-[var(--color-ink)]/8">
        <span
          aria-hidden="true"
          className="absolute -right-2 -bottom-10 font-heading font-bold text-[200px] md:text-[240px] leading-none text-[var(--color-ink)]/[0.05] select-none pointer-events-none"
          style={{
            WebkitMaskImage:
              "linear-gradient(to top, black 55%, transparent 100%)",
            maskImage: "linear-gradient(to top, black 55%, transparent 100%)",
          }}
        >
          {type.n}
        </span>
        <div className="relative max-w-2xl">
          <h1 className="font-heading font-semibold text-4xl md:text-6xl leading-[1.05] tracking-tight">
            {type.name}
          </h1>
          <p className="mt-5 text-[var(--color-ink)]/62 text-base md:text-xl max-w-xl leading-relaxed">
            {type.blurb}
          </p>
        </div>
      </section>

      {/* Core motivation + Wings — both are one short fact, so they get
          equal treatment: stacked, same scale, split by a thin rule */}
      <section className="max-w-2xl pt-10 md:pt-14 space-y-8">
        <div>
          <h2 className="font-heading font-semibold text-lg tracking-tight mb-2">
            Core motivation
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-[var(--color-ink)]/75">
            {type.core}
          </p>
        </div>

        <div className="pt-8 border-t border-[var(--color-ink)]/8">
          <h2 className="font-heading font-semibold text-lg tracking-tight mb-2">
            Wings
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-[var(--color-ink)]/75">
            {type.wing}
          </p>
        </div>
      </section>

      {/* CTA — its own soft surface so it reads as the one actionable
          moment on the page, without shouting in accent color */}
      <section className="mt-14 md:mt-16 rounded-2xl bg-[var(--color-ink)]/[0.035] px-7 py-8 md:px-9 md:py-9 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <h2 className="font-heading font-semibold text-xl md:text-2xl tracking-tight">
            Still checking if this is you?
          </h2>
          <p className="mt-1.5 text-sm text-[var(--color-ink)]/55">
            Use the test as a starting point, then compare the pattern against
            your real life.
          </p>
        </div>
        <Link
          href="/quiz"
          className={cn(
            buttonVariants({ size: "lg" }),
            "rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 font-medium px-6 whitespace-nowrap w-fit shrink-0",
          )}
        >
          Take the test
        </Link>
      </section>

      {/* Prev / next — one pagination bar split by a divider,
          instead of two separate boxes competing for attention */}
      {prevType && nextType && (
        <nav className="mt-6 rounded-2xl border border-[var(--color-ink)]/10 overflow-hidden grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-ink)]/10">
          <Link
            href={`/types/${prevType.n}`}
            className="group flex items-center gap-3 px-5 py-5 hover:bg-[var(--color-ink)]/[0.03] transition-colors"
          >
            <ArrowLeft
              size={16}
              strokeWidth={2.25}
              className="shrink-0 text-[var(--color-ink)]/35 group-hover:text-[var(--color-accent)] transition-colors"
            />
            <div className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/40">
                Previous
              </span>
              <span className="block text-sm font-semibold truncate mt-0.5">
                {prevType.name}
              </span>
            </div>
          </Link>

          <Link
            href={`/types/${nextType.n}`}
            className="group flex items-center justify-between sm:justify-end gap-3 px-5 py-5 hover:bg-[var(--color-ink)]/[0.03] transition-colors"
          >
            <div className="min-w-0 sm:text-right order-1">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/40">
                Next
              </span>
              <span className="block text-sm font-semibold truncate mt-0.5">
                {nextType.name}
              </span>
            </div>
            <ArrowRight
              size={16}
              strokeWidth={2.25}
              className="shrink-0 order-2 text-[var(--color-ink)]/35 group-hover:text-[var(--color-accent)] transition-colors"
            />
          </Link>
        </nav>
      )}
    </main>
  );
}
