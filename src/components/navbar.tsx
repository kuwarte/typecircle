"use client";

import { useCurrentUser } from "@/services/supabase/hooks/useCurrentUser";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "@/services/supabase/components/logout-button";
import { ModeToggle } from "./toggle-theme-btn";
import { FaRegCircle } from "react-icons/fa";
import { UserProfileModal } from "./user-profile";
import { ChatButton } from "./chat-button";
import { HomeButton } from "./home-button";
import { TypeButton } from "./type-button";

export default function Navbar() {
  const { user, isLoading } = useCurrentUser();

  return (
    <>
      <div className="fixed shadow-lg bg-card/50 h-header outline outline-card-border z-999 w-full">
        <nav className="container mx-auto md:px-4 flex justify-between items-center h-full gap-4">
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

          {isLoading || !user ? (
            <div className="flex items-center w-full justify-between md:justify-end gap-2">
              <div className="flex items-center gap-2">
                <HomeButton />
                <TypeButton />
              </div>

              <div className="flex items-center gap-2">
                <Button asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <ModeToggle />
              </div>
            </div>
          ) : (
            <div className="flex items-center w-full justify-between md:justify-end gap-2">
              <div className="flex items-center gap-2">
                <HomeButton />
                <TypeButton />
                <ChatButton />
                <UserProfileModal user={user} />
              </div>

              <div>
                <ModeToggle />
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* <div className="md:hidden fixed top-0 left-0 right-0 z-999 bg-card/80 backdrop-blur-md border-t border-card-border flex justify-center items-center h-14">
        {user ? (
          <>
            <HomeButton />
            <TypeButton />
            <ChatButton />
            <UserProfileModal user={user} />
          </>
        ) : (
          <Button asChild className="w-full">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        )}
      </div> */}
    </>
  );
}
