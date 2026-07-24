// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="max-w-4xl">
        <h1 className="mt-4 font-heading font-semibold text-5xl md:text-7xl leading-[1.02] tracking-tight">
          404: Page not found
        </h1>

        <p className="mt-6 text-[var(--color-ink)]/62 text-base md:text-lg leading-relaxed max-w-lg">
          The page you requested does not exist. It may have been moved,
          renamed, or removed.
        </p>
      </div>

      {/* Quick links — same bordered-list pattern used on the resources page */}
      <section className="mt-20 md:mt-24 pt-10 border-t border-[var(--color-ink)]/10">
        <p className="font-heading font-semibold text-2xl tracking-wide text-[var(--color-ink)] mb-5">
          You may also be looking for
        </p>
        <div className="divide-y divide-[var(--color-ink)]/8 border-y border-[var(--color-ink)]/10 max-w-lg">
          {[
            { title: "Feed", href: "/feed" },
            { title: "Community", href: "/community" },
            { title: "Resources", href: "/resources" },
            { title: "Take the quiz", href: "/quiz" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between py-4 transition-colors"
            >
              <span className="font-heading font-semibold text-base tracking-tight group-hover:text-[var(--color-accent)] transition-colors">
                {link.title}
              </span>
              <span className="text-[var(--color-ink)]/25 group-hover:text-[var(--color-accent)] transition-colors">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
