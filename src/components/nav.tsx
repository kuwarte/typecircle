// src/components/nav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Compass,
  Users,
  BookOpen,
  ArrowRight,
  Menu,
  LogIn,
} from "lucide-react";

const links = [
  { href: "/types", label: "types", icon: Compass },
  { href: "/community", label: "community", icon: Users },
  { href: "/resources", label: "resources", icon: BookOpen },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-paper)]/90 backdrop-blur-sm border-b border-black/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 font-heading font-bold text-lg tracking-tight lowercase"
        >
          typecircle
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-1.5 text-sm font-medium lowercase text-[var(--color-ink)]/70 hover:text-[var(--color-accent)] transition-colors"
              >
                <Icon
                  size={16}
                  strokeWidth={2}
                  className="text-[var(--color-ink)]/50 group-hover:text-[var(--color-accent)] transition-colors"
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-sm font-medium"
          >
            Log In
          </Link>
          <Link
            href="/quiz"
            className={cn(
              buttonVariants(),
              "rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 font-medium lowercase flex items-center gap-1.5",
            )}
          >
            find your type
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>

        {/* Mobile trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors"
          >
            <Menu size={20} strokeWidth={2} />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="data-[side=right]:w-[300px] data-[side=right]:max-w-[85vw] bg-[var(--color-paper)] border-l border-black/5 p-0"
          >
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>

            <nav className="flex flex-col gap-1 px-4 pt-16 pb-6">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className="flex items-center gap-3 text-base font-medium lowercase text-[var(--color-ink)]/80 hover:text-[var(--color-accent)] py-3 px-2 rounded-lg hover:bg-black/5 transition-colors"
                  >
                    <Icon size={18} strokeWidth={2} />
                    {link.label}
                  </Link>
                );
              })}

              <div className="h-px bg-black/5 my-3" />

              <Link
                href="/login"
                onClick={close}
                className="flex items-center gap-3 text-base font-medium py-3 px-2 rounded-lg hover:bg-black/5 transition-colors"
              >
                <LogIn size={18} strokeWidth={2} />
                Log In
              </Link>

              <Link
                href="/quiz"
                onClick={close}
                className={cn(
                  buttonVariants(),
                  "rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 font-medium lowercase flex items-center justify-center gap-1.5 mt-3",
                )}
              >
                find your type
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
