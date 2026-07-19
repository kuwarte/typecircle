// src/components/nav.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { createClient } from "@/services/supabase/client";
import { signOut } from "@/services/supabase/auth";
import {
  Compass,
  Users,
  BookOpen,
  ArrowRight,
  Menu,
  LogIn,
  LogOut,
  User as UserIcon,
  Palette,
} from "lucide-react";

const links = [
  { href: "/types", label: "types", icon: Compass },
  { href: "/community", label: "community", icon: Users },
  { href: "/resources", label: "resources", icon: BookOpen },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const close = () => setOpen(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile(userId: string) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", userId)
        .single();
      setUsername(profile?.username ?? null);
      setAvatarUrl(profile?.avatar_url ?? null);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadProfile(session.user.id);
      else setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) loadProfile(session.user.id);
      else { setUsername(null); setAvatarUrl(null); setLoading(false); }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = username ? username.slice(0, 2).toUpperCase() : "?";

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-paper)]/90 backdrop-blur-sm border-b border-black/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 font-heading font-bold text-lg tracking-tight lowercase">
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
                <Icon size={16} strokeWidth={2} className="text-[var(--color-ink)]/50 group-hover:text-[var(--color-accent)] transition-colors" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-8 rounded-full bg-black/8 animate-pulse" />
          ) : username ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-black/10 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                <Avatar className="w-7 h-7">
                  <AvatarImage src={avatarUrl ?? ""} alt={username} />
                  <AvatarFallback className="bg-[var(--color-accent)] text-[var(--color-paper)] text-xs font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-[var(--color-ink)]/70 max-w-[120px] truncate">{username}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-black/5 bg-[var(--color-paper)] shadow-lg py-1.5 overflow-hidden">
                  <div className="px-3.5 py-2.5 border-b border-black/5">
                    <p className="text-sm font-medium truncate">{username}</p>
                  </div>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-[var(--color-ink)]/80 hover:bg-black/5 transition-colors">
                    <UserIcon size={16} strokeWidth={2} /> Profile
                  </Link>
                  <Link href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-[var(--color-ink)]/80 hover:bg-black/5 transition-colors">
                    <Palette size={16} strokeWidth={2} /> Settings
                  </Link>
                  <button onClick={() => { setMenuOpen(false); signOut(); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-[var(--color-ink)]/80 hover:bg-black/5 transition-colors text-left">
                    <LogOut size={16} strokeWidth={2} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-1.5 text-sm font-medium">Log In</Link>
              <Link href="/quiz" className={cn(buttonVariants(), "rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 font-medium lowercase flex items-center gap-1.5")}>
                find your type <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger aria-label="Open menu" className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors">
            <Menu size={20} strokeWidth={2} />
          </SheetTrigger>

          <SheetContent side="top" className="w-full bg-[var(--color-paper)] border-b border-black/5 p-0 flex flex-col rounded-b-3xl">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>

            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-black/5 shrink-0">
              <Link href="/" onClick={close} className="font-heading font-bold text-lg tracking-tight lowercase">
                typecircle
              </Link>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col px-3 py-2">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className="flex items-center gap-3 text-sm font-medium lowercase text-[var(--color-ink)]/75 hover:text-[var(--color-ink)] py-3 px-3 rounded-xl hover:bg-black/5 transition-colors"
                  >
                    <Icon size={18} strokeWidth={2} className="text-[var(--color-ink)]/40 shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* User section + CTA */}
            <div className="px-4 pb-5 pt-2 border-t border-black/5 shrink-0">
              {loading ? (
                <div className="flex items-center gap-3 py-3">
                  <div className="w-9 h-9 rounded-full bg-black/8 animate-pulse shrink-0" />
                  <div className="w-28 h-4 rounded bg-black/8 animate-pulse" />
                </div>
              ) : username ? (
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 shrink-0">
                      <AvatarImage src={avatarUrl ?? ""} alt={username} />
                      <AvatarFallback className="bg-[var(--color-accent)] text-[var(--color-paper)] text-sm font-semibold">{initials}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-semibold truncate">{username}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href="/profile" onClick={close} className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-black/5 transition-colors text-[var(--color-ink)]/50">
                      <UserIcon size={17} strokeWidth={2} />
                    </Link>
                    <Link href="/settings" onClick={close} className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-black/5 transition-colors text-[var(--color-ink)]/50">
                      <Palette size={17} strokeWidth={2} />
                    </Link>
                    <button onClick={() => { close(); signOut(); }} className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-black/5 transition-colors text-[var(--color-ink)]/50">
                      <LogOut size={17} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-3">
                  <Link href="/quiz" onClick={close} className={cn(buttonVariants(), "rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 font-medium lowercase flex items-center justify-center gap-1.5 flex-1")}>
                    find your type <ArrowRight size={15} strokeWidth={2} />
                  </Link>
                  <Link href="/login" onClick={close} className={cn(buttonVariants({ variant: "outline" }), "rounded-full font-medium flex items-center gap-1.5")}>
                    <LogIn size={15} strokeWidth={2} /> Log in
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
