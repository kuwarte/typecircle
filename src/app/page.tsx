import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { MessagesSquareIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
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
