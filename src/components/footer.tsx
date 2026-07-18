// src/components/footer.tsx
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/quiz", label: "Take the test" },
      { href: "/types", label: "The 9 types" },
      { href: "/community", label: "Community" },
    ],
  },
  {
    title: "Project",
    links: [
      { href: "/about", label: "About this project" },
      { href: "https://github.com/kuwarte", label: "Source code" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-accent)] text-[var(--color-paper)] mt-20 md:min-h-[480px] flex flex-col justify-end">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-10 w-full">
        <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-0 pb-12 md:pb-16">
          {/* Left: brand block */}
          <div className="md:w-[280px] shrink-0 flex flex-col items-start gap-4">
            <span className="font-heading font-bold text-4xl lowercase">
              typecircle
            </span>
            <Link
              href="https://github.com/kuwarte"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-paper)]/70 hover:text-[var(--color-paper)] transition-colors"
            >
              <FaGithub size={18} />
              kuwarte
            </Link>
          </div>
          {/* Middle: empty space for visual division */}
          <div className="hidden md:block flex-1" />
          {/* Right: link columns */}
          <div className="grid grid-cols-2 gap-8 md:gap-16 md:w-auto">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-medium text-[var(--color-paper)]/50 mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--color-paper)]/75 hover:text-[var(--color-paper)] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-[var(--color-paper)]/15 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="text-xs text-[var(--color-paper)]/50">
            © {new Date().getFullYear()} typecircle. A frontend study project.
          </p>
          <p className="text-xs text-[var(--color-paper)]/50 lowercase">
            know your type, find your circle
          </p>
        </div>
      </div>
    </footer>
  );
}
