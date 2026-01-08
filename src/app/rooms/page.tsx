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
import { FaPlus } from "react-icons/fa";
import RoomsLoading from "@/components/rooms-loading";
import type { Metadata } from "next";
import RoomList from "@/components/room-list";

export const metadata: Metadata = {
  title: "Community Rooms | TypeCircle",
  description:
    "Join discussion rooms with people of similar Enneagram types. Share experiences, get support, and grow together in a supportive community environment.",
  keywords: [
    "enneagram community",
    "personality type discussions",
    "support groups",
    "personal growth community",
  ],
  openGraph: {
    title: "Join Enneagram Community Rooms | TypeCircle",
    description:
      "Connect with others who share your Enneagram type. Engage in meaningful discussions and support each other's personal growth journey.",
  },
};

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
      <div className="container mx-auto max-w-3xl px-1 md:px-4 py-8 space-y-8">
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
    <div className="bg-gradient-to-t from-muted/90 via-background/30 to-background">
      <div className="min-h-screen py-8 bg-gradient-to-b from-muted/10 via-background/30 to-background">
        <div className="container mx-auto px-2 md:px-6 max-w-7xl ">
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
    </div>
  );
}

async function getPublicRooms() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("chat_room")
    .select("id, name, tags, is_public, chat_room_member (count)")
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
    isPublic: room.is_public,
  }));
}

async function getJoinedRooms(userId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("chat_room")
    .select("id, name, tags, is_public, chat_room_member (member_id)")
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
      isPublic: room.is_public,
    }));
}
