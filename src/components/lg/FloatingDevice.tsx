import { useEffect, type ReactNode, type RefObject } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "./hooks";

interface FloatingDeviceProps {
  /** a <PhoneFrame className="lg-phone--float" …/> at native size */
  children: ReactNode;
  /** resting pose in degrees: x = tilt back, y = turn, z = roll. Keep |z| ≤ 16. */
  pose?: { x: number; y: number; z: number };
  /** pointer follow in degrees (desktop, fine pointer). 0 = off. Keep ≤ 4. */
  pointer?: number;
  /** section whose scroll-out straightens and lifts the device a little (usually the hero) */
  scrollTarget?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Hero device that floats: a resting 3D pose, a slow bob (10 px) and sway (≤ 2°) in CSS,
 * a gentle pointer tilt and a scroll-linked straighten. Everything is transform-only and
 * switches off with prefers-reduced-motion. Size comes from --lg-float-scale (set by .lg-hero).
 */
export function FloatingDevice({ children, pose = { x: 10, y: -14, z: 12 }, pointer = 3, scrollTarget, className }: FloatingDeviceProps) {
  const reduce = usePrefersReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 50, damping: 18, mass: 0.8 });
  const sy = useSpring(py, { stiffness: 50, damping: 18, mass: 0.8 });
  const { scrollYProgress } = useScroll(
    scrollTarget ? { target: scrollTarget, offset: ["start start", "end start"] } : undefined,
  );

  const rotateX = useTransform(sy, (v) => pose.x - v * pointer * 0.7);
  const rotateY = useTransform(sx, (v) => pose.y + v * pointer);
  const rotateZ = useTransform(scrollYProgress, (p) => (reduce || !scrollTarget ? pose.z : pose.z * (1 - p * 0.35)));
  const y = useTransform(scrollYProgress, (p) => (reduce || !scrollTarget ? 0 : p * -70));

  useEffect(() => {
    if (reduce || !pointer) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, pointer, px, py]);

  return (
    <div className={cn("lg-float", className)}>
      <motion.div className="lg-float__pose" style={{ rotateX, rotateY, rotateZ, y }}>
        <div className="lg-float__sway">
          <div className="lg-float__bob">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}
