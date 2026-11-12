import { useId, type CSSProperties, type ReactNode } from "react";
import { ArrowUpRight } from "./icons";
import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { Haze } from "./Frames";
import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { SmartLink } from "./SmartLink";

/* --------------------------------------------------------------------------
   CtaSection: the closing section of every page except the landing page:
   the dark inset panel (same as the landing's dark showcase: Haze, rounded,
   inset from the viewport, grows from 0.95 while it scrolls in). Headline
   left (two-tone, display size), lead + actions + caption right; stacked on
   phones. It is the page's dark section: keep the page at ≤ 2 dark sections.
   -------------------------------------------------------------------------- */
interface CtaSectionProps {
  eyebrow?: string;
  title: string;
  titleMuted?: string;
  lead?: ReactNode;
  /** primary first (white on dark), then secondary */
  actions?: ReactNode;
  /** proof line under the actions, e.g. "From €89 per event · Live in 20 minutes · EU-hosted" */
  caption?: ReactNode;
  id?: string;
}

export function CtaSection({ eyebrow, title, titleMuted, lead, actions, caption, id = "cta" }: CtaSectionProps) {
  const headingId = useId();
  return (
    <div className="pb-section-sm">
      <Section tone="dark" inset id={id} aria-labelledby={headingId} className="isolate">
        <Haze />
        <Container className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-grid">
          <Reveal className="flex flex-col gap-5 lg:col-span-7">
            {eyebrow ? <p className="text-label text-ink-2">{eyebrow}</p> : null}
            <h2 id={headingId} className="max-w-heading text-display text-ink">
              <span className="block">{title}</span>
              {titleMuted ? " " : null}
              {titleMuted ? <span className="block text-ink-2">{titleMuted}</span> : null}
            </h2>
          </Reveal>
          <Reveal stagger className="flex flex-col gap-8 lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9">
            {lead ? <p className="text-lead text-ink-2">{lead}</p> : null}
            {actions ? <div className="flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
            {caption ? <div className="border-t border-hairline pt-5 text-caption text-ink-2">{caption}</div> : null}
          </Reveal>
        </Container>
      </Section>
    </div>
  );
}

/* --------------------------------------------------------------------------
   PhotoCollage: one wide photo over two details (people, venues, events).
   r 24, hover zoom on fine pointers, lazy, object-position per photo.
   -------------------------------------------------------------------------- */
export interface CollagePhoto {
  src: string;
  alt: string;
  /** CSS object-position, e.g. "center 45%" */
  position?: string;
}

function Photo({ photo, className }: { photo: CollagePhoto; className: string }) {
  return (
    <figure className={cn("lg-media-zoom relative overflow-hidden rounded-card bg-surface-2", className)}>
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        width={1200}
        height={900}
        className="lg-media-zoom__target absolute inset-0 size-full object-cover"
        style={{ objectPosition: photo.position ?? "center" } as CSSProperties}
 />
    </figure>
  );
}

export function PhotoCollage({ main, details, className }: { main: CollagePhoto; details: [CollagePhoto, CollagePhoto]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      <Photo photo={main} className="col-span-2 aspect-[16/10]" />
      <Photo photo={details[0]} className="aspect-[4/3]" />
      <Photo photo={details[1]} className="aspect-[4/3]" />
    </div>
  );
}

/* --------------------------------------------------------------------------
   ActionRow: a full-width link row: icon disc + title + detail + arrow.
   Contact options, downloads, "book a call". `action` renders a secondary
   control (e.g. copy) outside the link.
   -------------------------------------------------------------------------- */
interface ActionRowProps {
  icon: ReactNode;
  title: string;
  detail?: ReactNode;
  href: string;
  /** open in a new tab (external) */
  external?: boolean;
  action?: ReactNode;
  className?: string;
}

export function ActionRow({ icon, title, detail, href, external = false, action, className }: ActionRowProps) {
  return (
    <div className={cn("lg-action-row flex items-center gap-2 border-b border-hairline", className)}>
      <SmartLink
        href={href}
        target={external ? "_blank" : undefined}
        className="group flex min-h-20 min-w-0 flex-1 items-center gap-4 py-4 transition-opacity duration-fast hover:opacity-75"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-pill bg-surface-2 text-ink [&_svg]:size-5" aria-hidden="true">
          {icon}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-body font-medium text-ink">{title}</span>
          {detail ? <span className="text-small text-ink-2">{detail}</span> : null}
        </span>
        <ArrowUpRight className="ml-auto size-5 shrink-0 text-ink-3 transition-transform duration-fast group-hover:-translate-y-0.5 group-hover:translate-x-0.5"  aria-hidden="true" />
      </SmartLink>
      {action}
    </div>
  );
}

/* --------------------------------------------------------------------------
   ChipList: static tags (interests, topics). Links use the use-case chip
   pattern on the landing page instead.
   -------------------------------------------------------------------------- */
export function ChipList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map((t) => (
        <li key={t} className="inline-flex h-9 items-center rounded-pill px-4 text-small text-ink-2 ring-1 ring-inset ring-hairline-strong">
          {t}
        </li>
      ))}
    </ul>
  );
}
