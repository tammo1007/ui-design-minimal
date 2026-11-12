import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { dsWarn, useIsoLayoutEffect } from "./hooks";

type Fit = "contain" | "bleed";
type StageSize = "story" | "card" | "panel" | "hero" | "auto";
export type StageBackdrop = "none" | "subtle" | "cool" | "lilac" | "warm" | "mint";
type Backdrop = StageBackdrop;

interface DeviceStageProps {
  /** the device at its natural size: <PhoneFrame>, <WindowFrame> or a fixed-size composition */
  children: ReactNode;
  /**
   * contain: fully visible, centered, equal inset on all sides (story panels).
   * bleed  : anchored to the top inset, cropped by the bottom edge (cards, hero). Size the stage so
   *           60–85 % of the device stays visible: a crop of only a few pixels looks like a mistake.
   */
  fit?: Fit;
  /** height preset: story (sticky panel) · card (25/26rem) · panel (25/32rem, AccordionShowcase) · hero · auto (set your own) */
  size?: StageSize;
  backdrop?: Backdrop;
  /** rounded panel corners (r 28 / 20): for stand-alone stages; omit inside cards (the card clips) */
  rounded?: boolean;
  /** never upscale beyond this (default 1 = native size) */
  maxScale?: number;
  className?: string;
}

// Literal class names: Tailwind only keeps classes it can find as complete strings in the source.
const sizeClass: Record<StageSize, string> = {
  story: "lg-stage--story",
  card: "lg-stage--card",
  panel: "lg-stage--panel",
  hero: "lg-stage--hero",
  auto: "",
};
export const backdropClass: Record<Backdrop, string> = {
  none: "",
  subtle: "lg-backdrop--subtle",
  cool: "lg-backdrop--cool",
  lilac: "lg-backdrop--lilac",
  warm: "lg-backdrop--warm",
  mint: "lg-backdrop--mint",
};

/**
 * Stage for product devices. Measures the available space and scales the device so it always
 * keeps the same inset (--lg-stage-pad: 32 → 56 px): at every viewport size, no overflow,
 * no accidental crops. Works for real screenshots and for HTML mockups alike.
 */
export function DeviceStage({
  children,
  fit = "contain",
  size = "auto",
  backdrop = "none",
  rounded = false,
  maxScale = 1,
  className,
}: DeviceStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useIsoLayoutEffect(() => {
    const stage = stageRef.current;
    const device = deviceRef.current;
    if (!stage || !device) return;
    let warned = false;
    const measure = () => {
      const cs = getComputedStyle(stage);
      const w = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const h = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const nw = device.offsetWidth;
      const nh = device.offsetHeight;
      if (w <= 0 || nw <= 0 || nh <= 0) return;
      const byWidth = w / nw;
      const next = fit === "contain" ? Math.min(maxScale, byWidth, h / nh) : Math.min(maxScale, byWidth);
      setScale(Math.round(next * 1000) / 1000);
      if (fit === "bleed" && !warned) {
        const visible = (stage.clientHeight - parseFloat(cs.paddingTop)) / (nh * next);
        if (visible < 0.55 || visible > 0.9) {
          warned = true;
          dsWarn(`DeviceStage bleed shows ${Math.round(visible * 100)}% of the device: keep it between 60 and 85% (adjust the stage height).`, stage);
        }
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    ro.observe(device);
    return () => ro.disconnect();
  }, [fit, maxScale]);

  return (
    <div
      ref={stageRef}
      data-fit={fit}
      className={cn(
        "lg-stage",
        sizeClass[size],
        backdropClass[backdrop],
        rounded && "lg-panel",
        className,
      )}
      style={{ "--lg-device-scale": scale } as CSSProperties}
    >
      <div ref={deviceRef} className="lg-stage__device">
        {children}
      </div>
    </div>
  );
}
