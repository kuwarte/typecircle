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
    LogOut,
    User as UserIcon,
    Settings,
    ChevronDown,
    Sparkles,
    ListChecks,
} from "lucide-react";

const baseLinks = [
    { href: "/types", label: "types", icon: Compass },
    { href: "/community", label: "community", icon: Users },
    { href: "/resources", label: "resources", icon: BookOpen },
];

const feedLink = { href: "/feed", label: "feed", icon: Newspaper };

export function Nav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Auth state (is there a session at all) is tracked separately from
    // onboarding completeness (username set). This is what lets the avatar
    // show up the moment someone's logged in, even mid-onboarding — before,
    // everything below keyed off `username`, so a logged-in-but-not-yet-
    // onboarded user looked identical to a logged-out visitor.
    const [userId, setUserId] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const close = () => setOpen(false);
    const desktopMenuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const supabase = createClient();

        async function loadProfile(uid: string, email?: string | null) {
            setUserId(uid);
            setUserEmail(email ?? null);

            // maybeSingle (not single) — pre-onboarding this row may not have
            // username/avatar populated yet, and shouldn't be treated as an error.
            const { data: profile } = await supabase
                .from("profiles")
                .select("username, avatar_url")
                .eq("id", uid)
                .maybeSingle();

            setUsername(profile?.username ?? null);
            setAvatarUrl(profile?.avatar_url ?? null);
            setLoading(false);
        }

        function resetAuthState() {
            setUserId(null);
            setUserEmail(null);
            setUsername(null);
            setAvatarUrl(null);
            setLoading(false);
        }

        function refetchCurrentProfile() {
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user) loadProfile(session.user.id, session.user.email);
            });
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) loadProfile(session.user.id, session.user.email);
            else resetAuthState();
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session?.user) loadProfile(session.user.id, session.user.email);
                else resetAuthState();
            },
        );

        // Auth state alone doesn't change when onboarding finishes (the user
        // is already signed in), so pages that write to `profiles` dispatch
        // this event afterwards and the nav refetches to pick up the new
        // username/avatar without a hard reload.
        window.addEventListener("profile-updated", refetchCurrentProfile);

        return () => {
            listener.subscription.unsubscribe();
            window.removeEventListener("profile-updated", refetchCurrentProfile);
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            const target = e.target as Node;
            const insideDesktop = desktopMenuRef.current?.contains(target);
            const insideMobile = mobileMenuRef.current?.contains(target);
            if (!insideDesktop && !insideMobile) setMenuOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isLoggedIn = !!userId;
    const isOnboarded = !!username;

    const initials = username
        ? username.slice(0, 2).toUpperCase()
        : userEmail
            ? userEmail.slice(0, 2).toUpperCase()
            : "?";

    // Feed only makes sense (and is only reachable) once onboarding is done,
    // so it stays out of the link list until then.
    const links = isOnboarded ? [feedLink, ...baseLinks] : baseLinks;

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
                    ) : isLoggedIn ? (
                        <>
                            {isOnboarded ? (
                                <Link
                                    href="/quiz"
                                    className={cn(
                                        buttonVariants(),
                                        "rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 font-medium lowercase flex items-center gap-1.5",
                                    )}
                                >
                                    discover your type <ArrowRight size={16} strokeWidth={2} />
                                </Link>
                            ) : (
                                <Link
                                    href="/onboarding"
                                    className={cn(
                                        buttonVariants(),
                                        "rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 font-medium lowercase flex items-center gap-1.5",
                                    )}
                                >
                                    finish setting up <ArrowRight size={16} strokeWidth={2} />
                                </Link>
                            )}

                            <div className="relative" ref={desktopMenuRef}>
                                <button
                                    onClick={() => setMenuOpen((v) => !v)}
                                    aria-label="Account menu"
                                    className={cn(
                                        "flex items-center gap-1 pl-1 pr-1.5 py-1 rounded-full border border-transparent transition-colors",
                                        menuOpen
                                            ? "bg-[var(--color-accent)]/12"
                                            : "border-black/10 hover:bg-black/[0.03]",
                                    )}
                                >
                                    <Avatar className="w-7 h-7">
                                        <AvatarImage
                                            src={avatarUrl ?? ""}
                                            alt={username ?? "profile"}
                                        />
                                        <AvatarFallback className="bg-[var(--color-accent)] text-[var(--color-paper)] text-xs font-semibold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
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
                                                <AvatarImage
                                                    src={avatarUrl ?? ""}
                                                    alt={username ?? "profile"}
                                                />
                                                <AvatarFallback className="bg-[var(--color-accent)] text-[var(--color-paper)] text-xs font-semibold">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <p className="text-sm font-semibold truncate">
                                                {isOnboarded ? username : (userEmail ?? "Welcome")}
                                            </p>
                                        </div>

                                        <div className="h-px bg-black/5 mx-2 my-1" />

                                        {isOnboarded ? (
                                            <>
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
                                            </>
                                        ) : (
                                            // Profile/Settings are locked until onboarding is
                                            // done (the proxy would just bounce back here
                                            // anyway), so surface a single clear way forward.
                                            <Link
                                                href="/onboarding"
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center gap-3 mx-2 px-2.5 py-2.5 rounded-lg text-sm text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-colors"
                                            >
                                                <ListChecks size={16} strokeWidth={2} /> Finish
                                                onboarding
                                            </Link>
                                        )}

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
                        </>
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
                                discover your type <ArrowRight size={16} strokeWidth={2} />
                            </Link>
                        </>
                    )}
                </div>

                <div className="md:hidden flex items-center gap-1.5">
                    {links && (
                        <>
                            {/* choose mobile icons: feed (if present) or types, then community, then resources */}
                            {(() => {
                                const typesLink = baseLinks[0];
                                const communityLink = baseLinks[1];
                                const resourcesLink = baseLinks[2];
                                // mobile icons: feed (if onboarded), types, community, resources
                                const mobileIcons = isOnboarded
                                    ? [feedLink, typesLink, communityLink, resourcesLink]
                                    : [typesLink, communityLink, resourcesLink];
                                return mobileIcons.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={cn(
                                                "flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 transition-colors",
                                                isActive ? "bg-[var(--color-accent)]/12" : "",
                                            )}
                                        >
                                            <Icon
                                                size={16}
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

                            {/* discover your type / finish onboarding — persistent on
          mobile. Icon-only (not a text pill) so it sits comfortably
          among the other nav icons instead of competing for width. */}
                            <Link
                                href={isLoggedIn && !isOnboarded ? "/onboarding" : "/quiz"}
                                aria-label={
                                    isLoggedIn && !isOnboarded
                                        ? "Finish onboarding"
                                        : "Discover your type"
                                }
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 transition-colors shrink-0"
                            >
                                <Sparkles size={14} strokeWidth={2} />
                            </Link>

                            {/* profile avatar toggles popup on mobile — only rendered
          once we know whether there's a session, so a logged-out
          visitor doesn't briefly see an empty "?" avatar */}
                            {!loading && isLoggedIn && (
                                <div className="relative" ref={mobileMenuRef}>
                                    <button
                                        onClick={() => setMenuOpen((v) => !v)}
                                        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 transition-colors"
                                    >
                                        <Avatar className="w-7 h-7">
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
                                                        alt={username ?? "profile"}
                                                    />
                                                    <AvatarFallback className="bg-[var(--color-accent)] text-[var(--color-paper)] text-xs font-semibold">
                                                        {initials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <p className="text-sm font-semibold truncate">
                                                    {isOnboarded ? username : (userEmail ?? "Welcome")}
                                                </p>
                                            </div>

                                            <div className="h-px bg-black/5 mx-2 my-1" />

                                            {isOnboarded ? (
                                                <>
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
                                                </>
                                            ) : (
                                                <Link
                                                    href="/onboarding"
                                                    onClick={() => setMenuOpen(false)}
                                                    className="flex items-center gap-3 mx-2 px-2.5 py-2.5 rounded-lg text-sm text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-colors"
                                                >
                                                    <ListChecks size={16} strokeWidth={2} /> Finish
                                                    onboarding
                                                </Link>
                                            )}

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
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
