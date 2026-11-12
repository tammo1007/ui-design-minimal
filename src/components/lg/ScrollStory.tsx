import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/cn";
import { DeviceStage, backdropClass, type StageBackdrop } from "./DeviceStage";
import { usePrefersReducedMotion } from "./hooks";

export interface StoryStep {
  id: string;
  title: string;
  body: ReactNode;
  /** shorter text for the phone/tablet caption (defaults to `body`): use it when `body` runs past ~40 words */
  summary?: ReactNode;
  /** the device at native size, e.g. <PhoneFrame src … />: ScrollStory stages it (preferred) */
  device?: ReactNode;
  /** stage backdrop for this step (with `device`) */
  backdrop?: StageBackdrop;
  /** legacy: a fully built media node (then phones fall back to stacked steps) */
  media?: ReactNode;
}

interface ScrollStoryProps {
  steps: StoryStep[];
  mediaSide?: "left" | "right";
  /** show 01 / 02 counters (only when the order is real) */
  numbered?: boolean;
  className?: string;
}

const pad = (i: number) => String(i + 1).padStart(2, "0");

/**
 * The page's ONE showpiece: the device stays, the content changes as you scroll.
 * Desktop (lg+): steps scroll on the left, a sticky stage on the right crossfades per step.
 * Phones/tablets: ONE pinned panel: story-style progress bars on top, the phone in the middle,
 * a material caption at the bottom; scrolling swaps phone + caption in place, tapping a bar jumps.
 */
export function ScrollStory({ steps, mediaSide = "right", numbered = true, className }: ScrollStoryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [mActive, setMActive] = useState(0);
  const reduce = usePrefersReducedMotion();
  const staged = steps.every((s) => s.device);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start center", "end center"] });
  const { scrollYProgress: mProgress } = useScroll({ target: mobileRef, offset: ["start start", "end end"] });

  // mobile: progress → active step + bar fills
  useMotionValueEvent(mProgress, "change", (p) => {
    const n = steps.length;
    const x = Math.max(0, Math.min(n, p * n));
    setMActive(Math.min(n - 1, Math.floor(x)));
    barRefs.current.forEach((el, i) => {
      if (el) el.style.transform = `scaleX(${Math.max(0, Math.min(1, x - i))})`;
    });
  });

  // desktop: active step = the step text whose center is closest to the viewport center
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      stepRefs.current.forEach((el, i) => {
        if (!el || !el.offsetParent) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [steps.length]);

  const jump = (i: number) => {
    const el = mobileRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const dist = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (dist * (i + 0.02)) / steps.length + 1, behavior: reduce ? "auto" : "smooth" });
  };

  const stageFor = (s: StoryStep) =>
    s.device ? (
      <DeviceStage fit="contain" size="story" backdrop={s.backdrop ?? "subtle"} rounded className="w-full">
        {s.device}
      </DeviceStage>
    ) : (
      s.media
    );

  return (
    <>
      {staged ? (
        <div
          ref={mobileRef}
          className={cn("lg-story-m lg:hidden", className)}
          style={{ "--lg-story-steps": steps.length } as CSSProperties}
        >
          <div className="lg-story-m__frame">
            <div className="lg-story-m__panel">
              {steps.map((s, i) => (
                <div key={s.id} className={cn("lg-story-m__layer", backdropClass[s.backdrop ?? "subtle"])} data-active={i === mActive} aria-hidden={i !== mActive}>
                  <DeviceStage fit="contain" className="lg-story-m__stage">
                    {s.device}
                  </DeviceStage>
                </div>
              ))}
              <div className="lg-story-m__bars">
                {steps.map((s, i) => (
                  <button key={s.id} type="button" onClick={() => jump(i)} aria-label={`Show ${pad(i)}: ${s.title}`} aria-current={i === mActive ? "step" : undefined}>
                    <span>
                      <span
                        ref={(el) => {
                          barRefs.current[i] = el;
                        }}
                        style={{ transform: "scaleX(0)" }}
 />
                    </span>
                  </button>
                ))}
              </div>
              <div className="lg-material lg-story-m__caption">
                {steps.map((s, i) => (
                  <div key={s.id} className="lg-story-m__text" data-active={i === mActive} aria-hidden={i !== mActive}>
                    {numbered ? (
                      <span className="text-label tabular-nums text-ink-3">
                        {pad(i)} / {pad(steps.length - 1)}
                      </span>
                    ) : null}
                    <h3 className="mt-1 text-h3 text-ink">{s.title}</h3>
                    <div className="mt-1.5 text-small text-ink-2">{s.summary ?? s.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div ref={rootRef} className={cn("relative grid-cols-1 gap-grid lg:grid lg:grid-cols-12 lg:gap-x-6", staged ? "hidden" : "grid", className)}>
        <div className="relative lg:col-span-5 lg:pr-10">
          {/* progress rail */}
          <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-hairline lg:block" aria-hidden="true">
            <motion.div className="h-full w-full origin-top bg-ink/70" style={reduce ? { scaleY: 1 } : { scaleY: scrollYProgress }} />
          </div>
          {steps.map((s, i) => (
            <div key={s.id} className="lg-story__step flex flex-col gap-6 py-8 lg:py-0 lg:pl-10">
              {!staged ? <div className="lg:hidden">{stageFor(s)}</div> : null}
              <div
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={cn(
                  "flex max-w-measure flex-col gap-3 transition-opacity duration-slow ease-lg-out",
                  i === active ? "lg:opacity-100" : "lg:opacity-30",
                )}
              >
                {numbered ? (
                  <span className="text-label tabular-nums text-ink-3" aria-hidden="true">
                    {pad(i)}
                  </span>
                ) : null}
                <h3 className="text-h3 text-ink">{s.title}</h3>
                <div className="text-lead text-ink-2">{s.body}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={cn("relative hidden lg:col-span-7 lg:block", mediaSide === "left" && "lg:order-first")}>
          <div className="lg-story__stage">
            {steps.map((s, i) => (
              <div key={s.id} className="lg-story__media" data-active={i === active} aria-hidden={i !== active}>
                {stageFor(s)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
