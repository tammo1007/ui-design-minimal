import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must know the design-system class names, otherwise it treats
 * e.g. `text-h2` as a text COLOR and silently drops it next to `text-ink`.
 * Keep these lists in sync with src/styles/lg-tailwind.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "hero", "display", "h1", "h2", "h3", "h4", "lead", "body", "small", "caption", "label", "stat",
            "ui-large-title", "ui-title-1", "ui-title-2", "ui-title-3", "ui-headline", "ui-body", "ui-callout", "ui-subhead", "ui-caption", "ui-metric", "ui-metric-lg",
          ],
        },
      ],
      rounded: [{ rounded: ["chip", "control", "card", "panel", "pill", "ui-control", "ui-card", "ui-panel", "ui-window"] }],
      shadow: [{ shadow: ["elev-1", "elev-2", "elev-3", "elev-device", "glass", "hairline"] }],
      "max-w": [{ "max-w": ["text", "content", "wide", "heading", "measure"] }],
      h: [{ h: ["control-xs", "control-sm", "control-md", "control-lg", "row-compact", "row", "row-comfy", "toolbar"] }],
    },
  },
});

/** Design-system aware `cn`: always use this one (never plain clsx) so token classes merge correctly. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
