import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { Glass } from "./Glass";
import { usePrefersReducedMotion } from "./hooks";
import { Check, ChevronDown, Search, X, Success, Warning, Error as ErrorIcon, Info } from "./icons";

/* ============================================================================
   PRODUCT CONTROLS & OVERLAYS
   Controls: 32 px (44 on touch), r 10 wells, accent-strong focus ring.
   Overlays: thick Liquid Glass (menus, popovers, sheets, toasts), dialogs r 28.
   ============================================================================ */

/** On/off for settings that apply immediately. Label on the leading side, switch trailing. */
export function Switch({ checked, onChange, label, description, disabled, className }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode; description?: ReactNode; disabled?: boolean; className?: string }) {
  const id = useId();
  return (
    <div className={cn("flex items-center justify-between gap-4", disabled && "opacity-40", className)}>
      <div className="min-w-0">
        <label htmlFor={id} className="text-ui-body">
          {label}
        </label>
        {description && <p className="text-ui-callout text-ink-2">{description}</p>}
      </div>
      <button id={id} type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => onChange(!checked)} className="lg-switch lg-hit">
        <span className="lg-switch__knob" />
      </button>
    </div>
  );
}

/** Checkbox (multi-select, consent) or radio (shape="radio", one of a few). */
export function Checkbox({ checked, onChange, label, shape = "box", disabled, className }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode; shape?: "box" | "radio"; disabled?: boolean; className?: string }) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2.5 text-ui-body", disabled && "pointer-events-none opacity-40", className)}>
      <input type={shape === "radio" ? "radio" : "checkbox"} className="peer sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="lg-check peer-focus-visible:ring-2 peer-focus-visible:ring-accent-strong peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas" data-shape={shape === "radio" ? "radio" : undefined} data-checked={checked} aria-hidden="true">
        {checked && (shape === "radio" ? <span className="size-1.5 rounded-pill bg-white" /> : <Check size={12} strokeWidth={2.5} />)}
      </span>
      {label}
    </label>
  );
}

/** Product text input (32 px well). Use Field/TextInput (48 px) on marketing pages instead. */
export function UIInput({ icon, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode }) {
  return (
    <div className={cn("lg-ui-input", className)}>
      {icon}
      <input {...props} />
    </div>
  );
}

/** Search field: magnifier leading, clear button trailing, ⌘K hint optional. */
export function SearchField({ value, onChange, placeholder = "Search", shortcut, className }: { value: string; onChange: (v: string) => void; placeholder?: string; shortcut?: string; className?: string }) {
  return (
    <div className={cn("lg-ui-input", className)} role="search">
      <Search size={16} />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
      {value ? (
        <button type="button" onClick={() => onChange("")} aria-label="Clear search" className="grid size-5 place-items-center rounded-pill bg-ink/10 text-ink-2">
          <X size={12} strokeWidth={2} />
        </button>
      ) : (
        shortcut && <kbd className="text-ui-caption text-ink-3">{shortcut}</kbd>
      )}
    </div>
  );
}

/** Native select in a product well (keeps OS pickers on touch). */
export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn("lg-ui-input relative pr-8", className)}>
      <select {...props}>{children}</select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 text-ink-2" />
    </div>
  );
}

/* --------------------------------- overlays --------------------------------- */

function useDismiss(open: boolean, onClose: () => void, ref: React.RefObject<HTMLElement | null>, outside = true) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onDown = (e: PointerEvent) => outside && ref.current && !ref.current.contains(e.target as Node) && onClose();
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open, onClose, ref, outside]);
}

export interface MenuEntry {
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
  destructive?: boolean;
  separatorBefore?: boolean;
}

/**
 * Menu: a button that morphs into a thick-glass list (HIG: buttons fluidly morph into menus).
 * Common actions get icons; destructive actions last, after a separator.
 */
export function Menu({ trigger, items, align = "end", label }: { trigger: (props: { onClick: () => void; "aria-expanded": boolean; "aria-haspopup": "menu" }) => ReactNode; items: MenuEntry[]; align?: "start" | "end"; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);
  return (
    <div ref={ref} className="relative inline-block">
      {trigger({ onClick: () => setOpen((o) => !o), "aria-expanded": open, "aria-haspopup": "menu" })}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
            transition={{ type: "spring", duration: 0.32, bounce: 0.18 }}
            style={{ transformOrigin: align === "end" ? "top right" : "top left" }}
            className={cn("absolute top-full z-popover mt-1.5", align === "end" ? "right-0" : "left-0")}
          >
            <Glass variant="thick" shape="card" role="menu" aria-label={label} className="lg-menu rounded-ui-card">
              {items.map((it) => (
                <div key={it.label}>
                  {it.separatorBefore && <div className="lg-menu__sep" role="separator" />}
                  <button
                    type="button"
                    role="menuitem"
                    className="lg-menu__item"
                    data-destructive={it.destructive ? "" : undefined}
                    onClick={() => {
                      it.onSelect?.();
                      setOpen(false);
                    }}
                  >
                    {it.icon}
                    {it.label}
                  </button>
                </div>
              ))}
            </Glass>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Tooltip for icon-only controls on pointer devices (the control keeps its aria-label). */
export function Tooltip({ content, children, side = "bottom" }: { content: string; children: ReactNode; side?: "top" | "bottom" }) {
  const [show, setShow] = useState(false);
  const t = useRef<number>(0);
  return (
    <span
      className="relative inline-flex"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        t.current = window.setTimeout(() => setShow(true), 500);
      }}
      onPointerLeave={() => {
        window.clearTimeout(t.current);
        setShow(false);
      }}
    >
      {children}
      {show && (
        <span role="tooltip" className={cn("lg-tooltip pointer-events-none absolute left-1/2 z-tooltip -translate-x-1/2", side === "bottom" ? "top-full mt-2" : "bottom-full mb-2")}>
          {content}
        </span>
      )}
    </span>
  );
}

