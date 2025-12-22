import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getCurrentUser } from "@/services/supabase/lib/getCurrentUser";
import { createAdminClient } from "@/services/supabase/server";
import { MessagesSquareIcon, MessageCircle, Edit3 } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeaveRoomButton } from "@/components/leave-room-btn";
import { JoinRoomButton } from "@/components/join-room-btn";
import { FaPlus } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import RoomsLoading from "@/components/rooms-loading";

export default function Rooms() {
  return (
    <Suspense fallback={<RoomsLoading />}>
      <RoomsContent />
    </Suspense>
  );
}

async function RoomsContent() {
  const user = await getCurrentUser();
  if (user == null) {
    redirect("/auth/login");
  }

  const [publicRooms, joinedRooms] = await Promise.all([
    getPublicRooms(),
    getJoinedRooms(user.id),
  ]);

  if (publicRooms.length === 0 && joinedRooms.length === 0) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 space-y-8">
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia>
              <MessagesSquareIcon />
            </EmptyMedia>
            <EmptyTitle>No Chat Rooms</EmptyTitle>
            <EmptyDescription>
              Create a new chat room to get starter
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="rooms/new">Create Room</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background via-background to-muted/10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="glass-card rounded-3xl p-8 mb-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--typecircle-green)]/5 via-transparent to-blue-500/5 pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-[var(--typecircle-green)]/10 border-2 border-[var(--typecircle-green)]/20">
              <MessageCircle className="w-8 h-8 text-[var(--typecircle-green)]" />
            </div>
            <h1 className="text-3xl font-semibold mb-4 text-foreground">
              Community Rooms
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with like-minded individuals who share your personality
              type. Join existing conversations or create your own space for
              meaningful discussions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/rooms/new"
                className="glass-button px-6 py-3 rounded-xl font-medium transition-all duration-200 inline-flex items-center gap-2"
              >
                <FaPlus className="text-sm" />
                Create New Room
              </Link>
              <Link
                href="/enneagram/test"
                className="glass-subtle px-6 py-3 rounded-xl font-medium transition-all duration-200 inline-flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Take Assessment
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-16">
          <RoomList title="Your Rooms" rooms={joinedRooms} isJoined />
          <RoomList
            title="Discover New Communities"
            rooms={publicRooms.filter(
              (room) => !joinedRooms.some((r) => r.id === room.id)
            )}
          />
        </div>
      </div>
    </div>
  );
}

function RoomList({
  title,
  rooms,
  isJoined = false,
}: {
  title: string;
  rooms: { id: string; name: string; memberCount: number; tags: string[] }[];
  isJoined?: boolean;
}) {
  if (rooms.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-3">
        {title}
      </h2>

      <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
        {rooms.map((room) => (
          <RoomCard {...room} key={room.id} isJoined={isJoined} />
        ))}
      </div>
    </section>
  );
}
function RoomCard({
  id,
  name,
  memberCount,
  tags,
  isJoined,
}: {
  id: string;
  name: string;
  memberCount: number;
  tags: string[];
  isJoined: boolean;
}) {
  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-200 hover:bg-white/5 flex flex-col h-full">
      <div className="mb-4 flex-1">
        <h3 className="text-lg font-semibold capitalize mb-2 text-[var(--typecircle-green)]">
          {name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <Badge
            variant="secondary"
            className="px-3 py-1 rounded-full text-xs font-medium"
          >
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </Badge>
          {isJoined && (
            <Badge className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--typecircle-green)]/20 text-[var(--typecircle-green)] border-[var(--typecircle-green)]/30">
              Joined
            </Badge>
          )}
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
            <Button asChild className="flex-1 glass-button" size="sm">
              <Link href={`/rooms/${id}`}>Enter Room</Link>
            </Button>
            <LeaveRoomButton
              className="glass-subtle"
              roomId={id}
              size="sm"
              variant="outline"
            >
              Leave
            </LeaveRoomButton>
          </>
        ) : (
          <JoinRoomButton roomId={id} className="w-full glass-button" size="sm">
            Join Room
          </JoinRoomButton>
        )}
      </div>
    </div>
  );
}

async function getPublicRooms() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("chat_room")
    .select("id, name, tags, chat_room_member (count)")
    .eq("is_public", true)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((room) => ({
    id: room.id,
    name: room.name,
    memberCount: room.chat_room_member?.[0]?.count ?? 0,
    tags: room.tags ?? [],
  }));
}

async function getJoinedRooms(userId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("chat_room")
    .select("id, name, tags, chat_room_member (member_id)")
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as any[])
    .filter((room) =>
      (room.chat_room_member ?? []).some((u: any) => u.member_id === userId)
    )
    .map((room) => ({
      id: room.id,
      name: room.name,
      memberCount: (room.chat_room_member ?? []).length,
      tags: room.tags ?? [],
    }));
}
