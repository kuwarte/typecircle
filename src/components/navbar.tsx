"use client";

import { useCurrentUser } from "@/services/supabase/hooks/useCurrentUser";
import Link from "next/link";
import { ModeToggle } from "./toggle-theme-btn";
import { FaRegCircle } from "react-icons/fa";
import { UserProfileModal } from "./user-profile";
import { Button } from "./ui/button";
import { Edit3, Home, MessageCircle } from "lucide-react";

export default function Navbar() {
  const { user, isLoading } = useCurrentUser();

  return (
    <header className="fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="bg-card/60 backdrop-blur-md outline outline-card-border">
        <div className="container mx-auto px-4 h-header flex justify-between items-center">
          <Link
            href="/"
            className="hidden md:flex items-center text-xl font-bold gap-1"
            style={{ color: "var(--typecircle-green)" }}
          >
            <FaRegCircle
              size={28}
              className="text-card-foreground underline"
              style={{ color: "var(--green)" }}
            />
            <span className="underline decoration-wavy decoration-2 underline-offset-6 mb-2">
              typecircle
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isLoading || !user ? (
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            ) : (
              <UserProfileModal user={user} />
            )}
            <ModeToggle />
          </div>
        </div>
      </div>

      <div className="bg-card/50 backdrop-blur-md border-t border-border">
        <div className="container mx-auto md:px-10 h-8 flex justify-start items-center">
          <AnimatedLink href="/">
            <Home className="w-4 h-4" />
            Home
          </AnimatedLink>
          <AnimatedLink href="/enneagram/test">
            <Edit3 className="w-4 h-4" />
            Test
          </AnimatedLink>
          {user && (
            <AnimatedLink href="/rooms">
              <MessageCircle className="w-4 h-4" />
              Chat
            </AnimatedLink>
          )}
        </div>
      </div>
    </header>
  );
}

export function AnimatedLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center gap-2 h-full px-6 text-sm font-medium text-card-foreground 
                 transition-colors duration-150 
                 hover:bg-[var(--typecircle-green)]/20 hover:text-foreground 
                 rounded-none m-0"
    >
      {children}
    </Link>
  );
}
