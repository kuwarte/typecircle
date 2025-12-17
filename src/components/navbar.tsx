"use client";

import { useCurrentUser } from "@/services/supabase/hooks/useCurrentUser";
import Link from "next/link";
import { ModeToggle } from "./toggle-theme-btn";
import { FaRegCircle } from "react-icons/fa";
import { UserProfileModal } from "./user-profile";
import { Button } from "./ui/button";
import { Edit3, Home, MessageCircle, Menu, X, BookOpen } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, isLoading } = useCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="glass-navbar backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center text-xl font-semibold gap-2 text-foreground transition-colors duration-200"
          >
            <FaRegCircle
              size={20}
              className="text-[var(--typecircle-green)]"
            />
            <span>typecircle</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/" icon={<Home className="w-4 h-4" />}>Home</NavLink>
            <NavLink href="/enneagram/test" icon={<Edit3 className="w-4 h-4" />}>Assessment</NavLink>
            <NavLink href="/enneagram/faq" icon={<BookOpen className="w-4 h-4" />}>Guide</NavLink>
            {user && (
              <NavLink href="/rooms" icon={<MessageCircle className="w-4 h-4" />}>Community</NavLink>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading || !user ? (
              <Button asChild className="glass-button">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            ) : (
              <UserProfileModal user={user} />
            )}
            <ModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-navbar border-t border-border">
            <div className="container mx-auto px-4 py-4 space-y-2">
              <MobileNavLink href="/" icon={<Home className="w-4 h-4" />} onClick={() => setMobileMenuOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink href="/enneagram/test" icon={<Edit3 className="w-4 h-4" />} onClick={() => setMobileMenuOpen(false)}>
                Assessment
              </MobileNavLink>
              <MobileNavLink href="/enneagram/faq" icon={<BookOpen className="w-4 h-4" />} onClick={() => setMobileMenuOpen(false)}>
                Guide
              </MobileNavLink>
              {user && (
                <MobileNavLink href="/rooms" icon={<MessageCircle className="w-4 h-4" />} onClick={() => setMobileMenuOpen(false)}>
                  Community
                </MobileNavLink>
              )}
              <div className="pt-4 border-t border-border">
                {isLoading || !user ? (
                  <Button asChild className="w-full glass-button">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                  </Button>
                ) : (
                  <div className="w-full">
                    <UserProfileModal user={user} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground
                 transition-colors duration-200
                 hover:text-foreground hover:bg-muted/50
                 rounded-lg"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function MobileNavLink({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-base font-medium text-muted-foreground
                 transition-colors duration-200
                 hover:text-foreground hover:bg-muted/50
                 rounded-lg w-full"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
