import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";

const RESOURCES = [
  {
    category: "Getting started",
    items: [
      { title: "What is the Enneagram?", description: "A primer on the system, its origins, and how it differs from other personality frameworks.", href: "#" },
      { title: "How to find your type", description: "Why self-typing is hard, and how to use the test as a starting point rather than a verdict.", href: "#" },
    ],
  },
  {
    category: "By type",
    items: [
      { title: "Type 1 — The Reformer", description: "Integrity, inner critic, and the path from resentment to acceptance.", href: "/types/1" },
      { title: "Type 2 — The Helper", description: "Giving, boundaries, and learning to receive.", href: "/types/2" },
      { title: "Type 3 — The Achiever", description: "Image, worth, and the difference between doing and being.", href: "/types/3" },
      { title: "Type 4 — The Individualist", description: "Identity, longing, and finding meaning in the ordinary.", href: "/types/4" },
      { title: "Type 5 — The Investigator", description: "Knowledge, withdrawal, and learning to trust engagement.", href: "/types/5" },
      { title: "Type 6 — The Loyalist", description: "Security, doubt, and building trust from the inside out.", href: "/types/6" },
      { title: "Type 7 — The Enthusiast", description: "Possibility, avoidance, and sitting with what's hard.", href: "/types/7" },
      { title: "Type 8 — The Challenger", description: "Power, vulnerability, and the courage to be soft.", href: "/types/8" },
      { title: "Type 9 — The Peacemaker", description: "Harmony, self-forgetting, and waking up to your own wants.", href: "/types/9" },
    ],
  },
  {
    category: "Going deeper",
    items: [
      { title: "Wings explained", description: "How the adjacent types shape your core type's expression.", href: "#" },
      { title: "Instinct stacks (sp/so/sx)", description: "The three instinctual drives and how they layer onto your type.", href: "#" },
      { title: "Stress and growth arrows", description: "Where each type goes under pressure — and what integration looks like.", href: "#" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="font-heading font-bold text-4xl tracking-tight">Resources</h1>
        <p className="mt-2 text-[var(--color-ink)]/55 text-sm max-w-md">
          Guides, explainers, and deep dives to help you understand the Enneagram beyond the test result.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {RESOURCES.map((section) => (
          <div key={section.category}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/40 mb-4">
              {section.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.items.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col gap-2 rounded-2xl border border-black/5 p-5 hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.08)] transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <BookOpen size={15} strokeWidth={2} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
                    <ExternalLink size={13} strokeWidth={2} className="text-[var(--color-ink)]/20 group-hover:text-[var(--color-ink)]/40 transition-colors shrink-0" />
                  </div>
                  <h3 className="font-heading font-semibold text-sm tracking-tight group-hover:text-[var(--color-accent)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--color-ink)]/50 leading-relaxed">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
