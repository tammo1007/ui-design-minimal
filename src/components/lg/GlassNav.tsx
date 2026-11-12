import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "./icons";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { useToneUnder, usePrefersReducedMotion } from "./hooks";
import { SmartLink } from "./SmartLink";

export interface NavItem {
  label: string;
  href: string;
}

interface GlassNavProps {
  logo: ReactNode;
  /** 4–6 items */
  items: NavItem[];
  cta: NavItem;
  /** quiet text link on desktop, e.g. "Sign in" */
  secondary?: NavItem;
  currentHref?: string;
  homeHref?: string;
}

/**
 * Full-width navigation bar (64px · 56px on phones).
 * Transparent at the top of the page → Liquid Glass with a bottom hairline once scrolled.
 * Switches to the dark material over dark sections. Phone menu opens as a thick glass sheet.
 */
export function GlassNav({ logo, items, cta, secondary, currentHref, homeHref = "/" }: GlassNavProps) {
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = usePrefersReducedMotion();
  const id = useId();
  const tone = useToneUnder(navRef, headerRef);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.dataset.dsLocked = "true";
    html.style.overflow = "hidden";
    sheetRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mql = window.matchMedia("(min-width: 1024px)");
    const onMql = () => mql.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mql.addEventListener("change", onMql);
    return () => {
      delete html.dataset.dsLocked;
      html.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      mql.removeEventListener("change", onMql);
      toggleRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const dark = tone === "dark" && !open;
  const surface = scrolled || open ? "glass" : "clear";

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-nav" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <nav
        ref={navRef}
        aria-label="Main"
        data-surface={surface}
        data-tone={dark ? "dark" : undefined}
        className={cn("lg-glass lg-navbar", open && "lg-glass--thick", dark ? "text-white" : "text-ink")}
      >
        <div className="lg-container flex h-full items-center">
          <SmartLink href={homeHref} className="flex shrink-0 items-center rounded-chip" aria-label="Home">
            {logo}
          </SmartLink>

          <ul className="ml-10 hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <li key={item.href}>
                <SmartLink
                  href={item.href}
                  aria-current={currentHref === item.href ? "page" : undefined}
                  className={cn(
                    "rounded-pill px-3 py-2 text-small transition-opacity duration-fast hover:opacity-60",
                    currentHref === item.href && "font-medium",
                  )}
                >
                  {item.label}
                </SmartLink>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-2">
            {secondary ? (
              <SmartLink
                href={secondary.href}
                className="hidden rounded-pill px-3 py-2 text-small transition-opacity duration-fast hover:opacity-60 lg:block"
              >
                {secondary.label}
              </SmartLink>
            ) : null}
            <Button asChild size="sm" className={cn("hidden sm:inline-flex", dark && "bg-white text-black hover:bg-white/85")}>
              <SmartLink href={cta.href}>{cta.label}</SmartLink>
            </Button>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls={`${id}-sheet`}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="lg-press -mr-2 grid size-10 place-items-center rounded-pill lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="sheet"
            id={`${id}-sheet`}
            ref={sheetRef}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg-glass lg-glass--thick fixed inset-x-0 bottom-0 overflow-y-auto lg:hidden"
            style={{ top: "calc(var(--lg-nav-h) + env(safe-area-inset-top))" }}
            data-lenis-prevent
          >
            <div className="lg-container flex min-h-full flex-col pb-10 pt-4">
              <ul className="flex flex-col">
                {items.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-hairline"
                  >
                    <SmartLink
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={currentHref === item.href ? "page" : undefined}
                      className="flex min-h-14 items-center text-h3 text-ink"
                    >
                      {item.label}
                    </SmartLink>
                  </motion.li>
                ))}
              </ul>
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
