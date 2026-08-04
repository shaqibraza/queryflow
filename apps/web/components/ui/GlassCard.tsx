import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-border bg-white/[0.03] backdrop-blur-xl",
          interactive &&
            "cursor-pointer transition-colors duration-200 hover:border-accent/40 hover:bg-white/[0.05]",
          className
        )}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";
