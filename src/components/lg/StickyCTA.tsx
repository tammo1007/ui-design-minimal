import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./Button";
import { cn } from "@/lib/cn";
import { Glass } from "./Glass";
import { useToneUnder, usePrefersReducedMotion } from "./hooks";
import { SmartLink } from "./SmartLink";

interface StickyCTAProps {
  label: string;
  href: string;
  /** short reassurance, e.g. "From €89 · Live in 20 min" */
  note?: string;
  /** px scrolled before it appears (usually just past the hero) */
  showAfter?: number;
}

/**
 * Mobile/tablet-only floating CTA capsule. Hidden on lg+, hidden while any element with
 * [data-lg-hide-sticky] (final CTA, footer, pricing) is on screen.
 */
export function StickyCTA({ label, href, note, showAfter = 640 }: StickyCTAProps) {
  const [pastHero, setPastHero] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const reduce = usePrefersReducedMotion();
  const glassRef = useRef<HTMLElement>(null);
  const tone = useToneUnder(glassRef);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > showAfter);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setBlocked(visible.size > 0);
    });
    document.querySelectorAll("[data-lg-hide-sticky]").forEach((el) => io.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [showAfter]);

  const show = pastHero && !blocked;

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          className="pointer-events-none fixed inset-x-0 z-nav flex justify-center px-3 lg:hidden"
          style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <Glass
            ref={glassRef}
            shape="pill"
            tone={tone === "dark" ? "dark" : "auto"}
            className={cn(
              "pointer-events-auto flex w-full max-w-text items-center gap-3 py-2 pl-5 pr-2",
              tone === "dark" && "text-white",
            )}
          >
            {note ? (
              <span className={cn("min-w-0 flex-1 truncate text-small", tone === "dark" ? "text-white/70" : "text-ink-2")}>{note}</span>
            ) : (
              <span className="flex-1" />
            )}
            <Button asChild size="sm" className={cn(tone === "dark" && "bg-white text-black hover:bg-white/90")}>
              <SmartLink href={href}>{label}</SmartLink>
            </Button>
          </Glass>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
