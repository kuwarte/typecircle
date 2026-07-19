"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar"
      className={cn("relative flex size-8 shrink-0 rounded-full overflow-hidden select-none", className)}
      {...props}
    />
  );
}

function AvatarImage({ className, src, alt, ...props }: React.ComponentProps<"img">) {
  const [error, setError] = React.useState(false);
  if (!src || error) return null;
  return (
    <img
      data-slot="avatar-image"
      src={src as string}
      alt={alt}
      onError={() => setError(true)}
      className={cn("aspect-square size-full rounded-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn("flex size-full items-center justify-center rounded-full bg-muted text-sm", className)}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
