import { createElement, forwardRef, useEffect, useRef, type HTMLAttributes, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { dsWarn } from "./hooks";

type GlassVariant = "regular" | "thick" | "clear";
type GlassShape = "pill" | "control" | "card";

interface GlassProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "nav" | "aside" | "span" | "header" | "a" | "button";
  /** regular (default) · thick (text-heavy: sheets, menus, dialogs) · clear (ONLY over photos/video) */
  variant?: GlassVariant;
  /** clear only: 35% dark dimming for bright media (Apple HIG) */
  dim?: boolean;
  /** force the dark material (e.g. element floating over a dark section) */
  tone?: "auto" | "dark";
  /** pointer-follow specular highlight (desktop only) */
  interactive?: boolean;
  shape?: GlassShape;
  href?: string;
  /** only with as="a" and an external href (internal links: wrap content in <SmartLink>) */
  target?: string;
  rel?: string;
  children?: ReactNode;
}

const shapeClass: Record<GlassShape, string> = {
  pill: "rounded-pill",
  control: "rounded-control",
  card: "rounded-card",
};

/**
 * Liquid Glass material for the NAVIGATION / CONTROL layer only:
 * nav, segmented controls, floating chips over media, sticky CTA, sheets, toasts.
 * Never for content cards, sections, pricing or testimonials. Never glass on glass.
 */
export const Glass = forwardRef<HTMLElement, GlassProps>(function Glass(
  { as = "div", variant = "regular", dim = false, tone = "auto", interactive = false, shape = "card", className, onPointerMove, children, ...props },
  forwardedRef,
) {
  const localRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = localRef.current;
    if (el?.parentElement?.closest(".lg-glass")) dsWarn("Glass nested inside Glass: avoid glass on glass.", el);
  }, []);

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    onPointerMove?.(e);
    if (!interactive || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--lg-mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--lg-my", `${e.clientY - r.top}px`);
  };

  return createElement(
    as,
    {
      ref: (node: HTMLElement | null): void => {
        localRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      className: cn(
        "lg-glass",
        variant === "thick" && "lg-glass--thick",
        variant === "clear" && "lg-glass--clear",
        variant === "clear" && dim && "lg-glass--dim",
        shapeClass[shape],
        className,
      ),
      "data-tone": tone === "dark" ? "dark" : undefined,
      "data-glass-interactive": interactive ? "" : undefined,
      onPointerMove: handlePointerMove,
      ...props,
    },
    children,
  );
});
