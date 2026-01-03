import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-primary/50 bg-gradient-to-r from-primary/20 to-primary/10 text-primary-foreground [a&]:hover:from-primary/30 [a&]:hover:to-primary/20",
        secondary:
          "border-outline/50 bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary-foreground [a&]:hover:from-secondary/30 [a&]:hover:to-secondary/20",
        destructive:
          "border-destructive/50 bg-gradient-to-r from-destructive/20 to-destructive/10 text-white [a&]:hover:from-destructive/30 [a&]:hover:to-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-white/20 bg-transparent text-foreground [a&]:hover:bg-white/10 dark:border-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
