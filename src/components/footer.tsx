"use client";

import { FaGithub, FaRegCircle } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/enneagram/test") ||
    pathname.match(/^\/rooms\/[^/]+$/)
  ) {
    return null;
  }
  return (
    <footer className="glass-navbar border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FaRegCircle className="w-5 h-5 text-[var(--typecircle-green)]" />
            <span className="text-sm font-medium text-foreground">
              typecircle
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              • Discover your true self
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Created by</span>
            </div>
            <a
              href="https://github.com/kuwarte"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--typecircle-green)]/10 border border-[var(--typecircle-green)]/20 text-[var(--typecircle-green)] hover:bg-[var(--typecircle-green)]/20 transition-all duration-200 hover:scale-105"
            >
              <FaGithub className="w-4 h-4" />
              <span className="font-medium">kuwarte</span>
            </a>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 TypeCircle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
