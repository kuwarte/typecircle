"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Settings, LogOut } from "lucide-react";
import { signOut } from "@/services/supabase/auth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/profile/settings", label: "Settings", icon: Settings },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-56 shrink-0">
          <nav className="flex flex-col gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                    : "text-[var(--color-ink)]/60 hover:bg-black/5 hover:text-[var(--color-ink)]"
                )}
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </Link>
            ))}

            <div className="h-px bg-black/5 my-2" />

            <button
              onClick={signOut}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-ink)]/60 hover:bg-black/5 hover:text-[var(--color-ink)] transition-colors text-left"
            >
              <LogOut size={16} strokeWidth={2} />
              Log out
            </button>
          </nav>
        </aside>

        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </section>
  );
}
