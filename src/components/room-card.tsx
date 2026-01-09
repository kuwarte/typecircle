"use client";

import { Button } from "@/components/ui/button";
import { UserCheck, Globe } from "lucide-react";
import Link from "next/link";
import { LeaveRoomButton } from "@/components/leave-room-btn";
import { JoinRoomButton } from "@/components/join-room-btn";
import { Badge } from "@/components/ui/badge";

export default function RoomCard({
  id,
  name,
  memberCount,
  tags,
  isJoined,
  isPublic = false,
}: {
  id: string;
  name: string;
  memberCount: number;
  tags: string[];
  isJoined: boolean;
  isPublic?: boolean;
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="border border-zinc-400/50 dark:border-border dark:hover:bg-[var(--typecircle-green)]/5 rounded-2xl p-6 transition-all duration-200 flex flex-col h-full shadow-xl">
        <div className="mb-4 flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold capitalize text-[var(--typecircle-green)]">
              {name}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              {isPublic && (
                <Badge className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--typecircle-green)]/20 text-[var(--typecircle-green)] border-[var(--typecircle-green)]/30">
                  <Globe className="w-3 h-3" />
                </Badge>
              )}

              {isJoined && (
                <Badge className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--typecircle-green)]/20 text-[var(--typecircle-green)] border-[var(--typecircle-green)]/30 flex items-center gap-1.5 shrink-0">
                  <UserCheck className="w-3 h-3" />
                </Badge>
              )}

              <Badge className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--typecircle-green)]/20 text-[var(--typecircle-green)] border-[var(--typecircle-green)]/30">
                {memberCount} {memberCount === 1 ? "member" : "members"}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="px-2 py-1 rounded-lg text-xs capitalize border-muted-foreground/30"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge
                variant="outline"
                className="px-2 py-1 rounded-lg text-xs border-muted-foreground/30"
              >
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          {isJoined ? (
            <>
              <Button
                asChild
                variant="ghost"
                className="
  flex-1
  bg-transparent
  text-[var(--typecircle-green)]
  hover:bg-[var(--typecircle-green)]/10
  hover:text-[var(--typecircle-green)]
  border-none
  shadow-none
"
                size="sm"
              >
                <Link href={`/rooms/${id}`}>Enter Room</Link>
              </Button>
              <LeaveRoomButton
                className="glass-subtle"
                roomId={id}
                size="sm"
                variant="ghost"
              >
                Leave
              </LeaveRoomButton>
            </>
          ) : (
            <JoinRoomButton
              roomId={id}
              className="
  flex-1
  bg-transparent
  text-[var(--typecircle-green)]
  hover:bg-[var(--typecircle-green)]/10
  hover:text-[var(--typecircle-green)]
  border-none
  shadow-none
"
              size="sm"
            >
              {isPublic ? "Join Public Room" : "Join Room"}
            </JoinRoomButton>
          )}
        </div>
      </div>
    </div>
  );
}
