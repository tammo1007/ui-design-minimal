import { Children, useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion, useMediaQuery } from "./hooks";

/* ============================================================================
   SCROLL SHOWPIECES: Apple product-page moments, built on motion/react.
   Budget per page: max 2 PINNED sections (MediaExpand, ZoomThrough, PinnedGallery,
   StackCards, ScrollStory), never two pinned sections back to back, never first.
   Light effects (TextReveal, ParallaxColumns, ScrollScale, Reveal) are unlimited.
   Every component renders a static, complete layout with reduced motion.
   Only transform and opacity are animated (never width, height, top, blur).
   ============================================================================ */

/* ----------------------------------------------------------------------------
   MediaExpand: an inset, rounded media panel grows to full bleed while the page
   is pinned (corner radius 28 → 0, inset → edge). Headline sits above and fades.
   Height of the track: 220svh. Use right after the hero or as the page's climax.
   ---------------------------------------------------------------------------- */
export function MediaExpand({
  media,
  eyebrow,
  title,
  caption,
  className,
}: {
  /** <img>/<video> with object-cover; it fills the panel */
  media: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
  /** short line that fades in over the media at the end (clear glass pill) */
  caption?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(p, [0, 0.7], [0.56, 1]);
  const panelY = useTransform(p, [0, 0.7], ["22svh", "0svh"]);
  const radius = useTransform(p, [0, 0.7], [44, 0]);
  const titleY = useTransform(p, [0, 0.3], [0, -60]);
  const titleOpacity = useTransform(p, [0, 0.22], [1, 0]);
  const capOpacity = useTransform(p, [0.72, 0.85], [0, 1]);
  const mediaScale = useTransform(p, [0, 0.7], [1.18, 1]);

  if (reduce) {
    return (
      <section className={cn("py-section", className)}>
        <div className="lg-container">
          <div className="mb-header max-w-[20ch]">
            {eyebrow && <p className="mb-3 text-label text-ink-2">{eyebrow}</p>}
            <h2 className="text-h1">{title}</h2>
          </div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-panel">{media}</div>
          {caption && <p className="mt-4 text-small text-ink-2">{caption}</p>}
        </div>
      </section>
    );
  }
  return (
    <section ref={ref} className={cn("lg-pin h-[220svh]", className)}>
      <div className="lg-pin__stage grid place-items-center">
        <motion.div style={{ y: titleY, opacity: titleOpacity }} className="absolute inset-x-0 top-[13svh] z-raised px-4 text-center">
          {eyebrow && <p className="mb-3 text-label text-ink-2">{eyebrow}</p>}
          <h2 className="mx-auto max-w-[18ch] text-display">{title}</h2>
        </motion.div>
        <motion.div style={{ scale, y: panelY, borderRadius: radius }} className="relative h-full w-full overflow-hidden will-change-transform">
          <motion.div style={{ scale: mediaScale }} className="absolute inset-0 [&>*]:h-full [&>*]:w-full [&>*]:object-cover">
            {media}
          </motion.div>
          {caption && (
            <motion.div style={{ opacity: capOpacity }} className="absolute inset-x-0 bottom-10 grid place-items-center px-4">
              <div className="lg-glass lg-glass--clear lg-glass--dim rounded-pill px-5 py-2.5 text-small font-medium">{caption}</div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
   TextReveal: a statement paragraph whose words light up (ink-4 → ink) as it
   scrolls through the viewport. Not pinned. 1 to 3 sentences, max 40 words.
   ---------------------------------------------------------------------------- */
export function TextReveal({ text, className, as: As = "p" }: { text: string; className?: string; as?: "p" | "h2" }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  if (reduce) return <As className={cn("text-h2", className)}>{text}</As>;
  return (
    <As ref={ref as never} className={cn("text-h2", className)} aria-label={text}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </As>
  );
}
function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <span aria-hidden="true">
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </span>
  );
}

/* ----------------------------------------------------------------------------
   StackCards: full-width cards that stick under the nav and stack; each card
   scales down slightly and dims as the next one slides over it. 3 to 5 cards.
   Cards are solid surfaces (r 28), never glass.
   ---------------------------------------------------------------------------- */
export function StackCards({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const items = Children.toArray(children);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div ref={ref} className={cn("relative grid gap-[12svh] pb-[8svh]", className)}>
      {items.map((child, i) => (
        <StackCard key={i} i={i} n={items.length} progress={scrollYProgress} reduce={reduce}>
          {child}
        </StackCard>
      ))}
    </div>
  );
}
function StackCard({ children, i, n, progress, reduce }: { children: ReactNode; i: number; n: number; progress: MotionValue<number>; reduce: boolean }) {
  const start = i / n;
  const scale = useTransform(progress, [start, 1], [1, 1 - (n - 1 - i) * 0.04]);
  const dim = useTransform(progress, [start, Math.min(1, start + 1 / n)], [0, i === n - 1 ? 0 : 0.35]);
  return (
    <motion.div className="lg-stack__card" style={{ "--lg-stack-i": i, scale: reduce ? 1 : scale } as unknown as CSSProperties}>
      <div className="relative overflow-hidden rounded-panel shadow-elev-2">
        {children}
        {!reduce && <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />}
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
   PinnedGallery: vertical scroll drives a horizontal track while the section is
   pinned (a "scroll-jacked" chapter). 3 to 6 panels. This is a SHOWPIECE; the
   everyday horizontal list stays <CardRail> (user-scrolled, always on landing pages).
   ---------------------------------------------------------------------------- */
export function PinnedGallery({ header, children, className }: { header?: ReactNode; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const items = Children.toArray(children);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });
  const x = useTransform(smooth, (v) => {
    const el = track.current;
    if (!el) return 0;
    return -v * Math.max(0, el.scrollWidth - el.clientWidth);
  });
  if (reduce) {
    return (
      <section className={cn("py-section", className)}>
        <div className="lg-container">{header}</div>
        <div className="lg-container grid grid-cols-1 gap-grid md:grid-cols-2">{items}</div>
      </section>
    );
  }
  return (
    <section ref={ref} className={cn("lg-pin", className)} style={{ height: `${100 + items.length * 55}svh` }}>
      <div className="lg-pin__stage flex flex-col justify-center gap-header py-section-sm">
        {header && <div className="lg-container w-full">{header}</div>}
        <motion.div ref={track} style={{ x }} className="flex gap-grid px-[max(var(--lg-gutter),calc((100vw-var(--lg-w-content))/2))] will-change-transform">
          {items.map((c, i) => (
            <div key={i} className="w-[min(78vw,36rem)] shrink-0">
              {c}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
   ZoomThrough: a giant word fills the screen, then the camera "flies through" it:
   the word scales up and fades while the media behind comes into focus.
   Track 200svh. Best between two light sections as the page's big moment.
   ---------------------------------------------------------------------------- */
export function ZoomThrough({ word, media, after, className }: { word: string; media: ReactNode; after?: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const textScale = useTransform(p, [0, 0.6], [1, 14]);
  const textOpacity = useTransform(p, [0.35, 0.58], [1, 0]);
  const mediaOpacity = useTransform(p, [0.2, 0.6], [0, 1]);
  const mediaScale = useTransform(p, [0.2, 0.9], [1.25, 1]);
  const afterOpacity = useTransform(p, [0.7, 0.85], [0, 1]);
  const afterY = useTransform(p, [0.7, 0.85], [24, 0]);
  if (reduce) {
    return (
      <section className={cn("py-section", className)}>
        <div className="lg-container">
          <p className="lg-zoom-text mb-8 text-ink">{word}</p>
          <div className="relative aspect-[16/9] overflow-hidden rounded-panel [&>*]:h-full [&>*]:w-full [&>*]:object-cover">{media}</div>
          {after && <div className="mt-8">{after}</div>}
        </div>
      </section>
    );
  }
  return (
    <section ref={ref} className={cn("lg-pin h-[200svh]", className)} data-theme="dark">
      <div className="lg-pin__stage grid place-items-center bg-canvas">
        <motion.div style={{ opacity: mediaOpacity, scale: mediaScale }} className="absolute inset-0 [&>*]:h-full [&>*]:w-full [&>*]:object-cover">
          {media}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </motion.div>
        <motion.p style={{ scale: textScale, opacity: textOpacity }} className="lg-zoom-text relative text-ink will-change-transform" aria-hidden="true">
          {word}
        </motion.p>
        <span className="sr-only">{word}</span>
        {after && (
          <motion.div style={{ opacity: afterOpacity, y: afterY }} className="absolute inset-x-0 bottom-[10svh] text-ink">
            <div className="lg-container">{after}</div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
   ParallaxColumns: a gallery wall of 3 columns (2 on tablets, 1 on phones) that
   drift at different speeds while the section passes. Not pinned. 6 to 12 tiles.
   ---------------------------------------------------------------------------- */
export function ParallaxColumns({ children, className, strength = 160 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const wide = useMediaQuery("(min-width: 768px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [strength * 0.4, -strength * 0.4]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-strength * 0.5, strength * 0.5]);
  const y3 = useTransform(scrollYProgress, [0, 1], [strength * 0.7, -strength * 0.7]);
  const items = Children.toArray(children);
  const cols = wide ? 3 : 1;
  const columns = Array.from({ length: cols }, (_, c) => items.filter((_, i) => i % cols === c));
  const ys = [y1, y2, y3];
  return (
    <div ref={ref} className={cn("grid gap-grid overflow-clip", wide ? "grid-cols-3" : "grid-cols-1", className)}>
      {columns.map((col, c) => (
        <motion.div key={c} style={reduce || !wide ? undefined : { y: ys[c] }} className="grid content-start gap-grid">
          {col}
        </motion.div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   ScrollProgress: 2 px accent line under the nav for long reads (blog, docs).
   ---------------------------------------------------------------------------- */
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 40 });
  return <motion.div aria-hidden="true" style={{ scaleX, transformOrigin: "0% 50%" }} className={cn("fixed inset-x-0 top-0 z-tooltip h-0.5 bg-accent", className)} />;
}
