"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function ChatButton() {
  return (
    <Link href="/rooms" passHref>
      <Button size="sm" variant="default" className="flex items-center gap-2">
        <MessageCircle className="w-4 h-4" />
        <p className="hidden md:inline">Chat</p>
      </Button>
    </Link>
  );
}
