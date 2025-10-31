"use client";

import { useCurrentUser } from "@/services/supabase/hooks/useCurrentUser";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "@/services/supabase/components/logout-button";

export default function Navbar() {
  const { user, isLoading } = useCurrentUser();

  return (
    <div className="border-b border-foreground shadow-md shadow-foreground bg-background h-header z-999">
      <nav className="container mx-auto px-4 flex justify-between items-center h-full gap-4">
        <Link href="/" className="text-xl font-bold">
          typecircle
        </Link>

        {isLoading || user == null ? (
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-sm text-muted-foreground flex flex-col">
                {user.user_metadata?.preferred_username || user.email}
              </span>
              <span className="text-xs italic opacity-[50%] text-muted-foreground flex flex-col">
                {user.id === user.user_metadata?.preferred_username
                  ? null
                  : user.id}
              </span>
            </div>
            <LogoutButton />
          </div>
        )}
      </nav>
    </div>
  );
}
