import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "./icons";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { useToneUnder, usePrefersReducedMotion } from "./hooks";
import type { NavItem } from "./GlassNav";
import { SmartLink } from "./SmartLink";

interface DockNavProps {
  /** full logo (mark + wordmark) */
  logo: ReactNode;
  /** compact logo for very narrow phones (< 360 px) */
  mark?: ReactNode;
  /** 4–6 items */
  items: NavItem[];
  cta: NavItem;
  /** shorter CTA for phones (< 640 px), e.g. { label: "Test for free", href: "/pricing" }: its own destination */
  ctaShort?: NavItem;
  secondary?: NavItem;
  currentHref?: string;
  homeHref?: string;
}

/**
 * Landing-page navigation. First screen: a Liquid Glass pill floating at the bottom-center
 * (menu left, logo right; the CTA only appears in the docked bar). Scrolling moves it up with the page (pure CSS `position: sticky`, so it
 * is perfectly smooth on iOS); when it reaches the top it docks and morphs into the full-width
 * bar: the same bar GlassNav renders on every other page. Scrolling back reverses it.
 * Phones/tablets (< 1024 px): no pill: the bar is at the top from the start (clear until scrolled).
 * Place it as the FIRST child of the page wrapper (`.lg-page`), directly before <main>.
 */
