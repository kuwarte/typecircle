"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export function HomeButton() {
  return (
    <Link href="/" passHref>
      <Button size="sm" variant="default" className="flex items-center gap-2">
        <Home className="w-4 h-4" />
        Home
      </Button>
    </Link>
  );
}
