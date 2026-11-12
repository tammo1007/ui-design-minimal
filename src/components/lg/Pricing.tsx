import { Fragment, useState, type ReactNode } from "react";
import { Check, Minus } from "./icons";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { SmartLink } from "./SmartLink";
import { SegmentedControl } from "./SegmentedControl";

/* --------------------------------------------------------------------------
   PricingTier: one plan card. Outline by default; `featured` = the dark card
   (one per row). Same markup on the landing page and on /pricing.
   -------------------------------------------------------------------------- */
interface PricingTierProps {
  name: string;
  /** one line under the name, e.g. "Up to 250 attendees" */
  caption: string;
  /** "€89", "Free", "Custom" */
  price: string;
  /** small text after the price, e.g. "per month" */
  priceNote?: string;
  cta: { label: string; href: string };
  features: ReactNode[];
  featured?: boolean;
  className?: string;
}

export function PricingTier({ name, caption, price, priceNote, cta, features, featured = false, className }: PricingTierProps) {
  return (
    <div data-theme={featured ? "dark" : undefined} className={cn("lg-card gap-8", featured ? "bg-canvas" : "lg-card--outline", className)}>
      <div className="flex flex-col gap-1">
        <h3 className="text-h4 text-ink">{name}</h3>
        <p className="text-small text-ink-2">{caption}</p>
      </div>
      <p className="flex items-baseline gap-2">
        <span className="text-h1 tabular-nums text-ink">{price}</span>
        {priceNote ? <span className="text-small text-ink-2">{priceNote}</span> : null}
      </p>
      <Button asChild variant={featured ? "primary" : "secondary"} className="w-full">
        <SmartLink href={cta.href}>{cta.label}</SmartLink>
      </Button>
      <ul className="flex flex-col gap-3 border-t border-hairline pt-6 text-small text-ink-2">
        {features.map((f, i) => (
          <li key={i} className="flex gap-3">
            <Check className="mt-0.5 size-4 shrink-0 text-ink" strokeWidth={1.75} aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --------------------------------------------------------------------------
   PlanBanner: a full-width outline row for a plan that sits apart from the
   grid (e.g. a free plan): name + caption left, price + CTA right.
   -------------------------------------------------------------------------- */
interface PlanBannerProps {
  name: string;
  caption: string;
  price: string;
  priceNote?: string;
  cta: { label: string; href: string };
  className?: string;
}

export function PlanBanner({ name, caption, price, priceNote, cta, className }: PlanBannerProps) {
  return (
    <div className={cn("lg-card lg-card--outline gap-6 md:flex-row md:items-center md:justify-between", className)}>
      <div className="flex flex-col gap-1">
        <h3 className="text-h4 text-ink">{name}</h3>
        <p className="text-small text-ink-2">{caption}</p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <p className="flex items-baseline gap-2">
          <span className="text-h2 tabular-nums text-ink">{price}</span>
          {priceNote ? <span className="text-small text-ink-2">{priceNote}</span> : null}
        </p>
        <Button asChild variant="secondary">
          <SmartLink href={cta.href}>{cta.label}</SmartLink>
        </Button>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   ComparisonTable: plans × capabilities. ≥ md: a table (sticky first column
   header row, hairline rows). Phones: a segmented control picks one plan and
   the rows become a two-column list: no horizontal scrolling.
   -------------------------------------------------------------------------- */
export type ComparisonValue = boolean | string;

export interface ComparisonRow {
  label: string;
  /** one value per column: true = included, false = not included, string = text */
  values: ComparisonValue[];
}

export interface ComparisonGroup {
  title?: string;
  rows: ComparisonRow[];
}

interface ComparisonTableProps {
  columns: { label: string; note?: string }[];
  groups: ComparisonGroup[];
  /** accessible caption, e.g. "Features included in each plan" */
  caption: string;
  className?: string;
}

function Cell({ value }: { value: ComparisonValue }) {
  if (value === true)
    return (
      <>
        <Check className="mx-auto size-5 text-ink" strokeWidth={1.75} aria-hidden="true" />
        <span className="sr-only">Included</span>
      </>
    );
  if (value === false)
    return (
      <>
        <Minus className="mx-auto size-5 text-ink-3"  aria-hidden="true" />
        <span className="sr-only">Not included</span>
      </>
    );
  return <span className="text-small text-ink">{value}</span>;
}

export function ComparisonTable({ columns, groups, caption, className }: ComparisonTableProps) {
  const [active, setActive] = useState(String(Math.min(1, columns.length - 1)));
  const col = Number(active);

  return (
    <div className={className}>
      {/* phones & small tablets */}
      <div className="md:hidden">
        <SegmentedControl
          block
          aria-label="Choose a plan"
          value={active}
          onChange={(v) => setActive(v)}
          options={columns.map((c, i) => ({ value: String(i), label: c.label }))}
 />
        {columns[col]?.note ? <p className="mt-4 text-small text-ink-2">{columns[col].note}</p> : null}
        <div className="mt-6 flex flex-col">
          {groups.map((g, gi) => (
            <Fragment key={gi}>
              {g.title ? <p className="border-b border-hairline pb-3 pt-6 text-label text-ink-2">{g.title}</p> : null}
              <dl className="flex flex-col">
                {g.rows.map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-6 border-b border-hairline py-4">
                    <dt className="text-body text-ink">{r.label}</dt>
                    <dd className="shrink-0 text-right">
                      <Cell value={r.values[col]} />
                    </dd>
                  </div>
                ))}
              </dl>
            </Fragment>
          ))}
        </div>
      </div>

      {/* tablets & desktop */}
      <table className="hidden w-full table-fixed border-collapse md:table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-ink">
            <th scope="col" className="w-[34%] pb-5 text-left align-bottom text-label font-medium text-ink-2">
              <span className="sr-only">Feature</span>
            </th>
            {columns.map((c) => (
              <th key={c.label} scope="col" className="px-3 pb-5 text-center align-bottom">
                <span className="block text-h4 font-medium text-ink">{c.label}</span>
                {c.note ? <span className="mt-1 block text-small font-normal text-ink-2">{c.note}</span> : null}
              </th>
            ))}
          </tr>
        </thead>
        {groups.map((g, gi) => (
          <tbody key={gi}>
            {g.title ? (
              <tr>
                <th scope="colgroup" colSpan={columns.length + 1} className="pb-3 pt-10 text-left text-label font-medium text-ink-2">
                  {g.title}
                </th>
              </tr>
            ) : null}
            {g.rows.map((r) => (
              <tr key={r.label} className="border-b border-hairline">
                <th scope="row" className="py-4 pr-6 text-left text-body font-normal text-ink">
                  {r.label}
                </th>
                {r.values.map((v, i) => (
                  <td key={i} className="px-3 py-4 text-center">
                    <Cell value={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
