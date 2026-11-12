import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  type AnchorHTMLAttributes,
  type ComponentType,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";
import { useLenis } from "./SmoothScroll";

/**
 * LINKS: every link in a Liquid Glass project renders through <SmartLink href>.
 *  - "https://…", "mailto:", "tel:"  → plain <a> (target="_blank" gets rel="noopener noreferrer")
 *  - "#id" or "/current#id"          → smooth in-page scroll (Lenis when active), nav offset via scroll-padding
 *  - "/path"                         → your router's Link if a LinkAdapter is provided, else a plain <a>
 *
 * Router-agnostic. Wire your router ONCE at the app root:
 *   <LinkAdapterProvider component={RouterLinkAdapter}>…</LinkAdapterProvider>
 * where RouterLinkAdapter is e.g. ({ href, ...p }) => <Link to={href} {...p} /> (React Router, TanStack, Next).
 */

export type LinkAdapter = ComponentType<AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; ref?: Ref<HTMLAnchorElement> }>;

const LinkAdapterContext = createContext<LinkAdapter | null>(null);

export function LinkAdapterProvider({ component, children }: { component: LinkAdapter; children: ReactNode }) {
  return <LinkAdapterContext.Provider value={component}>{children}</LinkAdapterContext.Provider>;
}

export const isExternalHref = (href: string) => /^(https?:)?\/\//.test(href) || /^(mailto|tel):/.test(href);

export interface SmartLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const currentPath = () => (typeof window === "undefined" ? "" : window.location.pathname);

/** smooth-scrolls to an element (or the top). Lenis on desktop, native elsewhere; both honour scroll-padding-top */
export function scrollToId(id: string, lenis: ReturnType<typeof useLenis>, immediate = false) {
  const el = document.getElementById(id);
  if (!el && id !== "top") return false;
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(el ?? 0, { immediate, force: true });
  } else {
    const smooth = !immediate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (el) el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    else window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  }
  return true;
}

export const SmartLink = forwardRef<HTMLAnchorElement, SmartLinkProps>(function SmartLink({ href, rel, target, onClick, ...rest }, ref) {
  const lenis = useLenis();
  const Adapter = useContext(LinkAdapterContext);

  if (isExternalHref(href)) {
    return <a ref={ref} href={href} target={target} rel={target === "_blank" ? ["noopener", "noreferrer", rel].filter(Boolean).join(" ") : rel} onClick={onClick} {...rest} />;
  }

  const hashAt = href.indexOf("#");
  const path = hashAt === -1 ? href : href.slice(0, hashAt);
  const hash = hashAt === -1 ? "" : href.slice(hashAt);

  if (hash && (path === "" || path === currentPath())) {
    const handle = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (scrollToId(decodeURIComponent(hash.slice(1)), lenis)) {
        e.preventDefault();
        window.history.replaceState(window.history.state, "", hash);
      }
    };
    return <a ref={ref} href={hash} target={target} rel={rel} onClick={handle} {...rest} />;
  }
  if (Adapter) return <Adapter ref={ref} href={href} target={target} rel={rel} onClick={onClick} {...rest} />;
  return <a ref={ref} href={href} target={target} rel={rel} onClick={onClick} {...rest} />;
});

/**
 * Optional. Mount once per page: when the URL has a hash on load ("/#pricing" from another page),
 * it jumps to that section as soon as it exists (lazy content), without animation.
 */
export function ScrollManager() {
  const lenis = useLenis();
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let tries = 0;
    const timer = window.setInterval(() => {
      if (scrollToId(id, lenis, true) || ++tries > 40) window.clearInterval(timer);
    }, 50);
    return () => window.clearInterval(timer);
  }, [lenis]);
  return null;
}
