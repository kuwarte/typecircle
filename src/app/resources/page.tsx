import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const FEATURED = {
  title: "How to use your type without becoming trapped by it",
  description:
    "A practical reading path for treating the Enneagram as a mirror, not a label.",
  href: "#",
};

const RESOURCES = [
  {
    category: "Start here",
    items: [
      {
        title: "What is the Enneagram?",
        description:
          "A grounded primer on the system, its origins, and how it differs from other personality frameworks.",
        href: "#",
      },
      {
        title: "How to find your type",
        description:
          "Why self-typing is hard, and how to use the test as a starting point rather than a verdict.",
        href: "#",
      },
    ],
  },
  {
    category: "By type",
    items: [
      [
        "Type 1 - The Reformer",
        "Integrity, inner critic, and acceptance.",
        "/types/1",
      ],
      ["Type 2 - The Helper", "Giving, boundaries, and receiving.", "/types/2"],
      ["Type 3 - The Achiever", "Image, worth, and being.", "/types/3"],
      [
        "Type 4 - The Individualist",
        "Identity, longing, and ordinary meaning.",
        "/types/4",
      ],
      [
        "Type 5 - The Investigator",
        "Knowledge, withdrawal, and engagement.",
        "/types/5",
      ],
      ["Type 6 - The Loyalist", "Security, doubt, and trust.", "/types/6"],
      [
        "Type 7 - The Enthusiast",
        "Possibility, avoidance, and presence.",
        "/types/7",
      ],
      [
        "Type 8 - The Challenger",
        "Power, vulnerability, and softness.",
        "/types/8",
      ],
      [
        "Type 9 - The Peacemaker",
        "Harmony, self-forgetting, and wanting.",
        "/types/9",
      ],
    ].map(([title, description, href]) => ({ title, description, href })),
  },
  {
    category: "Go deeper",
    items: [
      {
        title: "Wings explained",
        description: "How adjacent types shape your core type's expression.",
        href: "#",
      },
      {
        title: "Instinct stacks",
        description:
          "The three instinctual drives and how they layer onto your type.",
        href: "#",
      },
      {
        title: "Stress and growth arrows",
        description:
          "Where each type goes under pressure, and what integration looks like.",
        href: "#",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 pt-10 pb-16 md:pb-24">
      {/* Header — plain, no card, no oversized decorative icon */}
      <section className="max-w-6xl">
        <h1 className="font-heading font-semibold text-3xl md:text-5xl leading-[1.05] tracking-tight">
          A field guide for noticing yourself.
        </h1>
        <p className="mt-5 text-[var(--color-ink)]/62 text-base md:text-lg max-w-xl">
          Read in small pieces. Bring one idea into a conversation. Let the
          pattern become useful before it becomes a label.
        </p>
      </section>

      {/* Featured path — one understated bordered link, not a colored block */}
      <Link
        href={FEATURED.href}
        className="group mt-8 md:mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-[var(--color-ink)]/10 px-6 py-6 md:px-7 md:py-7 hover:border-[var(--color-accent)]/40 transition-colors"
      >
        <div className="min-w-0">
          <h2 className="mt-2 font-heading font-semibold text-xl md:text-2xl tracking-tight">
            {FEATURED.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]/55 max-w-xl">
            {FEATURED.description}
          </p>
        </div>
        <span className="shrink-0 w-10 h-10 rounded-full border border-[var(--color-ink)]/15 text-[var(--color-ink)]/50 flex items-center justify-center group-hover:border-[var(--color-accent)]/40 group-hover:text-[var(--color-accent)] transition-colors">
          <ArrowUpRight size={17} strokeWidth={2.25} />
        </span>
      </Link>

      {/* Resource sections — single-column list per category, divided by
          thin rules. The old 2-col grid let rows of uneven length
          misalign against their neighbor and read as a jumbled wall of
          links; one column top-to-bottom is much easier to scan. */}
      <section className="mt-12 md:mt-16 divide-y divide-[var(--color-ink)]/10 border-y border-[var(--color-ink)]/10">
        {RESOURCES.map((section) => (
          <div
            key={section.category}
            className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-5 py-8"
          >
            <h2 className="font-heading font-semibold text-xl tracking-tight">
              {section.category}
            </h2>

            <div className="divide-y divide-[var(--color-ink)]/8">
              {section.items.map((item) => (
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
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
