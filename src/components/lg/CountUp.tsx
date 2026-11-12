import { useEffect, useMemo, useRef } from "react";
import { animate } from "motion/react";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "./hooks";

interface CountUpProps {
  value: number;
  /** seconds */
  duration?: number;
  locale?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/** Number that counts up once when it enters the viewport. SSR renders the final value. */
export function CountUp({ value, duration = 1.6, locale = "en-US", decimals = 0, prefix = "", suffix = "", className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = useMemo(
    () => new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
    [locale, decimals],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const render = (v: number) => (el.textContent = `${prefix}${fmt.format(v)}${suffix}`);
    render(0);
    let stop: (() => void) | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const controls = animate(0, value, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: render });
        stop = () => controls.stop();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop?.();
      render(value);
    };
  }, [value, duration, fmt, prefix, suffix]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {fmt.format(value)}
      {suffix}
    </span>
  );
}
