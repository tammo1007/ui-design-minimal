import { forwardRef, useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/cn";
import { dsWarn, usePrefersReducedMotion } from "./hooks";

type Tone = "light" | "subtle" | "dark";
type Spacing = "none" | "sm" | "md" | "lg";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** light (default, white) · subtle (#F5F5F7) · dark (max 2 per page, never first, never adjacent) */
  tone?: Tone;
  /** vertical rhythm from tokens: sm 56→104 · md 80→160 (default) · lg 96→192 */
  spacing?: Spacing;
  /** render subtle/dark sections as a rounded panel inset from the viewport edges */
  inset?: boolean;
  /** first section of a subpage: adds the floating-nav height on top of the normal spacing */
  offsetNav?: boolean;
  children?: ReactNode;
}

const spacingVar: Record<Spacing, string> = {
  none: "0px",
  sm: "var(--lg-section-y-sm)",
  md: "var(--lg-section-y)",
  lg: "var(--lg-section-y-lg)",
};

const spacingClass: Record<Spacing, string> = {
  none: "",
  sm: "py-section-sm",
  md: "py-section",
  lg: "py-section-lg",
};

let auditTimer: number | undefined;
function auditSections() {
  window.clearTimeout(auditTimer);
  auditTimer = window.setTimeout(() => {
    const all = Array.from(document.querySelectorAll<HTMLElement>("[data-lg-section]"));
    const dark = all.filter((s) => s.dataset.theme === "dark");
    if (dark.length > 2) dsWarn(`${dark.length} dark sections on this page: max is 2.`);
    if (all[0]?.dataset.theme === "dark") dsWarn("First section is dark: the first section must be light.", all[0]);
    all.forEach((s, i) => {
      if (i > 0 && s.dataset.theme === "dark" && all[i - 1].dataset.theme === "dark")
        dsWarn("Two dark sections are adjacent: separate them with a light section.", s);
    });
  }, 400);
}

/** Every page block is a <Section>. It owns background, theme tokens and vertical spacing. */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { tone = "light", spacing = "md", inset = false, offsetNav = false, className, style, children, ...props },
  forwardedRef,
) {
  const localRef = useRef<HTMLElement | null>(null);
  const reduce = usePrefersReducedMotion();
  const theme = tone === "dark" ? "dark" : "light";
  const isInset = inset && tone !== "light";

  const { scrollYProgress } = useScroll({ target: localRef, offset: ["start end", "start 0.35"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  useEffect(() => {
    auditSections();
  }, [tone]);

  const setRefs = (node: HTMLElement | null) => {
    localRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  const common = {
    "data-lg-section": "",
    // light sections inherit the page theme (light or dark page); dark sections force the dark tokens
    "data-theme": theme === "dark" ? "dark" : undefined,
    ...props,
  };
  const navStyle = offsetNav ? { paddingTop: `calc(var(--lg-nav-offset) + ${spacingVar[spacing]})` } : undefined;

  if (isInset) {
    return (
      <div className="bg-canvas">
        <motion.section
          ref={setRefs}
          {...(common as object)}
          style={{ ...style, ...navStyle, ...(reduce ? {} : { scale }) }}
          className={cn(
            "lg-inset-panel relative",
            tone === "subtle" ? "lg-on-subtle bg-canvas-subtle" : "bg-canvas",
            spacingClass[spacing],
            className,
          )}
        >
          {children}
        </motion.section>
      </div>
    );
  }

  return (
    <section
      ref={setRefs}
      {...common}
      style={{ ...style, ...navStyle }}
      className={cn("relative", tone === "subtle" ? "lg-on-subtle bg-canvas-subtle" : "bg-canvas", spacingClass[spacing], className)}
    >
      {children}
    </section>
  );
});
