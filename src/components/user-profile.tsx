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

export function UserProfileModal({ user }: { user: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <User2Icon className="w-4 h-4" />
          <p className="md:inline">Profile</p>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-card/95">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Your current account details and information.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          {user.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="Profile Image"
              width={80}
              height={80}
              className="rounded-full border"
            />
          ) : (
            <div className="size-20 rounded-full border flex items-center justify-center bg-muted">
              <User2Icon className="w-10 h-10 text-muted-foreground" />
            </div>
          )}

          <div className="flex flex-col items-center text-center">
            <span className="text-sm text-muted-foreground flex flex-col">
              {user.user_metadata?.preferred_username || user.email}
            </span>
            <span className="md:text-xs text-[10px] italic opacity-60 text-muted-foreground flex flex-col">
              {user.id === user.user_metadata?.preferred_username
                ? null
                : user.id}
            </span>
          </div>

          <div className="flex gap-2 mt-4">
            <LogoutButton />
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
