// src/app/types/[n]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Brain,
    Heart,
    Footprints,
    TrendingUp,
    TrendingDown,
    Quote,
} from "lucide-react";
import { TYPES, getType, getTriadInfo, getTriadLabel } from "@/lib/types-data";
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

const TRIAD_ICONS = {
    head: Brain,
    heart: Heart,
    body: Footprints,
} as const;

function SectionHeader({
    title,
}: {
    title: string;
}) {
    return (
        <div className="flex items-center gap-2.5 mb-6">
            <h2 className="font-heading font-semibold text-3xl tracking-tight">
                {title}
            </h2>
        </div>
    );
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
    const triadLabel = getTriadLabel(type.triad);
    const triadInfo = getTriadInfo(type.triad);
    const TriadIcon = TRIAD_ICONS[type.triad];

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-16 md:pb-24">
            <Link
                href="/types"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink)]/55 hover:text-[var(--color-accent)] transition-colors mb-6"
            >
                <ArrowLeft size={16} strokeWidth={2.25} />
                All types
            </Link>

            {/* Header */}
            <section className="relative overflow-hidden pb-8 sm:pb-10 border-b border-[var(--color-ink)]/8">
                <span
                    aria-hidden="true"
                    className="hidden sm:block absolute -right-2 -bottom-10 font-heading font-bold text-[160px] md:text-[200px] leading-none text-[var(--color-ink)]/[0.05] select-none pointer-events-none"
                    style={{
                        WebkitMaskImage:
                            "linear-gradient(to top, black 55%, transparent 100%)",
                        maskImage: "linear-gradient(to top, black 55%, transparent 100%)",
                    }}
                >
                    {type.n}
                </span>
                <div className="relative max-w-xl">
                    <h1 className="mt-4 font-heading font-semibold text-5xl md:text-6xl leading-[1.1] tracking-tight">
                        {type.name}
                    </h1>
                    <p className="mt-3 text-[var(--color-ink)]/62 text-base md:text-lg leading-relaxed">
                        {type.blurb}
                    </p>
                </div>
            </section>

            {/* Description + triad — two cards, stack on mobile */}
            <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[var(--color-ink)]/2 p-5 sm:p-6 flex flex-col">
                    <SectionHeader title="What it's like" />
                    <div className="relative pl-4">
                        <p className="leading-relaxed font-medium text-[var(--color-ink)]/80">
                            {type.longDescription}
                        </p>
                    </div>
                </div>
                <div className="rounded-2xl  p-5 sm:p-6 flex flex-col">
                    <SectionHeader title={`The ${triadLabel} triad`} />
                    <div className="flex-1 flex flex-col justify-center rounded-xl bg-[var(--color-ink)]/[0.03] px-4 py-4">
                        <p className="leading-relaxed font-medium text-[var(--color-ink)]/80">
                            {triadInfo}
                        </p>
                    </div>
                </div>
            </section>

            {/* Core motivation + wings */}
            <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[var(--color-ink)]/2  p-5 sm:p-6">
                    <SectionHeader title="Core motivation" />
                    <p className="leading-relaxed font-medium text-[var(--color-ink)]/80">
                        {type.core}
                    </p>
                </div>
                <div className="rounded-2xl bg-[var(--color-ink)]/2  p-5 sm:p-6">
                    <SectionHeader title="Wings" />
                    <p className="leading-relaxed font-medium text-[var(--color-ink)]/80">
                        {type.wing}
                    </p>
                </div>
            </section>

            {/* Core fear / desire — two distinct colored tiles instead of a
                plain 2-col text split, so fear vs. desire is instantly
                visually distinguishable, not just labeled */}
            <section className="mt-4 rounded-2xl bg-[var(--color-ink)]/2  p-5 sm:p-6">
                <SectionHeader title="Core fear & desire" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <p className="flex items-center gap-1.5 text-lg font-semibold text-[var(--color-ink)]/45 mb-2">
                            Fears
                        </p>
                        <div className="rounded-xl bg-[var(--color-ink)]/[0.03] px-4 py-4">
                            <p className="leading-relaxed font-medium text-[var(--color-ink)]/80">
                                {type.coreFear}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="flex items-center gap-1.5 text-lg font-semibold text-[var(--color-accent)] mb-2">
                            Desires
                        </p>
                        <div className="rounded-xl bg-[var(--color-accent)]/[0.06] px-4 py-4">
                            <p className="leading-relaxed font-medium text-[var(--color-ink)]/80">
                                {type.coreDesire}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Strengths / challenges — each item is its own pill/row so the
                list reads as distinct scannable points instead of a dense
                bulleted paragraph block */}
            <section className="mt-4 rounded-2xl bg-[var(--color-ink)]/2 p-5 sm:p-6">
                <SectionHeader title="Strengths & challenges" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
                    <div>
                        <p className="flex items-center gap-1.5 text-lg font-semibold text-[var(--color-accent)] mb-2.5">
                            Strengths
                        </p>
                        <ul className="flex flex-col gap-1.5">
                            {type.strengths.map((s) => (
                                <li
                                    key={s}
                                    className="flex items-start gap-2.5 rounded-lg bg-[var(--color-accent)]/[0.05] px-3 py-2.5"
                                >
                                    <span className="leading-relaxed font-medium text-[var(--color-ink)]/80">
                                        {s}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="flex items-center gap-1.5 text-lg font-semibold text-[var(--color-ink)]/45 mb-2.5">
                            Challenges
                        </p>
                        <ul className="flex flex-col gap-1.5">
                            {type.challenges.map((c) => (
                                <li
                                    key={c}
                                    className="flex items-start gap-2.5 rounded-lg bg-[var(--color-ink)]/[0.03] px-3 py-2.5"
                                >
                                    <span className="leading-relaxed font-medium text-[var(--color-ink)]/80">
                                        {c}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Relationships / at work — quote-style treatment gives these
                two paragraphs a bit more visual identity than plain prose */}
            <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[var(--color-ink)]/2 p-5 sm:p-6">
                    <SectionHeader title="In relationships" />
                    <div className="relative">
                        <Quote
                            size={28}
                            strokeWidth={0}
                            fill="currentColor"
                            className="absolute -top-1 -left-1 text-[var(--color-ink)]/[0.1]"
                        />
                        <p className="leading-relaxed font-medium text-[var(--color-ink)]/60 pl-8">
                            {type.relationships}
                        </p>
                    </div>
                </div>
                <div className="rounded-2xl bg-[var(--color-ink)]/2 p-5 sm:p-6">
                    <SectionHeader title="At work" />
                    <div className="relative">
                        <Quote
                            size={28}
                            strokeWidth={0}
                            fill="currentColor"
                            className="absolute -top-1 -left-1 text-[var(--color-ink)]/[0.06]"
                        />
                        <p className="leading-relaxed font-medium text-[var(--color-ink)]/60 pl-8">
                            {type.atWork}
                        </p>
                    </div>
                </div>
            </section>

            {/* Growth / stress — kept as the two labeled directional tiles,
                but with a small caption above each so it's clear which is
                which without relying only on icon color */}
            <section className="mt-4 rounded-2xl bg-[var(--color-ink)]/2 p-5 sm:p-6">
                <SectionHeader title="Growth & stress" />
                <div className="flex flex-col gap-3">
                    <div>
                        <p className="flex items-center gap-1.5 text-lg font-semibold text-[var(--color-accent)] mb-1.5">
                            <TrendingUp size={22} strokeWidth={2.5} />
                            In growth
                        </p>
                        <div className="rounded-xl bg-[var(--color-accent)]/[0.06] px-4 py-3.5">
                            <p className="leading-relaxed font-medium text-[var(--color-ink)]/80">
                                {type.growth}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="flex items-center gap-1.5 text-lg font-semibold text-[var(--color-ink)]/45 mb-1.5">
                            <TrendingDown size={22} strokeWidth={2.5} />
                            Under stress
                        </p>
                        <div className="rounded-xl bg-[var(--color-ink)]/[0.03] px-4 py-3.5">
                            <p className="leading-relaxed font-medium text-[var(--color-ink)]/80">
                                {type.stress}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Growth tips — numbered list kept, tightened spacing and
                consistent card treatment matching the rest */}
            <section className="mt-4 rounded-2xl bg-[var(--color-ink)]/2 p-5 sm:p-6">
                <SectionHeader title="Growth practices to try" />
                <ul className="flex flex-col gap-2">
                    {type.growthTips.map((tip, i) => (
                        <li
                            key={tip}
                            className="flex items-start gap-3 rounded-xl bg-[var(--color-ink)]/[0.03] px-4 py-3"
                        >
                            <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] text-[11px] font-semibold flex items-center justify-center mt-0.5">
                                {i + 1}
                            </span>
                            <span className="leading-relaxed font-medium text-[var(--color-ink)]/80">
                                {tip}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* CTA */}
            <section className="mt-6 rounded-2xl bg-[var(--color-ink)]/[0.035] px-5 py-6 sm:px-8 sm:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-heading font-semibold text-lg sm:text-xl tracking-tight">
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

            {
                prevType && nextType && (
                    <nav className="mt-6 flex flex-wrap gap-3">
                        <Link
                            href={`/types/${prevType.n}`}
                            className="group relative inline-flex items-center justify-center rounded-full border border-[var(--color-ink)]/12 p-6 transition-all duration-150 hover:bg-[var(--color-ink)]/[0.03] active:scale-90 active:bg-[var(--color-ink)]/[0.06]"
                        >
                            <ArrowLeft
                                size={18}
                                strokeWidth={3}
                                className="shrink-0 text-[var(--color-ink)]/35 group-hover:text-[var(--color-ink)]/60 group-active:text-[var(--color-ink)]/80 transition-colors"
                            />
                        </Link>
                        <Link
                            href={`/types/${nextType.n}`}
                            className="group relative inline-flex items-center justify-center rounded-full border border-[var(--color-ink)]/12 p-6 transition-all duration-150 hover:bg-[var(--color-ink)]/[0.03] active:scale-90 active:bg-[var(--color-ink)]/[0.06] ml-auto"
                        >
                            <ArrowRight
                                size={18}
                                strokeWidth={3}
                                className="shrink-0 text-[var(--color-ink)]/35 group-hover:text-[var(--color-ink)]/60 group-active:text-[var(--color-ink)]/80 transition-colors"
                            />
                        </Link>
                    </nav>
                )
            }
        </main >
    );
}
