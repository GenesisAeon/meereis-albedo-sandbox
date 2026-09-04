import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        primary: "bg-fg text-accent-fg hover:opacity-90",
        ghost:
          "bg-transparent text-muted hover:text-fg hover:bg-elevated",
        outline:
          "bg-transparent text-fg shadow-border hover:shadow-border-hover",
        chip: "bg-elevated text-muted hover:text-fg data-[active=true]:bg-fg data-[active=true]:text-accent-fg",
      },
      size: {
        sm: "h-11 rounded-sm px-3 text-sm sm:h-10",
        md: "h-11 rounded-md px-4 text-sm",
        icon: "size-11 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
