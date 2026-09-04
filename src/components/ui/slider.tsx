import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export function Slider({
  className,
  trackClassName,
  rangeClassName,
  thumbClassName,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  trackClassName?: string;
  rangeClassName?: string;
  thumbClassName?: string;
}) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center py-3",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          "relative h-1.5 w-full grow overflow-hidden rounded-full bg-ocean-deep",
          trackClassName,
        )}
      >
        <SliderPrimitive.Range
          className={cn("absolute h-full bg-accent", rangeClassName)}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block size-4 rounded-full bg-fg shadow-border",
          "after:absolute after:left-1/2 after:top-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2",
          "relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          "disabled:pointer-events-none disabled:opacity-50",
          thumbClassName,
        )}
      />
    </SliderPrimitive.Root>
  );
}
