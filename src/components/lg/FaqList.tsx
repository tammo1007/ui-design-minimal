import { useId, useState, type ReactNode } from "react";
import { Plus } from "./icons";
import { cn } from "@/lib/cn";

export interface FaqItem {
  q: string;
  a: ReactNode;
}

/**
 * Accessible accordion with hairline dividers and a smooth height transition
 * (grid-rows 0fr → 1fr works in every evergreen browser). One item open at a time.
 */
export function FaqList({ items, className }: { items: FaqItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <div className={cn("border-t border-hairline", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="border-b border-hairline">
            <h3>
              <button
                type="button"
                id={`${id}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-a${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-h4 text-ink transition-opacity duration-fast hover:opacity-70"
              >
                {item.q}
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-pill bg-surface-2 text-ink transition-transform duration-base ease-lg-spring",
                    isOpen && "rotate-45",
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-a${i}`}
              ref={(node) => {
                if (node) node.inert = !isOpen;
              }}
              role="region"
              aria-labelledby={`${id}-q${i}`}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-slow ease-lg-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="max-w-measure pb-7 pr-14 text-body text-ink-2">{item.a}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
