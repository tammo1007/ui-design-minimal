import { createElement, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SmartLink } from "./SmartLink";

// as="a" renders a SmartLink (router-aware): links always go through the router adapter
const el = (as: string) => (as === "a" ? SmartLink : as) as unknown as string;

interface TileProps extends HTMLAttributes<HTMLElement> {
  /** filled (default): #F5F5F7 on white sections, white on subtle sections · outline: white + hairline */
  variant?: "filled" | "outline";
  /** subtle zoom of a child with .lg-media-zoom__target on hover (only when the whole card is a link) */
  interactive?: boolean;
  as?: "div" | "article" | "li" | "a" | "figure";
  href?: string;
  children?: ReactNode;
}

/** Content-layer card (solid, never glass). r 24 · padding 24 → 40. */
export function Tile({ variant = "filled", interactive = false, as = "div", className, ...props }: TileProps) {
  return createElement(el(as), {
    className: cn("lg-card", variant === "outline" && "lg-card--outline", interactive && "lg-media-zoom", className),
    ...props,
  });
}

interface TileMediaProps extends HTMLAttributes<HTMLDivElement> {
  /** run the media to the card's left/right/bottom edges */
  bleed?: boolean;
}

/** Visual inside a Tile. Radius is concentric with the card automatically. */
export function TileMedia({ bleed = false, className, children, ...props }: TileMediaProps) {
  return (
    <div className={cn("relative mt-auto overflow-hidden", bleed ? "lg-bleed" : "lg-concentric", className)} {...props}>
      <div className="lg-media-zoom__target h-full w-full">{children}</div>
    </div>
  );
}

interface MediaCardProps extends HTMLAttributes<HTMLElement> {
  /** full-bleed visual (image, video, gradient, product composition) */
  media: ReactNode;
  label?: string;
  title: string;
  body?: string;
  /** e.g. <ArrowLink tone="onMedia" … /> */
  action?: ReactNode;
  as?: "div" | "article" | "a";
  href?: string;
}

/** Card whose visual fills the whole surface; text sits on a bottom scrim (white type). */
export function MediaCard({ media, label, title, body, action, as = "article", className, ...props }: MediaCardProps) {
  return createElement(
    el(as),
    { className: cn("lg-card lg-media-zoom isolate justify-end text-white", className), ...props },
    <div className="lg-media-zoom__target absolute inset-0 -z-10">{media}</div>,
    <div className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />,
    <div className="flex flex-col gap-3">
      {label ? <span className="text-label text-white/70">{label}</span> : null}
      <h3 className="max-w-[24ch] text-h3 text-white">{title}</h3>
      {body ? <p className="max-w-measure text-body text-white/75">{body}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>,
  );
}
