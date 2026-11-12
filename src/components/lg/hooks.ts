import { useEffect, useLayoutEffect, useState, type RefObject } from "react";

/** SSR-safe layout effect (works with server rendering). */
export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * SSR-safe media query. Returns `ssrDefault` on the server and during hydration (so server and client
 * markup match), then the real value before the first paint (layout effect).
 */
export function useMediaQuery(query: string, ssrDefault = false) {
  const [matches, setMatches] = useState(ssrDefault);
  useIsoLayoutEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/** use this instead of motion's useReducedMotion: hydration-safe (false on the server and first client render) */
export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Dev-only design-system warnings. Lovable reads console output from the preview. */
export function dsWarn(message: string, el?: Element | null) {
  if (!import.meta.env?.DEV) return;
  console.warn(`[LG] ${message}`, el ?? "");
}

/**
 * Which theme is underneath a floating element? Used by the nav and the sticky CTA so
 * Liquid Glass switches to its dark material over dark sections (Apple: glass adapts).
 */
export function useToneUnder(ref: RefObject<HTMLElement | null>, skipRef?: RefObject<HTMLElement | null>) {
  const [tone, setTone] = useState<"light" | "dark">("light");
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const skip = skipRef?.current ?? el;
      const stack = document.elementsFromPoint(r.left + r.width / 2, r.top + Math.min(r.height, 56) / 2);
      const under = stack.find((n) => !skip.contains(n));
      // a device screen (dark app UI in a phone or window) is content, not a dark section: read past it
      const device = under?.closest(".lg-phone, .lg-window");
      const host = device ? device.parentElement : under;
      setTone(host?.closest("[data-theme]")?.getAttribute("data-theme") === "dark" ? "dark" : "light");
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
  }, [ref, skipRef]);
  return tone;
}
