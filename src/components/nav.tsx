// src/components/nav.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// mobile nav uses inline icons; no sheet required
import { cn } from "@/lib/utils";
import { createClient } from "@/services/supabase/client";
import { signOut } from "@/services/supabase/auth";
import {
  Compass,
  Users,
  BookOpen,
  Newspaper,
  ArrowRight,
  Menu,
  LogIn,
  LogOut,
  User as UserIcon,
  Settings,
  ChevronDown,
} from "lucide-react";

const baseLinks = [
  { href: "/community", label: "community", icon: Users },
  { href: "/types", label: "types", icon: Compass },
  { href: "/resources", label: "resources", icon: BookOpen },
];

const feedLink = { href: "/feed", label: "feed", icon: Newspaper };

export function Nav() {
  const pathname = usePathname();
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

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) loadProfile(session.user.id);
        else {
          setUsername(null);
          setAvatarUrl(null);
          setLoading(false);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = username ? username.slice(0, 2).toUpperCase() : "?";
  const links = username ? [feedLink, ...baseLinks] : baseLinks;

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
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center gap-1.5 text-sm font-medium lowercase transition-colors",
                  isActive
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-ink)]/70 hover:text-[var(--color-accent)]",
                )}
              >
                <Icon
                  size={16}
                  strokeWidth={2}
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-ink)]/50 group-hover:text-[var(--color-accent)]",
                  )}
                />
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
                className={cn(
                  "flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-transparent transition-colors",
                  menuOpen
                    ? "bg-[var(--color-accent)]/12"
                    : "border-black/10 hover:bg-black/[0.03]",
                )}
              >
                <Avatar className="w-7 h-7">
                  <AvatarImage src={avatarUrl ?? ""} alt={username} />
                  <AvatarFallback className="bg-[var(--color-accent)] text-[var(--color-paper)] text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-[var(--color-ink)]/70 max-w-[120px] truncate">
                  {username}
                </span>
                <ChevronDown
                  size={14}
                  strokeWidth={2.5}
                  className={cn(
                    "text-[var(--color-ink)]/40 transition-transform duration-200",
                    menuOpen && "rotate-180",
                  )}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-black/5 bg-[var(--color-paper)] shadow-xl py-2 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={avatarUrl ?? ""} alt={username} />
                      <AvatarFallback className="bg-[var(--color-accent)] text-[var(--color-paper)] text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-semibold truncate">{username}</p>
                  </div>

                  <div className="h-px bg-black/5 mx-2 my-1" />

                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 mx-2 px-2.5 py-2.5 rounded-lg text-sm text-[var(--color-ink)]/80 hover:bg-black/5 transition-colors"
                  >
                    <UserIcon size={16} strokeWidth={2} /> Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 mx-2 px-2.5 py-2.5 rounded-lg text-sm text-[var(--color-ink)]/80 hover:bg-black/5 transition-colors"
                  >
                    <Settings size={17} strokeWidth={2} /> Settings
                  </Link>

                  <div className="h-px bg-black/5 mx-2 my-1" />

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-3 mx-2 px-2.5 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    style={{ width: "calc(100% - 1rem)" }}
                  >
                    <LogOut size={16} strokeWidth={2} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
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
                find your type <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile nav: show 4 icons inline; only profile/avatar toggles popup */}
        <div className="md:hidden flex items-center gap-3">
          {links && (
            <>
              {/* choose mobile icons: feed (if present) or types, then community, then resources */}
              {(() => {
                const typesLink = baseLinks[0];
                const communityLink = baseLinks[1];
                const resourcesLink = baseLinks[2];
                // mobile icons: feed, types, community, resources
                const mobileIcons = [
                  feedLink,
                  typesLink,
                  communityLink,
                  resourcesLink,
                ];
                return mobileIcons.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors",
                        isActive ? "bg-[var(--color-accent)]/12" : "",
                      )}
                    >
                      <Icon
                        size={18}
                        strokeWidth={2}
                        className={
                          isActive
                            ? "text-[var(--color-accent)]"
                            : "text-[var(--color-ink)]/60"
                        }
                      />
                    </Link>
                  );
                });
              })()}

              {/* profile avatar toggles popup on mobile */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={avatarUrl ?? ""}
                      alt={username ?? "profile"}
                    />
                    <AvatarFallback className="bg-[var(--color-accent)] text-[var(--color-paper)] text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-black/5 bg-[var(--color-paper)] shadow-xl py-2 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <Avatar className="w-9 h-9">
                        <AvatarImage
                          src={avatarUrl ?? ""}
                          alt={username ?? ""}
                        />
                        <AvatarFallback className="bg-[var(--color-accent)] text-[var(--color-paper)] text-xs font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-semibold truncate">
                        {username}
                      </p>
                    </div>

                    <div className="h-px bg-black/5 mx-2 my-1" />

                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 mx-2 px-2.5 py-2.5 rounded-lg text-sm text-[var(--color-ink)]/80 hover:bg-black/5 transition-colors"
                    >
                      <UserIcon size={16} strokeWidth={2} /> Profile
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 mx-2 px-2.5 py-2.5 rounded-lg text-sm text-[var(--color-ink)]/80 hover:bg-black/5 transition-colors"
                    >
                      <Settings size={17} strokeWidth={2} /> Settings
                    </Link>

                    <div className="h-px bg-black/5 mx-2 my-1" />

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-3 mx-2 px-2.5 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={16} strokeWidth={2} /> Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
