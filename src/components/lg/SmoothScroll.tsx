import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const LenisContext = createContext<Lenis | null>(null);

/** Access the Lenis instance (null on touch devices / reduced motion / SSR). */
export const useLenis = () => useContext(LenisContext);

/**
 * Inertial smooth scrolling: desktop with a fine pointer only.
 * Touch devices keep native iOS/Android momentum. Disabled for reduced motion.
 * Pauses automatically while a Radix dialog/sheet locks the body.
 * Mount once at the app root, around the router outlet.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    // in-page anchors are handled by <SmartLink> (Lenis respects scroll-padding-top for the nav offset)
    const instance = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      allowNestedScroll: true,
    });
    setLenis(instance);

    // Radix (react-remove-scroll) marks the body while a modal is open
    const sync = () => {
      const locked = document.body.hasAttribute("data-scroll-locked") || document.documentElement.dataset.lgLocked === "true";
      if (locked) instance.stop();
      else instance.start();
    };
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked", "style"] });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-lg-locked"] });

    return () => {
      mo.disconnect();
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
