import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowDown, ArrowUp, ChevronUpDown, ChevronLeft, ChevronRight } from "./icons";

/* ============================================================================
   DATA DISPLAY for product pages: Card, Metric, Badge, DataTable, charts,
   EmptyState, Skeleton, Meter, Avatar, Pagination. All on SOLID surfaces.
   ============================================================================ */

/** Product card: white on canvas-subtle, r 16, hairline. `padded` = 20 px (16 on phones). */
export function UICard({ children, className, padded = true, as: As = "section" }: { children: ReactNode; className?: string; padded?: boolean; as?: "section" | "div" | "article" }) {
  return <As className={cn("lg-ui-card", padded && "lg-ui-card--pad", className)}>{children}</As>;
}

/** Card header row: title-2 (17/600) + optional caption + trailing control. */
export function UICardHeader({ title, caption, action, className }: { title: ReactNode; caption?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <h3 className="text-ui-title-3">{title}</h3>
        {caption && <p className="mt-0.5 text-ui-callout text-ink-2">{caption}</p>}
      </div>
      {action}
    </div>
  );
}

export type Tone = "neutral" | "success" | "warning" | "danger" | "info";

/** Status badge. Always says the status in words (color is never the only signal). */
export function Badge({ tone = "neutral", dot = true, children, className }: { tone?: Tone; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span className={cn("lg-badge", className)} data-tone={tone === "neutral" ? undefined : tone} data-dot={dot ? undefined : "false"}>
      {children}
    </span>
  );
}

/** KPI tile: label (callout ink-2) · value (ui-metric, tabular) · delta badge · optional sparkline. */
export function Metric({
  label,
  value,
  delta,
  trend,
  hint,
  spark,
  size = "md",
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  /** e.g. "+12.4%" */
  delta?: string;
  /** direction of the delta AND whether it is good: up-good, down-good, up-bad, down-bad */
  trend?: "up-good" | "down-good" | "up-bad" | "down-bad" | "flat";
  hint?: ReactNode;
  spark?: number[];
  size?: "md" | "lg";
  className?: string;
}) {
  const good = trend === "up-good" || trend === "down-good";
  const bad = trend === "up-bad" || trend === "down-bad";
  const up = trend?.startsWith("up");
  return (
    <div className={cn("lg-ui-card lg-ui-card--pad flex flex-col gap-1", className)}>
      <p className="text-ui-callout text-ink-2">{label}</p>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <p className={cn("tabular-nums", size === "lg" ? "text-ui-metric-lg" : "text-ui-metric")}>{value}</p>
        {delta && (
          <Badge tone={good ? "success" : bad ? "danger" : "neutral"} dot={false}>
            {trend && trend !== "flat" && (up ? <ArrowUp size={12} strokeWidth={2} /> : <ArrowDown size={12} strokeWidth={2} />)}
            {delta}
          </Badge>
        )}
      </div>
      {hint && <p className="text-ui-subhead text-ink-3 max-sm:hidden">{hint}</p>}
      {spark && <Sparkline data={spark} className="mt-2 max-sm:hidden" />}
    </div>
  );
}

/* ---------------------------------- charts ---------------------------------- */

/** Sparkline: 1.5 px accent line + soft area, no axes. Decorative; the value sits next to it in text. */
export function Sparkline({ data, className, height = 36 }: { data: number[]; className?: string; height?: number }) {
  const w = 120;
  const { line, area } = useMemo(() => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const pts = data.map((v, i) => [(i / (data.length - 1)) * w, height - 2 - ((v - min) / (max - min || 1)) * (height - 4)]);
    const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("");
    return { line, area: `${line}L${w},${height}L0,${height}Z` };
  }, [data, height]);
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className={cn("block h-9 w-full overflow-visible", className)} aria-hidden="true">
      <path d={area} fill="rgb(var(--lg-chart-1) / 0.1)" />
      <path d={line} fill="none" stroke="rgb(var(--lg-chart-1))" strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export interface Series {
  name: string;
  data: number[];
}

