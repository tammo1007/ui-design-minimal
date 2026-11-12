import { useId, type CSSProperties, type ReactNode } from "react";
import { Check } from "./icons";
import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { Aurora } from "./Frames";

interface PageHeroProps {
  /** small label above the h1, e.g. "Pricing" (ink-2, 14/500) */
  eyebrow?: ReactNode;
  /** line 1: the statement (ink) */
  title: ReactNode;
  /** line 2: the continuation (ink-2), same size */
  titleMuted?: ReactNode;
  lead?: ReactNode;
  /** buttons: primary first; stack below sm */
  actions?: ReactNode;
  /** proof line under the actions, e.g. <CheckRow items={…} /> */
  meta?: ReactNode;
  /** optional right column from lg (a glass info card, an image): max one */
  aside?: ReactNode;
  className?: string;
}

const i = (n: number) => ({ "--lg-hero-i": n }) as CSSProperties;

/**
 * Hero of every subpage: left-aligned two-tone h1 (text-display) with lead, CTAs and a proof line,
 * over a soft brand aurora. Sits under the GlassNav (offsets itself), animates in with lg-hero-in.
 * The landing page keeps its own hero (.lg-hero).
 */
export function PageHero({ eyebrow, title, titleMuted, lead, actions, meta, aside, className }: PageHeroProps) {
  const id = useId();
  return (
    <section data-lg-section="" aria-labelledby={id} className={cn("lg-page-hero", className)}>
      <Aurora className="lg-aurora--page" />
      <Container className="relative">
        <div className={cn("grid grid-cols-1 gap-12", aside && "lg:grid-cols-12 lg:items-end")}>
          <div className={cn("flex min-w-0 flex-col", aside && "lg:col-span-7")}>
            {eyebrow ? <p className="lg-hero-in mb-5 text-label text-ink-2">{eyebrow}</p> : null}
            <h1 id={id} className={cn("lg-hero-in text-display text-ink", !aside && "max-w-heading")} style={i(1)}>
              <span className="block">{title}</span>
              {titleMuted ? " " : null}
              {titleMuted ? <span className="block text-ink-2">{titleMuted}</span> : null}
            </h1>
            {lead ? (
              <p className="lg-hero-in mt-6 max-w-measure text-lead text-ink-2" style={i(2)}>
                {lead}
              </p>
            ) : null}
            {actions ? (
              <div className="lg-hero-in mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" style={i(3)}>
                {actions}
              </div>
            ) : null}
            {meta ? (
              <div className="lg-hero-in mt-6" style={i(4)}>
                {meta}
              </div>
            ) : null}
          </div>
          {aside ? (
            <div className="lg-hero-in min-w-0 lg:col-span-5" style={i(4)}>
              {aside}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

/** Inline proof line with check marks (hero meta, under pricing cards). */
export function CheckRow({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-6 gap-y-2 text-small text-ink-2", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <Check className="size-4 shrink-0 text-ink" strokeWidth={1.75} aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}
