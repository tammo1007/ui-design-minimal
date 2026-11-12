import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "./hooks";

export interface SegmentOption<T extends string> {
  value: T;
  label: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
  size?: "sm" | "md";
  /** stretch to full width (mobile) */
  block?: boolean;
  className?: string;
}

/**
 * Liquid Glass segmented control (tabs, Monthly/Yearly, feature switcher).
 * Glass capsule + a solid chip that glides to the selected option. Arrow-key navigation.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  block = false,
  className,
  ...aria
}: SegmentedControlProps<T>) {
  const id = useId();
  const reduce = usePrefersReducedMotion();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = options.findIndex((o) => o.value === value);
    const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (idx + delta + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={aria["aria-label"]}
      onKeyDown={onKeyDown}
      className={cn("lg-glass rounded-pill p-1", block ? "flex w-full" : "inline-flex w-fit", className)}
    >
      {options.map((o, i) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={cn(
              "lg-press relative flex flex-1 items-center justify-center whitespace-nowrap rounded-pill font-medium transition-colors duration-fast",
              size === "sm" ? "h-8 px-3 text-caption" : "h-9 px-4 text-small",
              selected ? "text-ink" : "text-ink-2 hover:text-ink",
            )}
          >
            {selected ? (
              <motion.span
                layoutId={`${id}-indicator`}
                className="lg-segment-indicator absolute inset-0 rounded-pill"
                transition={reduce ? { duration: 0 } : { type: "spring", bounce: 0.18, duration: 0.5 }}
 />
            ) : null}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
