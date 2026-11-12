import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "./hooks";

interface ScrollScaleProps {
  children: ReactNode;
  /** starting scale (0.86–0.95) */
  from?: number;
  /** starting tilt in degrees (0–14) */
  tilt?: number;
  className?: string;
}

/**
 * Scroll-linked product reveal (Apple-style): the media straightens and grows to full size
 * as it scrolls into view. Use once per page, typically for the hero product visual.
 */
export function ScrollScale({ children, from = 0.9, tilt = 10, className }: ScrollScaleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [from, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [tilt, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [48, 0]);

  return (
    <div ref={ref} className={cn("relative", className)} style={{ perspective: "1600px" }}>
      <motion.div style={reduce ? undefined : { scale, rotateX, y, transformOrigin: "50% 0%" }}>{children}</motion.div>
    </div>
  );
}
