import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-10 pb-16">
      <div className="relative overflow-hidden rounded-3xl bg-[var(--color-ink)] text-[var(--color-paper)] px-8 py-14 md:px-14 md:py-20">
        <div className="max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-paper)]/40 block mb-5">
            about this project
          </span>
          <h1 className="font-heading font-semibold text-4xl md:text-5xl leading-[1.1] tracking-tight">
            Built to understand people, not label them.
          </h1>
          <p className="mt-6 text-[var(--color-paper)]/65 text-base leading-relaxed max-w-md">
            typecircle is a frontend study project — an attempt to build something that feels real, useful, and honest. The Enneagram is the framework. The goal is connection.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "The test", body: "27 scenario-based statements rated 1–5. No jargon, no trick questions — just patterns." },
          { label: "The types", body: "Nine core types, each with a distinct motivation, fear, and growth path. Not boxes — lenses." },
          { label: "The circles", body: "Small groups matched by type. Some go deeper together, some challenge each other." },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-black/5 p-6">
            <h3 className="font-heading font-semibold text-base mb-2">{card.label}</h3>
            <p className="text-sm text-[var(--color-ink)]/55 leading-relaxed">{card.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-black/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="font-heading font-semibold text-base">Ready to find your type?</p>
          <p className="text-sm text-[var(--color-ink)]/50 mt-1">Takes about 8 minutes.</p>
        </div>
        <Link
          href="/quiz"
          className="self-start md:self-auto rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-6 py-2.5 text-sm font-medium hover:bg-[var(--color-accent)]/90 transition-colors whitespace-nowrap"
        >
          Start the test
        </Link>
      </div>
    </section>
  );
}
