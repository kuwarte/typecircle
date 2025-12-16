import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[.98] hover:shadow-xl active:shadow-none glass",
  {
    variants: {
      variant: {
        default:
          "border-0 bg-transparent hover:bg-gradient-to-br hover:from-white/25 hover:to-white/10 text-foreground hover:scale-[1.02]",
        destructive:
          "bg-gradient-to-br from-destructive/90 to-destructive/70 text-white hover:from-destructive hover:to-destructive/80 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 border-0 hover:scale-[1.02] shadow-lg",
        outline:
          "border-2 border-white/20 bg-transparent hover:border-white/30 hover:bg-white/5 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/5 text-foreground hover:scale-[1.02]",
        secondary:
          "bg-gradient-to-br from-secondary/90 to-secondary/70 text-secondary-foreground hover:from-secondary hover:to-secondary/80 border-0 hover:scale-[1.02] shadow-lg",
        ghost:
          "hover:bg-gradient-to-br hover:from-white/15 hover:to-white/5 dark:hover:from-white/8 dark:hover:to-white/3 border-0 hover:scale-[1.02]",
        link: "text-primary underline-offset-4 hover:underline border-0 bg-transparent hover:scale-[1.02]",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-8 gap-1.5 px-4 has-[>svg]:px-3 text-xs",
        lg: "h-12 px-6 has-[>svg]:px-5 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
