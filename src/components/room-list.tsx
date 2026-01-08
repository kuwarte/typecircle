"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MessageCircle, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RoomCard from "./room-card";

export default function RoomList({
  title,
  rooms,
  isJoined = false,
}: {
  title: string;
  rooms: {
    id: string;
    name: string;
    memberCount: number;
    tags: string[];
    isPublic?: boolean;
  }[];
  isJoined?: boolean;
}) {
  if (rooms.length === 0) return null;

  const icon = isJoined ? (
    <UserCheck className="w-6 h-6 text-[var(--typecircle-green)]" />
  ) : (
    <MessageCircle className="w-6 h-6 text-[var(--typecircle-green)]" />
  );
  const subtitle = isJoined
    ? "Rooms you've joined and actively participate in"
    : "Explore and join new communities based on your interests";

  const showNavigation = rooms.length > 2;

  return (
    <section className="space-y-8">
      <div className="glass-card-only rounded-2xl px-6 py-12 border border-border/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className=" flex-shrink-0 w-12 h-12 rounded-full bg-[var(--typecircle-green)]/10 border border-[var(--typecircle-green)]/20 flex items-center justify-center">
              {icon}
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-foreground">{title}</h2>
              </div>
              <p className="hidden md:flex text-sm text-muted-foreground italic">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:hidden">
        {rooms.map((room) => (
          <RoomCard {...room} key={room.id} isJoined={isJoined} />
        ))}
      </div>

      <div className="hidden md:block glass-card-only rounded-2xl px-6 py-12 border border-border/50">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 px-4 py-6">
            {rooms.map((room) => (
              <CarouselItem
                key={room.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1 h-full">
                  <div className="h-full">
                    <RoomCard
                      {...room}
                      isJoined={isJoined}
                      isPublic={room.isPublic}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="relative mt-8">
            <CarouselPrevious
              className={`
              absolute left-0 -translate-y-1/2 glass-button border-border hover:bg-accent
              ${showNavigation ? "" : "hidden opacity-0 pointer-events-none"}
            `}
            />
            <CarouselNext
              className={`
              absolute right-0 -translate-y-1/2 glass-button border-border hover:bg-accent
              ${showNavigation ? "" : "hidden opacity-0 pointer-events-none"}
            `}
            />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
