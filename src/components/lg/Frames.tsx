import { version } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { Lock } from "./icons";
import { cn } from "@/lib/cn";

// React 19 knows `fetchPriority`; React 18 only passes the lowercase DOM attribute through
const FETCH_PRIORITY = Number.parseInt(version, 10) >= 19 ? "fetchPriority" : "fetchpriority";

/** Atmospheric brand haze for the dark showcase. Parent: `relative isolate overflow-clip`. */
export function Haze({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("lg-haze", className)} />;
}

/** Light aurora in brand colours for the landing hero (behind the floating device). Parent: `.lg-hero`. */
export function Aurora({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("lg-aurora", className)} />;
}

/** Clean iOS status bar (9:41, full signal, full battery) drawn over a screenshot's own status bar. */
function PhoneStatusBar() {
  return (
    <div className="lg-phone__status" aria-hidden="true">
      <span>9:41</span>
      <span>
        <svg width="12" height="8" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="11" height="8" viewBox="0 0 15 11" fill="currentColor">
          <path d="M7.5 2.2c2 0 3.9.8 5.3 2.1l1.1-1.2A9.2 9.2 0 0 0 7.5.5 9.2 9.2 0 0 0 1.1 3.1l1.1 1.2A7.6 7.6 0 0 1 7.5 2.2Zm0 3.3c1.1 0 2.2.4 3 1.2l1.1-1.2A6 6 0 0 0 7.5 3.8a6 6 0 0 0-4.1 1.7l1.1 1.2c.8-.8 1.9-1.2 3-1.2Zm0 3.3c-.4 0-.8.2-1 .5l1 1.1 1-1.1c-.2-.3-.6-.5-1-.5Z" />
        </svg>
        <svg width="18" height="9" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="18" height="8" rx="2" fill="currentColor" />
          <path d="M23 4v4c.8-.3 1.3-1.1 1.3-2S23.8 4.3 23 4Z" fill="currentColor" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}

interface PhoneFrameProps extends HTMLAttributes<HTMLDivElement> {
  /** HTML screen (illustrations). Ignored when `src` is set. */
  children?: ReactNode;
  /** Real app screenshot (any iPhone export, 9 : 19.5). Its status bar is covered by a clean 9:41 bar. */
  src?: string;
  alt?: string;
  /** Theme of the screenshot: colours the status bar and the screen background. */
  screen?: "light" | "dark";
  /** LCP image (hero only): eager + high fetch priority. */
  priority?: boolean;
  /** optional 528 px wide copy of `src` (2x the 264 px screen): phones with 2x screens download it instead of the full export */
  srcSmall?: string;
  /** Subtle glass glare across the screen (floating hero device). */
  glare?: boolean;
  /** HTML screens (`children`): draw the clean 9:41 status bar and paint the app background of `screen`. Start your content below the band (6.8 % of the screen height). */
  statusBar?: boolean;
}

/** Phone frame, 280 × 588 (screen 264 × 572 = iPhone aspect, screenshots fit 1:1). Always inside a DeviceStage or FloatingDevice. */
export function PhoneFrame({ children, src, srcSmall, alt = "", screen = "light", priority = false, glare = false, statusBar = false, className, ...props }: PhoneFrameProps) {
  return (
    <div className={cn("lg-phone", className)} {...props}>
      <div className="lg-phone__island" aria-hidden="true" />
      <div className="lg-phone__screen" data-theme={screen} data-screen={src || statusBar ? screen : undefined}>
        {src ? (
          <>
            <img
              src={src}
              srcSet={srcSmall ? `${srcSmall} 528w, ${src} 720w` : undefined}
              sizes={srcSmall ? "(min-width: 1024px) 360px, 264px" : undefined}
              alt={alt}
              width={738}
              height={1600}
              loading={priority ? "eager" : "lazy"}
              decoding={priority ? "sync" : "async"}
              {...({ [FETCH_PRIORITY]: priority ? "high" : undefined } as Record<string, string | undefined>)}
              className="lg-phone__img"
 />
            <PhoneStatusBar />
          </>
        ) : (
          <>
            {children}
            {statusBar ? <PhoneStatusBar /> : null}
          </>
        )}
        {glare ? <span className="lg-phone__glare" aria-hidden="true" /> : null}
      </div>
    </div>
  );
}

interface WindowFrameProps extends HTMLAttributes<HTMLDivElement> {
  /** shown in the address bar */
  url?: string;
  children?: ReactNode;
}

/** Browser window frame for web-app screenshots (organizer dashboard). */
export function WindowFrame({ url = "app.example.com", children, className, ...props }: WindowFrameProps) {
  return (
    <div className={cn("lg-window", className)} data-theme="light" {...props}>
      <div className="flex h-10 items-center gap-3 border-b border-hairline bg-canvas-subtle px-4">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-3 rounded-pill bg-[#FF5F57]" />
          <span className="size-3 rounded-pill bg-[#FEBC2E]" />
          <span className="size-3 rounded-pill bg-[#28C840]" />
        </span>
        <span className="mx-auto flex h-6 min-w-0 max-w-xs flex-1 items-center justify-center gap-1.5 rounded-chip bg-surface px-3 text-[0.75rem] text-ink-2 shadow-hairline">
          <Lock className="size-3 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          <span className="truncate">{url}</span>
        </span>
        <span className="w-12" aria-hidden="true" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
