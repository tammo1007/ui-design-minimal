// lg-audit-ignore-file: illustrations of the system's own UI, drawn at a fixed 296 px design width
import { Badge, Button, Icons, Sparkline } from "@/components/lg";
import { Scene } from "../shared/Scene";

const frame = "w-[296px] rounded-[18px] bg-surface p-4 shadow-elev-2 ring-1 ring-hairline";

export function ButtonsVisual() {
  return (
    <div className={`${frame} grid gap-2.5`}>
      <div className="flex gap-2">
        <Button size="ui" variant="secondary">Cancel</Button>
        <Button size="ui" variant="accent">Save changes</Button>
      </div>
      <div className="flex gap-2">
        <Button size="ui">Continue</Button>
        <Button size="ui" variant="ghost">Skip</Button>
      </div>
      <p className="text-ui-caption text-ink-3">One prominent action per view, trailing side.</p>
    </div>
  );
}

export function SegmentVisual() {
  return (
    <div className="relative w-[296px] overflow-hidden rounded-[22px]">
      <Scene variant="ocean" className="h-[190px]" />
      <div className="absolute inset-x-0 top-5 flex justify-center">
        <div className="lg-glass flex gap-0.5 rounded-pill p-1">
          {["Day", "Week", "Month"].map((l, i) => (
            <span key={l} className={`rounded-pill px-4 py-1.5 text-[13px] font-medium ${i === 1 ? "bg-white text-black shadow-elev-1" : "text-ink"}`}>
              {l}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
        <span className="lg-glass lg-glass--clear lg-glass--dim grid size-11 place-items-center rounded-pill text-white">
          <Icons.Share size={18} />
        </span>
        <span className="lg-glass lg-glass--clear lg-glass--dim grid h-11 place-items-center rounded-pill px-5 text-[14px] font-medium text-white">Open</span>
      </div>
    </div>
  );
}

export function ControlsVisual() {
  return (
    <div className={`${frame} grid gap-3`}>
      {[
        ["Notifications", true],
        ["Weekly digest", false],
        ["Share with team", true],
      ].map(([l, on]) => (
        <div key={l as string} className="flex items-center justify-between">
          <span className="text-ui-body">{l}</span>
          <span className="lg-switch" aria-checked={on as boolean}>
            <span className="lg-switch__knob" />
          </span>
        </div>
      ))}
    </div>
  );
}

export function StatusVisual() {
  return (
    <div className={`${frame} grid gap-2.5`}>
      <div className="flex flex-wrap gap-1.5">
        <Badge tone="success">Paid</Badge>
        <Badge tone="warning">Pending</Badge>
        <Badge tone="danger">Failed</Badge>
        <Badge tone="info">Trial</Badge>
        <Badge>Draft</Badge>
      </div>
      <div className="lg-ui-well flex items-center gap-2 p-2.5">
        <Icons.Success size={18} className="text-success-text" />
        <span className="text-ui-callout">Status is never color alone.</span>
      </div>
    </div>
  );
}

export function ChartVisual() {
  return (
    <div className={frame}>
      <p className="text-ui-callout text-ink-2">Revenue</p>
      <div className="flex items-baseline gap-2">
        <p className="text-ui-metric tabular-nums">$48.2k</p>
        <Badge tone="success" dot={false}>+12.4%</Badge>
      </div>
      <Sparkline data={[12, 14, 13, 17, 16, 19, 22, 21, 25, 24, 28, 31]} className="mt-3 h-14" height={56} />
    </div>
  );
}

export function TableVisual() {
  const rows = [
    ["Northwind", "Paid", "$2,400"],
    ["Acme Labs", "Pending", "$980"],
    ["Globex", "Paid", "$1,250"],
  ];
  return (
    <div className="w-[296px] overflow-hidden rounded-[18px] bg-surface shadow-elev-2 ring-1 ring-hairline">
      <table className="lg-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Status</th>
            <th data-align="end">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([c, s, a]) => (
            <tr key={c}>
              <td>{c}</td>
              <td>
                <Badge tone={s === "Paid" ? "success" : "warning"}>{s}</Badge>
              </td>
              <td data-align="end">{a}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TypeVisual() {
  return (
    <div className={`${frame} grid gap-1`}>
      <p className="text-[26px] font-semibold leading-8 tracking-[-0.022em]">Large Title</p>
      <p className="text-[17px] font-semibold leading-6 tracking-[-0.015em]">Title 2 · 17 / 600</p>
      <p className="text-[14px] leading-5">Body 14 / 20 for dashboards</p>
      <p className="text-[12px] font-medium text-ink-2">Subhead 12 / 500</p>
      <p className="text-[11px] font-medium text-ink-3">Caption 11, the minimum</p>
    </div>
  );
}

export function SidebarVisual() {
  return (
    <div className="relative w-[296px] overflow-hidden rounded-[22px] bg-canvas-subtle p-2 ring-1 ring-hairline">
      <div className="lg-glass lg-glass--thick w-[176px] rounded-[18px] p-2">
        {[
          [Icons.Home, "Overview", true],
          [Icons.Chart, "Reports", false],
          [Icons.Users, "Customers", false],
          [Icons.Inbox, "Inbox", false],
        ].map(([I, l, on]) => {
          const Icon = I as typeof Icons.Home;
          return (
            <div key={l as string} className={`flex h-9 items-center gap-2.5 rounded-[10px] px-2.5 text-[14px] font-medium ${on ? "bg-ink/[0.08]" : ""}`}>
              <Icon size={20} className={on ? "text-accent-strong" : "text-ink-2"} />
              {l as string}
            </div>
          );
        })}
      </div>
      <div className="absolute right-3 top-3 grid gap-2">
        <div className="h-14 w-[92px] rounded-[12px] bg-surface ring-1 ring-hairline" />
        <div className="h-20 w-[92px] rounded-[12px] bg-surface ring-1 ring-hairline" />
      </div>
    </div>
  );
}

/** Mini app screen for the hero phone (HTML, not a screenshot). */
export function PhoneApp() {
  return (
    <div className="flex h-full flex-col bg-canvas-subtle px-3.5 pt-12 text-ink" data-density="product">
      <p className="text-[11px] font-medium text-ink-2">Wednesday</p>
      <p className="text-[26px] font-semibold leading-8 tracking-[-0.022em]">Today</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          ["Revenue", "$4,820", "+8%"],
          ["Visitors", "12.4k", "+3%"],
        ].map(([l, v, d]) => (
          <div key={l} className="rounded-[14px] bg-surface p-2.5 ring-1 ring-hairline">
            <p className="text-[11px] text-ink-2">{l}</p>
            <p className="text-[18px] font-medium tabular-nums tracking-[-0.02em]">{v}</p>
            <p className="text-[10px] font-medium text-success-text">{d}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-[14px] bg-surface p-2.5 ring-1 ring-hairline">
        <p className="text-[11px] text-ink-2">This week</p>
        <Sparkline data={[8, 9, 7, 11, 13, 12, 16]} className="mt-1 h-12" height={48} />
      </div>
      <div className="mt-2 grid gap-1.5 rounded-[14px] bg-surface p-2.5 ring-1 ring-hairline">
        {["Northwind paid", "New signup", "Report ready"].map((t, i) => (
          <div key={t} className="flex items-center justify-between text-[12px]">
            <span>{t}</span>
            <span className="text-[10px] text-ink-3">{i + 2}m</span>
          </div>
        ))}
      </div>
      <div className="mt-auto mb-3 flex justify-center">
        <div className="lg-glass flex gap-1 rounded-pill p-1">
          {[Icons.Home, Icons.Chart, Icons.Users, Icons.Search].map((I, i) => (
            <span key={i} className={`grid h-9 w-11 place-items-center rounded-pill ${i === 0 ? "bg-ink/[0.08] text-accent-strong" : "text-ink"}`}>
              <I size={20} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
