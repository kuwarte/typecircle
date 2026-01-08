"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { User2Icon } from "lucide-react";
import { LogoutButton } from "@/services/supabase/components/logout-button";
import { EnneagramBadge } from "./enneagram-badge";

export function UserProfileModal({
  user,
}: {
  user: any & { enneagram_type?: number };
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="glass-button gap-2 w-full md:w-auto">
          {user.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="Profile"
              width={20}
              height={20}
              className="rounded-full"
            />
          ) : (
            <User2Icon className="w-4 h-4" />
          )}
          <span className="font-medium">
            {user.user_metadata?.preferred_username?.split(" ")[0] || "Profile"}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white dark:bg-transparent backdrop-blur-xl border border-border text-foreground">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--typecircle-green)]/10 to-white dark:from-transparent dark:to-transparent pointer-events-none rounded-lg" />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xl hidden dark:block pointer-events-none rounded-lg" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--typecircle-green)]/30 to-bg-background hidden dark:block pointer-events-none rounded-lg" />

        <div className="relative z-10">
          <DialogHeader className="text-center pb-6">
            <DialogTitle className="text-xl font-semibold text-foreground dark:text-foreground">
              Profile
            </DialogTitle>
            <DialogDescription className="text-foreground/70 dark:text-muted-foreground">
              Your account information and settings
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-4">
            <div className="relative">
              {user.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="Profile Image"
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-[var(--typecircle-green)]/20"
                />
              ) : (
                <div className="size-20 rounded-full border-4 border-[var(--typecircle-green)]/20 flex items-center justify-center bg-gradient-to-br from-[var(--typecircle-green)]/80 to-blue-500/80">
                  <User2Icon className="w-8 h-8 text-[var(--typecircle-green)]" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground dark:text-foreground">
                {user.user_metadata?.preferred_username ||
                  user.email?.split("@")[0] ||
                  "User"}
              </h3>
              <p className="text-sm text-foreground/60 dark:text-muted-foreground">
                {user.email}
              </p>
              <p className="text-xs text-foreground/40 dark:text-muted-foreground/60 font-mono">
                ID: {user.id}
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--typecircle-green)]/10 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs font-medium text-[var(--typecircle-green)]">
                    Active
                  </span>
                </div>
                {user.enneagram_type && (
                  <EnneagramBadge type={user.enneagram_type} />
                )}
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground dark:text-foreground">
                    Member since
                  </span>
                  <span className="text-sm text-foreground/60 dark:text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <LogoutButton className="flex-1" />
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="bg-muted/30 hover:bg-muted/50 flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