/**
 * Line / area chart. Max 4 series; series 1 = accent. 3 to 5 horizontal grid lines with round tick values,
 * axis labels 11 px ink-3, y axis on the trailing side so the chart's leading edge aligns with the text above (HIG).
 * Pass `summary` (the main message in one sentence); it renders as the accessible description.
 */
export function LineChart({
  series,
  labels,
  height = 220,
  area = true,
  format = (v: number) => v.toLocaleString("en-US"),
  summary,
  className,
}: {
  series: Series[];
  labels: string[];
  height?: number;
  area?: boolean;
  format?: (v: number) => string;
  summary: string;
  className?: string;
}) {
  const W = 640;
  const padR = 44;
  const padB = 22;
  const max = niceMax(Math.max(...series.flatMap((s) => s.data)));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const x = (i: number) => (i / (labels.length - 1)) * (W - padR);
  const y = (v: number) => (height - padB) - (v / max) * (height - padB - 6);
  const colors = ["var(--lg-chart-1)", "var(--lg-chart-2)", "var(--lg-chart-3)", "var(--lg-chart-4)"];
  const step = Math.ceil(labels.length / 6);
  return (
    <figure className={cn("m-0", className)}>
      <svg viewBox={`0 0 ${W} ${height}`} className="lg-chart block h-auto w-full" role="img" aria-label={summary}>
        {ticks.map((t) => (
          <g key={t}>
            <line className="lg-chart__grid" x1={0} x2={W - padR} y1={y(t)} y2={y(t)} />
            <text x={W - padR + 8} y={y(t) + 4}>{format(t)}</text>
          </g>
        ))}
        {labels.map((l, i) =>
          i % step === 0 ? (
            <text key={l + i} x={x(i)} y={height - 4} textAnchor={i === 0 ? "start" : "middle"}>
              {l}
            </text>
          ) : null,
        )}
        {series.slice(0, 4).map((s, si) => {
          const d = s.data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
          return (
            <g key={s.name}>
              {area && si === 0 && <path d={`${d}L${x(s.data.length - 1)},${height - padB}L0,${height - padB}Z`} fill={`rgb(${colors[si]} / 0.1)`} />}
              <path d={d} fill="none" stroke={`rgb(${colors[si]})`} strokeWidth={si === 0 ? 2 : 1.5} strokeDasharray={si === 0 ? undefined : "4 3"} strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={x(s.data.length - 1)} cy={y(s.data[s.data.length - 1])} r={3.5} fill={`rgb(${colors[si]})`} stroke="rgb(var(--lg-surface))" strokeWidth={2} />
            </g>
          );
        })}
      </svg>
      {series.length > 1 && <Legend items={series.map((s, i) => ({ label: s.name, color: colors[i], dashed: i > 0 }))} className="mt-3" />}
    </figure>
  );
}

