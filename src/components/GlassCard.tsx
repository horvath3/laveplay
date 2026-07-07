import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = false, glow = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass rounded-2xl transition-all duration-300",
        hover && "hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_60px_-24px_oklch(0_0_0/0.8)]",
        glow && "glow",
        className,
      )}
      {...props}
    />
  ),
);
GlassCard.displayName = "GlassCard";
