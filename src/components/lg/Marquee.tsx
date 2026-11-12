import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface MarqueeProps {
  children: ReactNode;
  /** seconds for one loop: 30–60s keeps it calm */
  duration?: number;
  reverse?: boolean;
  /** CSS length for the gap between items */
  gap?: string;
  className?: string;
  "aria-label"?: string;
}

/**
 * Infinite, CSS-only marquee (logos, testimonials). Edge fade, pauses on hover/focus,
 * becomes a static centered wrap with prefers-reduced-motion.
 */
export function Marquee({ children, duration = 40, reverse = false, gap = "3rem", className, ...aria }: MarqueeProps) {
  return (
    <div
      className={cn("lg-marquee", className)}
      style={
        {
          "--lg-marquee-duration": `${duration}s`,
          "--lg-marquee-direction": reverse ? "reverse" : "normal",
          "--lg-marquee-gap": gap,
        } as CSSProperties
      }
      role="region"
      aria-label={aria["aria-label"]}
    >
      <div className="lg-marquee__track">
        <div className="lg-marquee__group">{children}</div>
        {/* visual duplicate for the loop: hidden from assistive tech and keyboard (inert) */}
        <div className="lg-marquee__group" aria-hidden="true" ref={(el) => el?.setAttribute("inert", "")}>
          {children}
        </div>
      </div>
    </div>
  );
}
