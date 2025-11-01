"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";

export function TypeButton() {
  return (
    <Link href="/enneagram/test" passHref>
      <Button size="sm" variant="default" className="flex items-center gap-2">
        <Edit3 className="w-4 h-4" />
        Type
      </Button>
    </Link>
  );
}
