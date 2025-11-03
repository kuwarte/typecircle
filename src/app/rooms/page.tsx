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
import { MessagesSquareIcon } from "lucide-react";
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

export default async function Rooms() {
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
    <div className="container mx-auto md:px-8 py-16 space-y-8">
      <div className="min-h-[calc(100vh-14rem)] bg-card/50 backdrop-blur-md shadow-md p-6">
        <div className="outline outline-card-border p-6 space-y-8">
          <RoomList title="Your Rooms" rooms={joinedRooms} isJoined />
          <RoomList
            title="Public Rooms"
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Button asChild>
          <Link href="/rooms/new">
            <FaPlus />
            Create Room
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {rooms.map((room) => (
          <RoomCard {...room} key={room.id} isJoined={isJoined} />
        ))}
      </div>
    </div>
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
    <Card className="bg-card/5 rounded-md">
      <CardHeader>
        <CardTitle>
          <h3
            className="text-lg text-shadow-md capitalize font-semibold"
            style={{ color: "var(--typecircle-green)" }}
          >
            {name}
          </h3>
        </CardTitle>
        <CardDescription className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="px-2 py-1 rounded-sm">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </Badge>

          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="px-2 py-1 rounded-sm capitalize"
            >
              {tag}
            </Badge>
          ))}
        </CardDescription>
      </CardHeader>
      <CardFooter className="gap-2">
        {isJoined ? (
          <>
            <Button asChild className="grow outline" size="sm">
              <Link href={`/rooms/${id}`}>Enter</Link>
            </Button>
            <LeaveRoomButton
              className="rounded-sm"
              roomId={id}
              size="sm"
              variant="default"
            >
              Leave
            </LeaveRoomButton>
          </>
        ) : (
          <JoinRoomButton
            roomId={id}
            variant="outline"
            className="grow"
            size="sm"
          >
            Join
          </JoinRoomButton>
        )}
      </CardFooter>
    </Card>
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