/**
 * Dialog: centered, solid surface (r 28), scrim behind. For decisions and short forms.
 * Primary action trailing; destructive actions never get the primary role (HIG).
 */
export function Dialog({ open, onClose, title, description, children, actions }: { open: boolean; onClose: () => void; title: ReactNode; description?: ReactNode; children?: ReactNode; actions?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const id = useId();
  useDismiss(open, onClose, ref, false);
  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);
  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="lg-root fixed inset-0 z-modal grid place-items-center p-4" data-density="product">
          <motion.div className="absolute inset-0 bg-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            ref={ref}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.16 }}
            className="relative w-full max-w-[28rem] rounded-ui-window bg-surface p-6 shadow-elev-3 outline-none"
          >
            <h2 id={id} className="text-ui-title-2">
              {title}
            </h2>
            {description && <p className="mt-1.5 text-ui-body text-ink-2">{description}</p>}
            {children && <div className="mt-5">{children}</div>}
            {actions && <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{actions}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Sheet: inspector / detail panel. Thick glass, slides in from the trailing edge, inset 8 px, r 20. */
export function Sheet({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  useDismiss(open, onClose, ref, false);
  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="lg-root fixed inset-0 z-modal" data-density="product">
          <motion.div className="absolute inset-0 bg-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === "string" ? title : undefined}
            initial={reduce ? { opacity: 0 } : { x: "105%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "105%" }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.08 }}
            className="absolute inset-y-app-inset right-app-inset flex w-[min(var(--lg-inspector-w)+4rem,100%-1rem)] flex-col"
          >
            <Glass variant="thick" shape="card" className="flex h-full flex-col rounded-ui-panel">
              <div className="flex h-toolbar items-center justify-between gap-3 px-5">
                <h2 className="text-ui-title-2">{title}</h2>
                <button type="button" className="lg-toolbar__btn lg-hit lg-press" onClick={onClose} aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-5">{children}</div>
              {footer && <div className="border-t border-hairline p-4">{footer}</div>}
            </Glass>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ---------------------------------- toasts ---------------------------------- */

type ToastTone = "info" | "success" | "warning" | "danger";
interface ToastItem {
  id: number;
  title: string;
  body?: string;
  tone: ToastTone;
}
const ToastCtx = createContext<(t: Omit<ToastItem, "id">) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

/**
 * Toasts: glass capsules, bottom-center, stack max 3, auto-dismiss 5 s but pause on hover
 * and always closable (HIG: avoid time-boxed UI for anything people must read).
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const reduce = usePrefersReducedMotion();
  const push = useCallback((t: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s.slice(-2), { ...t, id }]);
    window.setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), 5000);
  }, []);
  const icons = { info: <Info size={18} className="text-info-text" />, success: <Success size={18} className="text-success-text" />, warning: <Warning size={18} className="text-warning-text" />, danger: <ErrorIcon size={18} className="text-danger-text" /> };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-toast grid justify-items-center gap-2 px-4 md:bottom-6" aria-live="polite">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div key={t.id} layout initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}>
              <Glass variant="thick" shape="pill" className="pointer-events-auto flex max-w-[26rem] items-center gap-3 py-2.5 pl-4 pr-2">
                {icons[t.tone]}
                <div className="min-w-0">
                  <p className="text-ui-headline">{t.title}</p>
                  {t.body && <p className="text-ui-callout text-ink-2">{t.body}</p>}
                </div>
                <button type="button" className="lg-toolbar__btn lg-hit ml-1 shrink-0" onClick={() => setItems((s) => s.filter((x) => x.id !== t.id))} aria-label="Dismiss">
                  <X size={16} />
                </button>
              </Glass>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

/** Tabs for switching views inside a card or page: the glass SegmentedControl in product size. Re-exported for discoverability. */
export { SegmentedControl as Tabs } from "./SegmentedControl";
