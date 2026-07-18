// src/app/types/[n]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TYPES, getType } from "@/lib/types-data";

export function generateStaticParams() {
  return TYPES.map((t) => ({ n: String(t.n) }));
}

export default async function TypePage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const type = getType(Number(n));
  if (!type) notFound();

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

      <h1 className="font-heading font-semibold text-4xl md:text-5xl tracking-tight leading-[1.1]">
        {type.name}
      </h1>

      <p className="mt-5 text-[var(--color-ink)]/70 text-lg max-w-xl">
        {type.blurb}
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-ink)]/10 p-6">
          <h3 className="font-heading font-semibold text-sm text-[var(--color-ink)]/50 mb-2">
            core motivation
          </h3>
          <p className="text-[var(--color-ink)]/75">{type.core}</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-ink)]/10 p-6">
          <h3 className="font-heading font-semibold text-sm text-[var(--color-ink)]/50 mb-2">
            wings
          </h3>
          <p className="text-[var(--color-ink)]/75">{type.wing}</p>
        </div>
      </div>
    </section>
  );
}
