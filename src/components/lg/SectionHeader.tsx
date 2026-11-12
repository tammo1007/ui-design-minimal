import { createElement, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

interface SectionHeaderProps {
  /** small label above the headline (ink-2, 14/500). Optional. */
  eyebrow?: ReactNode;
  /** line 1: the statement, in ink */
  title: ReactNode;
  /** line 2: the continuation, same size, in ink-2 (signature two-tone header) */
  titleMuted?: ReactNode;
  /** optional paragraph: use either titleMuted or lead, rarely both */
  lead?: ReactNode;
  /** right-aligned on desktop (e.g. "View all" ArrowLink, carousel arrows); below on phones */
  actions?: ReactNode;
  /** left (default, content sections) · center (hero, final CTA, statements) */
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  size?: "display" | "h1" | "h2" | "h3";
  flush?: boolean;
  reveal?: boolean;
  className?: string;
}

const sizeClass = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
} as const;

/** The one way to open a section: optional eyebrow → two-tone headline → optional lead → actions. */
export function SectionHeader({
  eyebrow,
  title,
  titleMuted,
  lead,
  actions,
  align = "left",
  as = "h2",
  size = "h2",
  flush = false,
  reveal = true,
  className,
}: SectionHeaderProps) {
  const centered = align === "center";

  const copy = (
    <>
      {eyebrow ? <p className="text-label text-ink-2">{eyebrow}</p> : null}
      {createElement(
        as,
        { className: cn(sizeClass[size], "text-ink", centered && "mx-auto max-w-[22ch]") },
        <span className="block">{title}</span>,
        // the space keeps "statement. continuation." readable for screen readers and search engines
        titleMuted ? " " : null,
        titleMuted ? <span className="block text-ink-2">{titleMuted}</span> : null,
      )}
      {lead ? <p className={cn("max-w-measure text-lead text-ink-2", centered && "mx-auto")}>{lead}</p> : null}
    </>
  );

  const Wrap = reveal ? Reveal : "div";

  return (
    <div
      className={cn(
        "flex flex-col gap-8",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between md:gap-12",
        !flush && "mb-header",
        className,
      )}
    >
      {createElement(
        Wrap,
        { ...(reveal ? { stagger: true } : {}), className: cn("flex min-w-0 flex-col gap-5", centered && "items-center") },
        copy,
      )}
      {actions ? <div className={cn("flex shrink-0 flex-wrap items-center gap-3", centered && "justify-center")}>{actions}</div> : null}
    </div>
  );
}
