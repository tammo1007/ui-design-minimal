import { useCallback, useEffect, useRef, useState, type CSSProperties, type MutableRefObject, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "./icons";
import { cn } from "@/lib/cn";
import { useIsoLayoutEffect } from "./hooks";
import { SmartLink } from "./SmartLink";

/* ------------------------------------------------------------------ state shared by rail + controls */

export interface CardRailState {
  // MutableRefObject keeps this assignable to `ref` under both React 18 and React 19 types
  trackRef: MutableRefObject<HTMLDivElement | null>;
  atStart: boolean;
  atEnd: boolean;
  prev: () => void;
  next: () => void;
}

/** Create once per rail; pass to <CardRail rail> and to <RailControls rail> (usually SectionHeader actions). */
export function useCardRail(): CardRailState {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setEdges({ atStart: el.scrollLeft <= 4, atEnd: el.scrollLeft >= max - 4 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const go = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector<HTMLElement>(".lg-rail__item");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: reduce ? "auto" : "smooth" });
  }, []);

  return { trackRef, ...edges, prev: () => go(-1), next: () => go(1) };
}

/** Previous / next buttons (40 px discs). Hidden on phones: there the rail is swiped. */
export function RailControls({ rail, label = "cards" }: { rail: CardRailState; label?: string }) {
  const btn =
    "lg-press grid size-10 place-items-center rounded-pill bg-ink/[0.06] text-ink transition-opacity duration-fast hover:bg-ink hover:text-canvas disabled:pointer-events-none disabled:opacity-30";
  return (
    <div className="hidden items-center gap-2 md:flex">
      <button type="button" className={btn} onClick={rail.prev} disabled={rail.atStart} aria-label={`Previous ${label}`}>
        <ArrowLeft className="size-[1.125rem]" />
      </button>
      <button type="button" className={btn} onClick={rail.next} disabled={rail.atEnd} aria-label={`Next ${label}`}>
        <ArrowRight className="size-[1.125rem]" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ rail */

interface CardRailProps {
  rail: CardRailState;
  /** accessible name of the carousel region */
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * Horizontal card rail (Apple product-page pattern). Starts on the content edge and bleeds off the
 * right edge. Touch: native swipe with snap. Mouse: drag with momentum (grab cursor); wheel/trackpad
 * scroll natively; keyboard: focus the rail and use ← →, or the controls.
 * Place it OUTSIDE <Container> (it handles its own inset).
 */
export function CardRail({ rail, label, children, className }: CardRailProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // latest prev/next without re-binding the listeners (the rail state changes on every scroll)
  const railRef = useRef(rail);
  railRef.current = rail;
  const trackRef = rail.trackRef;

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let down = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = false;
      startX = lastX = e.clientX;
      lastT = e.timeStamp;
      startScroll = track.scrollLeft;
      velocity = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        root.dataset.dragging = "";
        track.setPointerCapture(e.pointerId);
      }
      if (!moved) return;
      const now = e.timeStamp;
      const v = (e.clientX - lastX) / Math.max(8, now - lastT);
      velocity = velocity * 0.6 + Math.max(-3, Math.min(3, v)) * 0.4; // smoothed, px/ms
      lastX = e.clientX;
      lastT = now;
      track.scrollLeft = startScroll - dx;
    };
    const snapTo = (target: number) => {
      const items = Array.from(track.querySelectorAll<HTMLElement>(".lg-rail__item"));
      if (!items.length) return target;
      // snap positions relative to the first card (it rests on the content edge at scrollLeft 0)
      const first = items[0].offsetLeft;
      let best = target;
      let bestD = Infinity;
      for (const it of items) {
        const pos = it.offsetLeft - first;
        const d = Math.abs(pos - target);
        if (d < bestD) {
          bestD = d;
          best = pos;
        }
      }
      const max = track.scrollWidth - track.clientWidth;
      return Math.max(0, Math.min(max, best));
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      if (!moved) return;
      if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
      // momentum: project the release velocity (ignored after a pause), then settle on the nearest card
      const v = e.timeStamp - lastT > 80 ? 0 : velocity;
      const projected = track.scrollLeft - v * 260;
      const left = snapTo(projected);
      track.scrollTo({ left, behavior: reduce.matches ? "auto" : "smooth" });
      window.setTimeout(() => delete root.dataset.dragging, reduce.matches ? 0 : 700);
    };
    // a drag must not trigger the card link underneath
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.target !== track) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        railRef.current.next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        railRef.current.prev();
      }
    };

    track.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    track.addEventListener("click", onClick, true);
    track.addEventListener("keydown", onKey);
    // native image drag would hijack the gesture
    track.querySelectorAll("img").forEach((img) => (img.draggable = false));
    return () => {
      track.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      track.removeEventListener("click", onClick, true);
      track.removeEventListener("keydown", onKey);
    };
  }, [trackRef]);

  return (
    <div ref={rootRef} className={cn("lg-rail", className)} role="region" aria-roledescription="carousel" aria-label={label}>
      <div ref={trackRef} className="lg-rail__track" tabIndex={0}>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ card */

type RailTone = "sky" | "mist" | "sand" | "slate" | "ink" | "clay";

// complete literal class names (Tailwind/purge-safe)
const toneClass: Record<RailTone, string> = {
  sky: "lg-tone lg-tone--sky",
  mist: "lg-tone lg-tone--mist",
  sand: "lg-tone lg-tone--sand",
  slate: "lg-tone lg-tone--slate",
  ink: "lg-tone lg-tone--ink",
  clay: "lg-tone lg-tone--clay",
};

interface RailCardProps {
  /** product-imagery colour; text colours adapt automatically */
  tone?: RailTone;
  title: string;
  body: string;
  /** whole card becomes a link; shows the ↗ disc */
  href?: string;
  /** visual in the lower half: product UI rebuilt in HTML (preferred: crisp, no stray corners) or an illustration */
  media?: ReactNode;
}

/**
 * Visual slot: the visual is laid out at a fixed design width (296 px) and scaled down (never up)
 * until it fits the space under the text: nothing is ever cropped or sticks out of the card.
 */
function RailVisual({ children }: { children: ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useIsoLayoutEffect(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner) return;
    const measure = () => {
      const w = box.clientWidth;
      const h = box.clientHeight;
      const nw = inner.offsetWidth;
      const nh = inner.offsetHeight;
      if (!w || !h || !nw || !nh) return;
      setScale(Math.round(Math.min(1, w / nw, h / nh) * 1000) / 1000);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={boxRef} className="lg-rail__media">
      <div className="lg-rail__fit" style={{ "--lg-fit": scale } as CSSProperties}>
        <div ref={innerRef} className="lg-rail__visual">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Tall rail card (4 : 5): title + 1–2 sentence body on top, product visual fitted into the rest. */
export function RailCard({ tone = "mist", title, body, href, media }: RailCardProps) {
  return (
    <article className={cn("lg-rail__item", toneClass[tone])}>
      <div className="relative z-10 flex shrink-0 flex-col gap-2 p-7 pb-5">
        <h3 className="text-h4 text-ink">{title}</h3>
        <p className="max-w-[30ch] text-small text-ink-2">{body}</p>
        {href ? (
          <span className="mt-3 grid size-9 place-items-center rounded-pill bg-ink/10 text-ink" aria-hidden="true">
            <ArrowUpRight className="size-4" />
          </span>
        ) : null}
      </div>
      {media ? <RailVisual>{media}</RailVisual> : null}
      {href ? <SmartLink href={href} className="absolute inset-0 z-20 rounded-card" aria-label={title} /> : null}
    </article>
  );
}
