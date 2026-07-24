import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const SECTIONS = [
  {
    category: "Why this exists",
    items: [
      {
        title:
          "Most typing tools sort you. This one's meant to show you something.",
        description:
          "Most personality quizzes hand you a label and move on. typecircle is an attempt to build the version of this that treats the Enneagram as a mirror worth returning to — something you check back in with as you change, not a verdict you get handed once and carry around.",
        href: null,
      },
      {
        title: "What it deliberately isn't",
        description:
          "Not a clinical assessment, not a replacement for therapy, and not trying to be the most 'scientific' typing system out there. It's a starting point for noticing your own patterns — the test gets you close, the reading and the people around you get you the rest of the way.",
        href: null,
      },
    ],
  },
  {
    category: "How it works",
    items: [
      {
        title: "The test",
        description:
          "27 scenario-based statements rated 1–5. No jargon, no trick questions — just patterns in how you actually react, not how you'd like to react.",
        href: "/quiz",
      },
      {
        title: "The types",
        description:
          "Nine core types, each with a distinct motivation, fear, and growth path. Meant as lenses to look through, not boxes to be filed into.",
        href: "/types",
      },
      {
        title: "The circles",
        description:
          "Small groups matched loosely by type. Some go deeper together, some end up challenging each other — both are useful.",
        href: "/community",
      },
    ],
  },
  {
    category: "Behind it",
    items: [
      {
        title: "Jasper Cuarte",
        description:
          "Built as a way to actually learn Next.js in depth, along with OAuth2 authentication and realtime/WebSocket features, instead of just reading about them.",
        href: null,
      },
      {
        title: "Built with",
        description: "Next.js, Supabase, shadcn/ui, and Tailwind CSS.",
        href: null,
      },
    ],
  },
];

export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 pt-10 pb-16 md:pb-24">
      {/* Header — plain, matches Resources: no card, no oversized hero */}
      <section className="max-w-6xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/40 block mb-5">
          about this project
        </span>
        <h1 className="font-heading font-semibold text-3xl md:text-5xl leading-[1.05] tracking-tight">
          Built to understand people, not label them.
        </h1>
        <p className="mt-5 text-[var(--color-ink)]/62 text-base md:text-lg max-w-xl">
          typecircle is a frontend study project — an attempt to build something
          that feels real, useful, and honest. The Enneagram is the framework.
          The goal is connection.
        </p>
      </section>

      {/* Sections — same single-column, divided-list pattern as Resources */}
      <section className="mt-12 md:mt-16 divide-y divide-[var(--color-ink)]/10 border-y border-[var(--color-ink)]/10">
        {SECTIONS.map((section) => (
          <div
            key={section.category}
            className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-5 py-8"
          >
            <h2 className="font-heading font-semibold text-xl tracking-tight">
              {section.category}
            </h2>

            <div className="divide-y divide-[var(--color-ink)]/8">
              {section.items.map((item) =>
                item.href ? (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0 transition-colors"
                  >
                    <div className="min-w-0">
                      <h3 className="font-heading font-semibold text-lg tracking-tight group-hover:text-[var(--color-accent)] transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink)]/55">
                        {item.description}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={16}
                      strokeWidth={2.25}
                      className="mt-1 shrink-0 text-[var(--color-ink)]/30 group-hover:text-[var(--color-accent)] transition-colors"
                    />
                  </Link>
                ) : (
                  <div key={item.title} className="py-4 first:pt-0 last:pb-0">
                    <h3 className="font-heading font-semibold text-lg tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink)]/55">
                      {item.description}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </section>

      {/* CTA — same bordered-row pattern, border color unified with the
          rest of the page (was border-black/5, now matches --color-ink) */}
      <div className="mt-12 md:mt-16 border border-[var(--color-ink)]/10 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="font-heading font-semibold text-base">
            Ready to find your type?
          </p>
          <p className="text-sm text-[var(--color-ink)]/50 mt-1">
            Takes about 8 minutes.
          </p>
        </div>
        <Link
          href="/quiz"
          className="self-start md:self-auto rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-6 py-2.5 text-sm font-medium hover:bg-[var(--color-accent)]/90 transition-colors whitespace-nowrap"
        >
          Start the test
        </Link>
      </div>
    </main>
  );
}
