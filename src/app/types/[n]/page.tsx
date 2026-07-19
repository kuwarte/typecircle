// src/app/types/[n]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TYPES, getType } from "@/lib/types-data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return TYPES.map((t) => ({ n: String(t.n) }));
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
    title: `${type.name} — Type ${type.n} | typecircle`,
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
    <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <Link
        href="/types"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink)]/60 hover:text-[var(--color-accent)] transition-colors mb-8"
      >
        <ArrowLeft size={16} strokeWidth={2} />
        all types
      </Link>

      <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]/50 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
        type {type.n} — {type.theme}
      </span>

      <h1 className="font-heading font-semibold text-4xl md:text-6xl tracking-tight leading-[1.05]">
        {type.name}
      </h1>

      <p className="mt-5 text-[var(--color-ink)]/70 text-lg md:text-xl max-w-xl leading-relaxed">
        {type.blurb}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-[var(--color-ink)] text-[var(--color-paper)] p-6 md:p-7">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-3">
            core motivation
          </h3>
          <p className="text-[var(--color-paper)]/80 leading-relaxed">
            {type.core}
          </p>
        </div>
        <div className="rounded-2xl bg-[var(--color-accent)] text-[var(--color-paper)] p-6 md:p-7">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-paper)]/70 mb-3">
            wings
          </h3>
          <p className="text-[var(--color-paper)]/90 leading-relaxed">
            {type.wing}
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-[var(--color-ink)]/10 p-6 md:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-[var(--color-ink)]/70 text-sm md:text-base">
          Not sure if {type.name.toLowerCase()} is really you?
        </p>
        <Link
          href="/quiz"
          className={cn(
            buttonVariants({ size: "lg" }),
            "rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 font-medium px-6 whitespace-nowrap w-fit",
          )}
        >
          Take the test
        </Link>
      </div>

      {prevType && nextType && (
        <div className="mt-12 pt-8 border-t border-[var(--color-ink)]/10 flex items-center justify-between gap-4">
          <Link
            href={`/types/${prevType.n}`}
            className="group flex items-center gap-3 text-left min-w-0"
          >
            <ArrowLeft
              size={18}
              strokeWidth={2}
              className="shrink-0 text-[var(--color-ink)]/40 group-hover:text-[var(--color-accent)] transition-colors"
            />
            <div className="min-w-0">
              <span className="block text-xs text-[var(--color-ink)]/45">
                type {prevType.n}
              </span>
              <span className="block text-sm font-medium text-[var(--color-ink)]/80 group-hover:text-[var(--color-accent)] transition-colors truncate">
                {prevType.name}
              </span>
            </div>
          </Link>

          <Link
            href={`/types/${nextType.n}`}
            className="group flex items-center gap-3 text-right min-w-0 justify-end"
          >
            <div className="min-w-0">
              <span className="block text-xs text-[var(--color-ink)]/45">
                type {nextType.n}
              </span>
              <span className="block text-sm font-medium text-[var(--color-ink)]/80 group-hover:text-[var(--color-accent)] transition-colors truncate">
                {nextType.name}
              </span>
            </div>
            <ArrowRight
              size={18}
              strokeWidth={2}
              className="shrink-0 text-[var(--color-ink)]/40 group-hover:text-[var(--color-accent)] transition-colors"
            />
          </Link>
        </div>
      )}
    </section>
  );
}
