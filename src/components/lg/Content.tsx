import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight } from "./icons";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { CountUp } from "./CountUp";
import { SmartLink } from "./SmartLink";

/* --------------------------------------------------------------------------
   ArrowLink: the tertiary action: 40px circle + label (hover: circle fills, arrow nudges)
   -------------------------------------------------------------------------- */
interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  /** onMedia: white text, translucent circle: for links on photos / dark media */
  tone?: "default" | "onMedia";
  className?: string;
}

export function ArrowLink({ href, children, tone = "default", className }: ArrowLinkProps) {
  return (
    <SmartLink
      href={href}
      className={cn(
        "lg-arrow-link inline-flex w-fit items-center gap-3 rounded-pill text-body font-medium",
        tone === "onMedia" ? "text-white" : "text-ink",
        className,
      )}
    >
      <span
        className={cn(
          "lg-arrow-link__circle grid size-10 shrink-0 place-items-center rounded-pill",
          tone === "onMedia" ? "bg-white/15 text-white" : "bg-ink/[0.06] text-ink",
        )}
      >
        <ArrowRight className="size-4"  aria-hidden="true" />
      </span>
      {children}
    </SmartLink>
  );
}

/* --------------------------------------------------------------------------
   Stat: light-weight numeral + label, hairline on top
   -------------------------------------------------------------------------- */
interface StatProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  locale?: string;
  className?: string;
}

export function Stat({ value, label, prefix, suffix, locale, className }: StatProps) {
  return (
    <div className={cn("flex flex-col gap-3 border-t border-hairline pt-5", className)}>
      <CountUp value={value} prefix={prefix} suffix={suffix} locale={locale} className="text-stat text-ink" />
      <span className="text-small text-ink-2">{label}</span>
    </div>
  );
}

/* --------------------------------------------------------------------------
   InlineSignup: email field with the primary button inside the pill
   -------------------------------------------------------------------------- */
interface InlineSignupProps {
  placeholder?: string;
  buttonLabel: string;
  /** called with the email; navigate to signup with it prefilled */
  onSubmit?: (email: string) => void;
  className?: string;
}

export function InlineSignup({ placeholder = "Work email", buttonLabel, onSubmit, className }: InlineSignupProps) {
  const [email, setEmail] = useState("");
  const handle = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.(email);
  };
  return (
    <form
      onSubmit={handle}
      className={cn(
        "lg-inline-form flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:items-center sm:gap-0",
        className,
      )}
    >
      <label htmlFor="lg-inline-signup" className="sr-only">
        {placeholder}
      </label>
      <input
        id="lg-inline-signup"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="lg-inline-form__input h-12 min-w-0 shrink-0 rounded-pill sm:flex-1 sm:shrink px-5 text-body text-ink outline-none placeholder:text-ink-3"
 />
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        {buttonLabel}
      </Button>
    </form>
  );
}

/* --------------------------------------------------------------------------
   TrustItem: icon disc + title + one-line proof (footer, security strips)
   -------------------------------------------------------------------------- */
export function TrustItem({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-pill bg-ink text-canvas [&_svg]:size-5">{icon}</span>
      <span className="flex flex-col">
        <span className="text-small font-medium text-ink">{title}</span>
        <span className="text-small text-ink-2">{detail}</span>
      </span>
    </div>
  );
}

/* --------------------------------------------------------------------------
   FeatureItem: icon + title + text with a hairline on top (dense feature lists)
   -------------------------------------------------------------------------- */
export function FeatureItem({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t border-hairline pt-6">
      <span className="text-ink [&_svg]:size-6" aria-hidden="true">
        {icon}
      </span>
      <h3 className="text-h4 text-ink">{title}</h3>
      <p className="text-body text-ink-2">{children}</p>
    </div>
  );
}
