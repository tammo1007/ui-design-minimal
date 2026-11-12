import { createElement, useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "./hooks";

type Variant = "up" | "fade" | "blur" | "scale";

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "ul" | "ol" | "li" | "p" | "span" | "figure" | "article" | "header";
  variant?: Variant;
  /** extra delay in ms */
  delay?: number;
  /** animate direct children one after another (70ms apart, max 8 steps) instead of the wrapper */
  stagger?: boolean;
  children?: ReactNode;
}

const REVEAL_MS = 800;
const STAGGER_MS = 70;
const MAX_STAGGER = 8;

/**
 * Scroll reveal. SSR/no-JS safe: content renders visible; only elements that start BELOW
 * the fold are hidden after mount and revealed once. Attributes are removed afterwards
 * so the element's own hover transitions are untouched.
 * Never wrap the hero headline or the LCP image: use the `.lg-hero-in` class there.
 */
export function Reveal({ as = "div", variant = "up", delay = 0, stagger = false, className, children, ...props }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const rect = root.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return; // visible or above the fold at load → no animation

    const targets = (stagger ? Array.from(root.children) : [root]) as HTMLElement[];
    targets.forEach((el, i) => {
      el.dataset.reveal = "hidden";
      el.dataset.revealVariant = variant;
      el.style.setProperty("--lg-reveal-i", String(stagger ? Math.min(i, MAX_STAGGER) : 0));
      if (delay) el.style.setProperty("--lg-reveal-delay", `${delay}ms`);
    });

    let cleanupTimer: number | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        requestAnimationFrame(() => targets.forEach((el) => (el.dataset.reveal = "shown")));
        const total = REVEAL_MS + delay + STAGGER_MS * Math.min(targets.length, MAX_STAGGER) + 120;
        cleanupTimer = window.setTimeout(() => {
          targets.forEach((el) => {
            delete el.dataset.reveal;
            delete el.dataset.revealVariant;
            el.style.removeProperty("--lg-reveal-i");
            el.style.removeProperty("--lg-reveal-delay");
          });
        }, total);
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      window.clearTimeout(cleanupTimer);
    };
  }, [variant, delay, stagger]);

  return createElement(as, { ref, className, ...props }, children);
}

interface RevealTextProps {
  as?: "h1" | "h2" | "h3" | "p";
  /** the statement */
  text: string;
  /** optional continuation in secondary ink */
  muted?: string;
  className?: string;
  delay?: number;
}

/** Headline that rises word by word out of a mask. Accessible: full text in aria-label. */
export function RevealText({ as = "h2", text, muted, className, delay = 0 }: RevealTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    el.dataset.revealText = "hidden";
    if (delay) el.style.setProperty("--lg-reveal-delay", `${delay}ms`);
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        requestAnimationFrame(() => (el.dataset.revealText = "shown"));
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  let i = 0;
  const words = (str: string, extra?: string) =>
    str.split(/(\s+)/).map((w, k) =>
      /^\s+$/.test(w) || w === "" ? (
        w
      ) : (
        <span key={`${extra ?? "t"}-${k}`} className={cn("lg-word", extra)}>
          <span style={{ "--lg-word-i": i++ } as CSSProperties}>{w}</span>
        </span>
      ),
    );

  const full = muted ? `${text} ${muted}` : text;
  return createElement(
    as,
    { ref, className, "aria-label": full },
    <span aria-hidden="true">
      {words(text)}
      {muted ? (
        <>
          {" "}
          {words(muted, "text-ink-2")}
        </>
      ) : null}
    </span>,
  );
}