/** Bar chart: rounded-top bars (r 4), baseline at zero, one highlighted bar (accent) or all in chart-1. */
export function BarChart({
  data,
  labels,
  height = 200,
  highlight,
  format = (v: number) => v.toLocaleString("en-US"),
  summary,
  className,
}: {
  data: number[];
  labels: string[];
  height?: number;
  /** index of the bar to emphasise; others turn ink at 12 %. Omit = all accent. */
  highlight?: number;
  format?: (v: number) => string;
  summary: string;
  className?: string;
}) {
  const W = 640;
  const padR = 44;
  const padB = 22;
  const max = niceMax(Math.max(...data));
  const bw = (W - padR) / data.length;
  const y = (v: number) => (height - padB) - (v / max) * (height - padB - 6);
  return (
    <svg viewBox={`0 0 ${W} ${height}`} className={cn("lg-chart block h-auto w-full", className)} role="img" aria-label={summary}>
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line className="lg-chart__grid" x1={0} x2={W - padR} y1={y(f * max)} y2={y(f * max)} />
          <text x={W - padR + 8} y={y(f * max) + 4}>{format(f * max)}</text>
        </g>
      ))}
      {data.map((v, i) => {
        const h = Math.max(2, height - padB - y(v));
        const on = highlight == null || highlight === i;
        return (
          <g key={i}>
            <path
              d={roundedTop(i * bw + bw * 0.18, y(v), bw * 0.64, h, Math.min(4, bw * 0.2))}
              fill={on ? "rgb(var(--lg-chart-1))" : "rgb(var(--lg-ink) / 0.12)"}
            >
              <title>{`${labels[i]}: ${format(v)}`}</title>
            </path>
            <text x={i * bw + bw / 2} y={height - 4} textAnchor="middle">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

/** Horizontal share bars (top channels, plans …): label · bar · value. Readable without color. */
export function BarList({ items, format = (v: number) => v.toLocaleString("en-US"), className }: { items: { label: string; value: number }[]; format?: (v: number) => string; className?: string }) {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <ul className={cn("grid gap-2.5", className)}>
      {items.map((it) => (
        <li key={it.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1">
          <span className="truncate text-ui-callout">{it.label}</span>
          <span className="text-ui-callout tabular-nums text-ink-2">{format(it.value)}</span>
          <div className="lg-meter col-span-2">
            <span style={{ width: `${(it.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Legend({ items, className }: { items: { label: string; color: string; dashed?: boolean }[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-4 gap-y-1", className)}>
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5 text-ui-subhead text-ink-2">
          <svg width="16" height="6" aria-hidden="true">
            <line x1="1" x2="15" y1="3" y2="3" stroke={`rgb(${i.color})`} strokeWidth="2" strokeDasharray={i.dashed ? "4 3" : undefined} strokeLinecap="round" />
          </svg>
          {i.label}
        </li>
      ))}
    </ul>
  );
}

function niceMax(v: number) {
  const exp = Math.pow(10, Math.floor(Math.log10(v || 1)));
  const f = v / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * exp;
}
function roundedTop(x: number, y: number, w: number, h: number, r: number) {
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

/* --------------------------------- data table -------------------------------- */

export interface Column<T> {
  key: string;
  header: string;
  /** numbers, currency, dates: "end" (right-aligned, tabular) */
  align?: "start" | "end";
  sortable?: boolean;
  /** value used for sorting; defaults to row[key] */
  sortValue?: (row: T) => number | string;
  render?: (row: T) => ReactNode;
  /** hide below this breakpoint */
  hideBelow?: "sm" | "md" | "lg";
}

const hideClass = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell" } as const;

/**
 * DataTable: inside a UICard (padded={false}). Header 12/500 ink-2 in Title Case (never ALL CAPS),
 * rows 44 px (compact 36, comfy 52), hairline separators, numbers right-aligned and tabular.
 * Click a sortable header to sort; click again to reverse (HIG, macOS tables).
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  density = "regular",
  caption,
  initialSort,
  pageSize,
  className,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  density?: "compact" | "regular" | "comfy";
  /** accessible caption (visually hidden) */
  caption: string;
  initialSort?: { key: string; dir: "asc" | "desc" };
  pageSize?: number;
  className?: string;
}) {
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(0);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    const val = (r: T) => (col?.sortValue ? col.sortValue(r) : (r[sort.key] as number | string));
    return [...rows].sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      const r = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sort.dir === "asc" ? r : -r;
    });
  }, [rows, sort, columns]);
  const pages = pageSize ? Math.ceil(sorted.length / pageSize) : 1;
  const visible = pageSize ? sorted.slice(page * pageSize, page * pageSize + pageSize) : sorted;

  return (
    <div className={className}>
      <div className="lg-table__scroll">
        <table className="lg-table" data-density={density === "regular" ? undefined : density}>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {columns.map((c) => {
                const active = sort?.key === c.key;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    data-align={c.align}
                    className={c.hideBelow && hideClass[c.hideBelow]}
                    aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined}
                  >
                    {c.sortable ? (
                      <button
                        type="button"
                        className="lg-table__sort"
                        onClick={() => setSort(active ? { key: c.key, dir: sort!.dir === "asc" ? "desc" : "asc" } : { key: c.key, dir: c.align === "end" ? "desc" : "asc" })}
                      >
                        {c.header}
                        {active ? sort!.dir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} /> : <ChevronUpDown size={12} className="opacity-50" />}
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={rowKey(r)}>
                {columns.map((c) => (
                  <td key={c.key} data-align={c.align} className={c.hideBelow && hideClass[c.hideBelow]}>
                    {c.render ? c.render(r) : String(r[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageSize && pages > 1 && (
        <Pagination page={page} pages={pages} onChange={setPage} total={rows.length} pageSize={pageSize} className="border-t border-hairline px-card-ui py-2.5" />
      )}
    </div>
  );
}

export function Pagination({ page, pages, onChange, total, pageSize, className }: { page: number; pages: number; onChange: (p: number) => void; total: number; pageSize: number; className?: string }) {
  const from = page * pageSize + 1;
  const to = Math.min(total, from + pageSize - 1);
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <p className="text-ui-callout tabular-nums text-ink-2">
        {from}–{to} of {total}
      </p>
      <div className="flex gap-1">
        <button type="button" className="lg-toolbar__btn lg-hit lg-press disabled:opacity-30" disabled={page === 0} onClick={() => onChange(page - 1)} aria-label="Previous page">
          <ChevronLeft size={16} />
        </button>
        <button type="button" className="lg-toolbar__btn lg-hit lg-press disabled:opacity-30" disabled={page >= pages - 1} onClick={() => onChange(page + 1)} aria-label="Next page">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- small pieces ------------------------------- */

/** Avatar: initials on a neutral fill (never invented photos for real, named people). Sizes 24 · 32 · 40. */
export function Avatar({ name, src, size = 32, className }: { name: string; src?: string; size?: 24 | 32 | 40; className?: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const s = { 24: "size-6 text-[0.625rem]", 32: "size-8 text-ui-caption", 40: "size-10 text-ui-subhead" }[size];
  return src ? (
    <img src={src} alt={name} className={cn("shrink-0 rounded-pill object-cover", s, className)} />
  ) : (
    <span className={cn("grid shrink-0 place-items-center rounded-pill bg-surface-3 font-medium text-ink-2", s, className)} aria-label={name} role="img">
      {initials}
    </span>
  );
}

export function Meter({ value, label, className }: { value: number; label: string; className?: string }) {
  return (
    <div className={cn("lg-meter", className)} role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("lg-skeleton h-4", className)} aria-hidden="true" />;
}

/** Empty state: icon (24, ink-3) · title-3 · one sentence · one action. Centered inside its card. */
export function EmptyState({ icon, title, body, action, className }: { icon?: ReactNode; title: ReactNode; body?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("grid justify-items-center gap-2 px-6 py-12 text-center", className)}>
      {icon && <div className="mb-1 grid size-11 place-items-center rounded-pill bg-ink/[0.05] text-ink-2">{icon}</div>}
      <p className="text-ui-title-3">{title}</p>
      {body && <p className="max-w-[36ch] text-ui-callout text-ink-2">{body}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/** Label/value list for detail panels and inspectors. */
export function DescriptionList({ items, className }: { items: { label: string; value: ReactNode }[]; className?: string }) {
  return (
    <dl className={cn("divide-y divide-hairline", className)}>
      {items.map((i) => (
        <div key={i.label} className="flex items-center justify-between gap-4 py-2.5">
          <dt className="text-ui-callout text-ink-2">{i.label}</dt>
          <dd className="text-right text-ui-body tabular-nums">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
