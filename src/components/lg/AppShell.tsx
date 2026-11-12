import { createContext, useContext, useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glass } from "./Glass";
import { SmartLink } from "./SmartLink";
import { Menu, X, Columns } from "./icons";
import type { IconProps } from "./icons";

/* ============================================================================
   APP SHELL: the frame of every product page (dashboard, admin, settings).
   Floating Liquid Glass sidebar (8 px inset, r 20) · content on canvas-subtle ·
   sticky toolbar with scroll edge effect · phone tab bar. Product type scale only.
   ============================================================================ */

export interface AppNavItem {
  label: string;
  href: string;
  icon: ComponentType<IconProps>;
  /** small count on the trailing side, e.g. unread items */
  badge?: string | number;
  /** show in the phone tab bar (max 5) */
  tab?: boolean;
}
export interface AppNavSection {
  /** section title in sentence case, never ALL CAPS. Omit for the first section. */
  title?: string;
  items: AppNavItem[];
}

interface AppShellProps {
  /** logo or product name (top of the sidebar) */
  brand: ReactNode;
  /** max 2 levels of hierarchy (HIG); 3 to 9 items in the first section */
  nav: AppNavSection[];
  currentHref: string;
  /** pinned to the bottom of the sidebar: account, settings */
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AppShell({ brand, nav, currentHref, footer, children, className }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const tabs = nav.flatMap((s) => s.items).filter((i) => i.tab).slice(0, 5);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <AppShellContext.Provider value={{ toggleSidebar: () => setOpen((o) => !o), toggleCollapsed: () => setCollapsed((c) => !c), collapsed }}>
      <div className={cn("lg-root lg-app", className)} data-density="product" data-sidebar={collapsed ? "collapsed" : "expanded"} data-sidebar-open={open ? "" : undefined}>
        <Glass as="aside" variant="thick" shape="card" className="lg-app__sidebar" aria-label="Main navigation">
          <div className="flex h-toolbar items-center justify-between gap-2 px-4">
            <div className="lg-sidebar__label min-w-0 truncate">{brand}</div>
            <button type="button" className="lg-toolbar__btn lg-hit lg-press lg:hidden" aria-label="Close navigation" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-2.5 pb-2">
            {nav.map((section, i) => (
              <div key={section.title ?? i} role="group" aria-label={section.title}>
                {section.title && <div className="lg-sidebar__section-title">{section.title}</div>}
                <ul className="grid gap-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const current = item.href === currentHref;
                    return (
                      <li key={item.href}>
                        <SmartLink href={item.href} className="lg-sidebar__item" aria-current={current ? "page" : undefined} title={collapsed ? item.label : undefined} onClick={() => setOpen(false)}>
                          <Icon />
                          <span className="lg-sidebar__label flex-1 truncate">{item.label}</span>
                          {item.badge != null && <span className="lg-sidebar__badge text-ui-subhead tabular-nums text-ink-2">{item.badge}</span>}
                        </SmartLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          {footer && <div className="border-t border-hairline p-2.5">{footer}</div>}
        </Glass>
        {open && <div className="lg-app__scrim lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}
        <div className="lg-app__main">{children}</div>
        {tabs.length > 1 && (
          <Glass as="nav" shape="pill" className="lg-tabbar" aria-label="Tabs">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <SmartLink key={t.href} href={t.href} className="lg-tabbar__tab lg-press" aria-current={t.href === currentHref ? "page" : undefined}>
                  <Icon />
                  {t.label}
                </SmartLink>
              );
            })}
          </Glass>
        )}
      </div>
    </AppShellContext.Provider>
  );
}

const AppShellContext = createContext<{ toggleSidebar: () => void; toggleCollapsed: () => void; collapsed: boolean } | null>(null);
export const useAppShell = () => useContext(AppShellContext);

/* ----------------------------------------------------------------------------
   TOOLBAR: leading (sidebar toggle + title) · center (optional) · trailing groups.
   Max 3 groups. One prominent action, always last on the trailing side.
   ---------------------------------------------------------------------------- */
interface ToolbarProps {
  /** view title, under 15 characters (HIG); never the app name */
  title: ReactNode;
  /** optional subtitle / breadcrumb shown under the title on wide screens */
  subtitle?: ReactNode;
  center?: ReactNode;
  /** ToolbarGroup elements and finally the one prominent <Button variant="accent" size="ui"> */
  actions?: ReactNode;
  className?: string;
}

export function Toolbar({ title, subtitle, center, actions, className }: ToolbarProps) {
  const ref = useRef<HTMLElement>(null);
  const shell = useAppShell();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header ref={ref} className={cn("lg-toolbar", className)} data-scrolled={scrolled ? "" : undefined}>
      {shell && (
        <>
          <button type="button" className="lg-toolbar__btn lg-hit lg-press lg:hidden" aria-label="Open navigation" onClick={shell.toggleSidebar}>
            <Menu size={18} />
          </button>
          <button
            type="button"
            className="lg-toolbar__btn lg-hit lg-press hidden lg:inline-grid"
            aria-label={shell.collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={shell.collapsed}
            onClick={shell.toggleCollapsed}
          >
            <Columns size={18} />
          </button>
        </>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-ui-title-2">{title}</h1>
        {subtitle && <p className="hidden truncate text-ui-subhead text-ink-2 sm:block">{subtitle}</p>}
      </div>
      {center && <div className="hidden md:block">{center}</div>}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

/** A set of related toolbar actions sharing one glass capsule. Icons OR text labels, never mixed. */
export function ToolbarGroup({ children, label, className }: { children: ReactNode; label: string; className?: string }) {
  return (
    <Glass shape="pill" role="group" aria-label={label} className={cn("lg-toolbar__group", className)}>
      {children}
    </Glass>
  );
}

interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** required for icon-only buttons */
  "aria-label"?: string;
  pressed?: boolean;
}
export function ToolbarButton({ className, pressed, ...props }: ToolbarButtonProps) {
  return <button type="button" className={cn("lg-toolbar__btn lg-press", className)} aria-pressed={pressed} {...props} />;
}

/** Page content wrapper inside AppShell: max 1440 wide, app padding, 24 px bottom space above the phone tab bar. */
export function AppContent({ children, className, width = "wide" }: { children: ReactNode; className?: string; width?: "wide" | "text" | "full" }) {
  return (
    <main
      id="main"
      className={cn(
        "mx-auto w-full px-app pb-24 pt-2 md:pb-10",
        width === "wide" && "max-w-wide",
        width === "text" && "max-w-text",
        className,
      )}
    >
      {children}
    </main>
  );
}

/** Section heading inside product pages: title-3 + optional trailing action. Sentence case, no ALL CAPS. */
export function UISectionHeader({ title, description, action, className }: { title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-3 flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 className="text-ui-title-3">{title}</h2>
        {description && <p className="mt-0.5 text-ui-callout text-ink-2">{description}</p>}
      </div>
      {action}
    </div>
  );
}