export function DockNav({ logo, mark, items, cta, ctaShort, secondary, currentHref, homeHref = "/" }: DockNavProps) {
  const headerRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pillToggleRef = useRef<HTMLButtonElement>(null);
  const barToggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [docked, setDocked] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [open, setOpen] = useState(false);
  const reduce = usePrefersReducedMotion();
  const id = useId();
  const tone = useToneUnder(shellRef, headerRef);
  const dark = docked && tone === "dark" && !open;

  // docked = the sticky header has reached the top edge
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = headerRef.current;
      if (el) setDocked(el.getBoundingClientRect().top <= 0.5);
      setAtTop(window.scrollY <= 4);
    };
    const onChange = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);

  // the hidden layout must not be focusable
  useEffect(() => {
    if (pillRef.current) pillRef.current.inert = docked;
    if (barRef.current) barRef.current.inert = !docked;
  }, [docked]);

  // switching between pill and bar closes the menu
  useEffect(() => setOpen(false), [docked]);

  useEffect(() => {
    if (!open) return;
    const sheet = docked; // docked on phones → full-height sheet; pill → small popover above the pill
    const html = document.documentElement;
    if (sheet) {
      html.dataset.dsLocked = "true";
      html.style.overflow = "hidden";
    }
    menuRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      if (sheet) {
        delete html.dataset.dsLocked;
        html.style.overflow = "";
      }
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      (docked ? barToggleRef : pillToggleRef).current?.focus({ preventScroll: true });
    };
  }, [open, docked]);

  const toggle = (ref: typeof pillToggleRef) => (
    <button
      ref={ref}
      type="button"
      aria-expanded={open}
      aria-controls={`${id}-menu`}
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={() => setOpen((v) => !v)}
      className="lg-press grid size-11 place-items-center rounded-pill"
    >
      {open ? <X className="size-5" /> : <Menu className="size-5" />}
    </button>
  );

  const ctaButtons = (extra?: string) =>
    ctaShort ? (
      <>
        <Button asChild size="sm" className={cn("sm:hidden", extra)}>
          <SmartLink href={ctaShort.href}>{ctaShort.label}</SmartLink>
        </Button>
        <Button asChild size="sm" className={cn("hidden sm:inline-flex", extra)}>
          <SmartLink href={cta.href}>{cta.label}</SmartLink>
        </Button>
      </>
    ) : (
      <Button asChild size="sm" className={extra}>
        <SmartLink href={cta.href}>{cta.label}</SmartLink>
      </Button>
    );

  const brand = (
    <SmartLink href={homeHref} className="flex items-center rounded-chip" aria-label="Home">
      {mark ? (
        <>
          <span className="hidden min-[360px]:flex">{logo}</span>
          <span className="flex min-[360px]:hidden">{mark}</span>
        </>
      ) : (
        logo
      )}
    </SmartLink>
  );

  const links = (onClick?: () => void, big = false) =>
    items.map((item, i) => (
      <motion.li
        key={item.href}
        initial={reduce || !big ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04 + i * 0.035, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={big ? "border-b border-hairline" : undefined}
      >
        <SmartLink
          href={item.href}
          onClick={onClick}
          aria-current={currentHref === item.href ? "page" : undefined}
          className={
            big
              ? "flex min-h-14 items-center text-h3 text-ink"
              : "flex min-h-11 items-center rounded-control px-4 text-h4 text-ink transition-colors duration-fast hover:bg-ink/5"
          }
        >
          {item.label}
        </SmartLink>
      </motion.li>
    ));

  return (
    <header ref={headerRef} className="lg-dock" data-docked={docked ? "" : undefined} style={docked ? { paddingTop: "env(safe-area-inset-top)" } : undefined}>
      <nav
        ref={shellRef}
        aria-label="Main"
        data-tone={dark ? "dark" : undefined}
        data-surface={docked && atTop && !open ? "clear" : undefined}
        className={cn("lg-glass lg-dock__shell", open && "lg-glass--thick", dark ? "text-white" : "text-ink")}
      >
        {/* pill (first screen) */}
        <div ref={pillRef} className="lg-dock__pill">
          {toggle(pillToggleRef)}
          {/* logo on the right; no CTA in the pill: the hero right above it carries both buttons, the docked bar keeps it */}
          <span className="col-start-3 justify-self-end pr-4">{brand}</span>
        </div>

        {/* bar (docked) */}
        <div ref={barRef} className="lg-dock__bar">
          <div className="lg-container flex h-full items-center">
            {brand}
            <ul className="ml-10 hidden items-center gap-1 lg:flex">
              {items.map((item) => (
                <li key={item.href}>
                  <SmartLink
                    href={item.href}
                    aria-current={currentHref === item.href ? "page" : undefined}
                    className="rounded-pill px-3 py-2 text-small transition-opacity duration-fast hover:opacity-60"
                  >
                    {item.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
            <div className="ml-auto flex items-center gap-2">
              {secondary ? (
                <SmartLink href={secondary.href} className="hidden rounded-pill px-3 py-2 text-small transition-opacity duration-fast hover:opacity-60 lg:block">
                  {secondary.label}
                </SmartLink>
              ) : null}
              {ctaButtons(dark ? "bg-white text-black hover:bg-white/85" : undefined)}
              <span className="-mr-2 lg:hidden">{toggle(barToggleRef)}</span>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && !docked ? (
          <motion.div
            key="popover"
            id={`${id}-menu`}
            ref={menuRef}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
            className="lg-glass lg-glass--thick lg-dock__menu text-ink"
          >
            <ul className="flex flex-col">{links(() => setOpen(false))}</ul>
            {secondary ? (
              <SmartLink href={secondary.href} onClick={() => setOpen(false)} className="mt-1 flex min-h-11 items-center rounded-control px-4 text-small text-ink-2 hover:bg-ink/5">
                {secondary.label}
              </SmartLink>
            ) : null}
          </motion.div>
        ) : null}
        {open && docked ? (
          <motion.div
            key="sheet"
            id={`${id}-menu`}
            ref={menuRef}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg-glass lg-glass--thick pointer-events-auto fixed inset-x-0 bottom-0 overflow-y-auto text-ink lg:hidden"
            style={{ top: "calc(var(--lg-nav-h) + env(safe-area-inset-top))" }}
            data-lenis-prevent
          >
            <div className="lg-container flex min-h-full flex-col pb-10 pt-4">
              <ul className="flex flex-col">{links(() => setOpen(false), true)}</ul>
              <div className="mt-auto flex flex-col gap-3 pt-10">
                <Button asChild size="lg" className="w-full">
                  <SmartLink href={cta.href} onClick={() => setOpen(false)}>
                    {cta.label}
                  </SmartLink>
                </Button>
                {secondary ? (
                  <Button asChild size="lg" variant="secondary" className="w-full">
                    <SmartLink href={secondary.href} onClick={() => setOpen(false)}>
                      {secondary.label}
                    </SmartLink>
                  </Button>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
