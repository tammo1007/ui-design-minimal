import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Check } from "./icons";
import { cn } from "@/lib/cn";

export interface ShowcaseItem {
  id: string;
  title: string;
  /** 1–3 sentences */
  body: ReactNode;
  /** optional checklist (≤ 4 short lines) */
  bullets?: string[];
  /** visual for the stage: usually <DeviceStage fit="bleed" size="panel">…</DeviceStage> */
  media: ReactNode;
}

interface AccordionShowcaseProps {
  items: ShowcaseItem[];
  /** auto-advance every n ms while in view (0 = off). Stops for good after the first click. */
  autoAdvance?: number;
  className?: string;
}

/**
 * Accordion + visual (Apple "highlights" pattern): the place for detail copy.
 * Desktop: list 5 cols, sticky stage 7 cols that crossfades per item.
 * Phones: the stage sits above the list. One item open; height animates via grid rows.
 */
export function AccordionShowcase({ items, autoAdvance = 0, className }: AccordionShowcaseProps) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(autoAdvance > 0);
  const [paused, setPaused] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // auto-advance only while visible and not reduced-motion
  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAuto(false);
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [auto]);

  const choose = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <div
      ref={rootRef}
      className={cn("lg-showcase grid grid-cols-1 gap-x-grid gap-y-10 lg:grid-cols-12", className)}
      data-paused={paused ? "" : undefined}
      style={{ "--lg-showcase-ms": `${autoAdvance}ms` } as CSSProperties}
      onPointerEnter={() => auto && setPaused(true)}
      onPointerLeave={() => auto && setPaused(false)}
      onFocus={() => auto && setPaused(true)}
    >
      <div className="lg:order-last lg:col-span-7">
        <div className="lg-showcase__stage lg:sticky lg:top-[calc(var(--lg-nav-offset)+2rem)]">
          {items.map((it, i) => (
            <div key={it.id} className="lg-showcase__layer" data-active={i === active} aria-hidden={i !== active}>
              {it.media}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-hairline lg:col-span-5 lg:pr-6">
        {items.map((it, i) => {
          const open = i === active;
          return (
            <div key={it.id} className="border-b border-hairline">
              <h3>
                <button
                  type="button"
                  id={`${id}-h${i}`}
                  aria-expanded={open}
                  aria-controls={`${id}-p${i}`}
                  onClick={() => choose(i)}
                  className={cn(
                    "flex w-full items-center justify-between gap-6 py-6 text-left text-h4 transition-colors duration-base",
                    open ? "text-ink" : "text-ink-2 hover:text-ink",
                  )}
                >
                  {it.title}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative size-3 shrink-0 transition-transform duration-base ease-lg-spring",
                      "before:absolute before:inset-x-0 before:top-1/2 before:h-[1.5px] before:-translate-y-1/2 before:rounded-pill before:bg-current",
                      "after:absolute after:inset-y-0 after:left-1/2 after:w-[1.5px] after:-translate-x-1/2 after:rounded-pill after:bg-current after:transition-transform after:duration-base",
                      open && "after:scale-y-0",
                    )}
 />
                </button>
              </h3>
              <div
                id={`${id}-p${i}`}
                role="region"
                aria-labelledby={`${id}-h${i}`}
                ref={(node) => {
                  if (node) node.inert = !open;
                }}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-slow ease-lg-out",
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-5 pb-7">
                    <div className="max-w-measure text-body text-ink-2">{it.body}</div>
                    {it.bullets?.length ? (
                      <ul className="flex flex-col gap-2.5 text-small text-ink-2">
                        {it.bullets.map((b) => (
                          <li key={b} className="flex gap-3">
                            <Check className="mt-0.5 size-4 shrink-0 text-ink" strokeWidth={1.75} aria-hidden="true" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {auto && open ? (
                      <div className="lg-showcase__progress" aria-hidden="true">
                        <span key={`${it.id}-${active}`} onAnimationEnd={() => setActive((a) => (a + 1) % items.length)} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
