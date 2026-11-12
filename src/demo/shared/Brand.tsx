// lg-audit-ignore-file: brand asset (logo wordmark) with its own fixed type
import { useEffect, useState } from "react";
import { Icons } from "@/components/lg";
import { site } from "./site";

/** Logo: glass orb mark + wordmark, currentColor. */
export function LogoMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="lg-orb" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="currentColor" stopOpacity=".15" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".9" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="url(#lg-orb)" />
      <path d="M9.5 13.5a7.5 7.5 0 0 1 7-5.5" stroke="rgb(var(--lg-canvas))" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".85" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark />
      <span className="text-[1.0625rem] font-semibold tracking-[-0.02em]">{site.name}</span>
    </span>
  );
}

/** Light / dark toggle. Saves the choice; first visit follows the OS. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => setTheme((document.documentElement.getAttribute("data-theme") as "light" | "dark") ?? "light"), []);
  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("lg-theme", next);
    } catch {
      /* private mode */
    }
    setTheme(next);
  };
  return (
    <button type="button" onClick={flip} className={`lg-toolbar__btn lg-hit lg-press ${className}`} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
      {theme === "dark" ? <Icons.Sun size={18} /> : <Icons.Moon size={18} />}
    </button>
  );
}
