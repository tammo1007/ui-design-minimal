import { useState } from "react";
import {
  AppContent,
  AppShell,
  Avatar,
  Badge,
  BarChart,
  BarList,
  Button,
  Checkbox,
  DataTable,
  DescriptionList,
  Dialog,
  EmptyState,
  Icons,
  LineChart,
  Menu,
  Metric,
  SearchField,
  SmartLink,
  Select,
  Sheet,
  Switch,
  Tabs,
  ToastProvider,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  Tooltip,
  UICard,
  UICardHeader,
  UISectionHeader,
  useToast,
  type Column,
} from "@/components/lg";
import { Logo, ThemeToggle } from "../shared/Brand";
import { site } from "../shared/site";

/* Demo data only. A fictional analytics product called "Orbit". */
type Customer = { id: string; name: string; plan: string; status: "Active" | "Trial" | "Past due" | "Churned"; mrr: number; seats: number; since: string };
const customers: Customer[] = [
  { id: "c1", name: "Northwind Studio", plan: "Scale", status: "Active", mrr: 2400, seats: 48, since: "Mar 2025" },
  { id: "c2", name: "Acme Labs", plan: "Growth", status: "Trial", mrr: 0, seats: 12, since: "Oct 2026" },
  { id: "c3", name: "Globex Retail", plan: "Scale", status: "Active", mrr: 1850, seats: 31, since: "Jan 2026" },
  { id: "c4", name: "Initech", plan: "Starter", status: "Past due", mrr: 290, seats: 6, since: "Jun 2025" },
  { id: "c5", name: "Umbrella Health", plan: "Enterprise", status: "Active", mrr: 6200, seats: 140, since: "Aug 2024" },
  { id: "c6", name: "Stark Mobility", plan: "Growth", status: "Active", mrr: 980, seats: 18, since: "Feb 2026" },
  { id: "c7", name: "Wayne Logistics", plan: "Starter", status: "Churned", mrr: 0, seats: 4, since: "Nov 2024" },
  { id: "c8", name: "Hooli Cloud", plan: "Scale", status: "Active", mrr: 2100, seats: 42, since: "May 2026" },
  { id: "c9", name: "Soylent Foods", plan: "Growth", status: "Trial", mrr: 0, seats: 9, since: "Nov 2026" },
];
const tone = { Active: "success", Trial: "info", "Past due": "warning", Churned: "neutral" } as const;
const usd = (v: number) => `$${v.toLocaleString("en-US")}`;

const nav = [
  {
    items: [
      { label: "Overview", href: "#overview", icon: Icons.Home, tab: true },
      { label: "Reports", href: "#reports", icon: Icons.Chart, tab: true },
      { label: "Customers", href: "#customers", icon: Icons.Users, badge: 9, tab: true },
      { label: "Inbox", href: "#inbox", icon: Icons.Inbox, badge: 3, tab: true },
    ],
  },
  {
    title: "Workspace",
    items: [
      { label: "Calendar", href: "#calendar", icon: Icons.Calendar },
      { label: "Documents", href: "#documents", icon: Icons.Document },
      { label: "Settings", href: "#settings", icon: Icons.Settings, tab: true },
    ],
  },
];

const days = Array.from({ length: 30 }, (_, i) => `Nov ${i + 1}`);
const revenue = [31, 33, 32, 35, 34, 37, 36, 39, 41, 40, 42, 44, 43, 46, 45, 48, 47, 50, 52, 51, 54, 53, 56, 58, 57, 60, 59, 62, 64, 66].map((v) => v * 100);
const lastPeriod = revenue.map((v, i) => Math.round(v * 0.86 + Math.sin(i / 3) * 120));

function DashboardPage() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState(false);
  const [sheet, setSheet] = useState<Customer | null>(null);
  const [settings, setSettings] = useState({ digest: true, alerts: true, beta: false });
  const [statuses, setStatuses] = useState({ Active: true, Trial: true, "Past due": true, Churned: false });
  const toast = useToast();

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "Customer",
      sortable: true,
      render: (r) => (
        <button type="button" className="flex items-center gap-2.5 text-left hover:text-accent-strong" onClick={() => setSheet(r)}>
          <Avatar name={r.name} size={24} />
          <span className="font-medium">{r.name}</span>
        </button>
      ),
    },
    { key: "plan", header: "Plan", sortable: true, hideBelow: "md" },
    { key: "status", header: "Status", sortable: true, render: (r) => <Badge tone={tone[r.status]}>{r.status}</Badge> },
    { key: "seats", header: "Seats", align: "end", sortable: true, hideBelow: "lg" },
    { key: "mrr", header: "MRR", align: "end", sortable: true, render: (r) => usd(r.mrr) },
    { key: "since", header: "Customer Since", hideBelow: "lg", sortValue: (r) => Date.parse(`1 ${r.since}`) },
  ];
  const rows = customers.filter((c) => statuses[c.status] && c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <AppShell
      brand={<Logo />}
      nav={nav}
      currentHref="#overview"
      footer={
        <div className="flex items-center gap-2.5 px-1.5 py-1">
          <Avatar name="Alex Morgan" size={32} />
          <div className="lg-sidebar__label min-w-0 flex-1">
            <p className="truncate text-ui-headline">Alex Morgan</p>
            <p className="truncate text-ui-subhead text-ink-2">Orbit · Admin</p>
          </div>
          <ThemeToggle className="lg-sidebar__label" />
        </div>
      }
    >
      <Toolbar
        title="Overview"
        subtitle="Orbit analytics · demo data"
        center={<Tabs aria-label="Date range" size="sm" value={range} onChange={setRange} options={[{ value: "7d", label: "7 days" }, { value: "30d", label: "30 days" }, { value: "90d", label: "90 days" }]} />}
        actions={
          <>
            <ToolbarGroup label="View actions" className="hidden sm:inline-flex">
              <Tooltip content="Filter">
                <ToolbarButton aria-label="Filter">
                  <Icons.Filter />
                </ToolbarButton>
              </Tooltip>
              <Tooltip content="Share">
                <ToolbarButton aria-label="Share" onClick={() => toast({ title: "Link copied", body: "Anyone in Orbit can open it.", tone: "success" })}>
                  <Icons.Share />
                </ToolbarButton>
              </Tooltip>
              <Menu
                label="More actions"
                trigger={(p) => (
                  <ToolbarButton aria-label="More actions" {...p}>
                    <Icons.More />
                  </ToolbarButton>
                )}
                items={[
                  { label: "Download CSV", icon: <Icons.Download />, onSelect: () => toast({ title: "Export started", tone: "info" }) },
                  { label: "Duplicate view", icon: <Icons.Stack /> },
                  { label: "Reset layout", icon: <Icons.Grid /> },
                  { label: "Delete view", icon: <Icons.Error />, destructive: true, separatorBefore: true, onSelect: () => setDialog(true) },
                ]}
              />
            </ToolbarGroup>
            <Button size="ui" variant="accent" onClick={() => toast({ title: "Report created", body: "Weekly revenue, every Monday.", tone: "success" })}>
              <Icons.Plus />
              <span className="hidden sm:inline">New report</span>
            </Button>
          </>
        }
      />

      <AppContent className="grid grid-cols-1 gap-app-gap">
        {/* KPIs */}
        <section aria-label="Key metrics" className="grid grid-cols-2 gap-app-gap xl:grid-cols-4">
          <Metric label="Monthly recurring revenue" value="$66,140" delta="+12.4%" trend="up-good" hint="vs. previous 30 days" spark={revenue.slice(-12)} />
          <Metric label="Active customers" value="1,284" delta="+3.1%" trend="up-good" hint="42 new this month" spark={[20, 22, 21, 24, 25, 24, 27, 28, 27, 30, 31, 33]} />
          <Metric label="Churn rate" value="1.8%" delta="-0.4 pt" trend="down-good" hint="Target below 2%" spark={[24, 23, 25, 22, 21, 22, 20, 19, 20, 18, 18, 17]} />
          <Metric label="Open invoices" value="$4,210" delta="+$900" trend="up-bad" hint="3 past due" spark={[8, 9, 8, 10, 9, 11, 10, 12, 11, 13, 12, 14]} />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 gap-app-gap xl:grid-cols-3" aria-label="Revenue">
          <UICard className="xl:col-span-2">
            <UICardHeader title="Revenue" caption="Daily, in US dollars" action={<Select aria-label="Compare" defaultValue="prev" className="w-40"><option value="prev">vs. last period</option><option value="year">vs. last year</option></Select>} />
            <LineChart
              series={[{ name: "This period", data: revenue }, { name: "Last period", data: lastPeriod }]}
              labels={days}
              format={(v) => `$${(v / 1000).toFixed(1)}k`}
              summary="Revenue grew from $3,100 to $6,600 a day over November, about 15 percent above the previous period."
            />
          </UICard>
          <UICard>
            <UICardHeader title="Top channels" caption="Share of new revenue" />
            <BarList
              items={[
                { label: "Organic search", value: 18420 },
                { label: "Direct", value: 12880 },
                { label: "Partners", value: 9310 },
                { label: "Paid social", value: 5120 },
                { label: "Newsletter", value: 3400 },
              ]}
              format={(v) => `$${(v / 1000).toFixed(1)}k`}
            />
          </UICard>
        </section>

        {/* Table */}
        <section aria-labelledby="customers-h">
          <UISectionHeader
            title={<span id="customers-h">Customers</span>}
            description={`${rows.length} of ${customers.length} shown`}
            action={<SearchField value={query} onChange={setQuery} placeholder="Search customers" shortcut="⌘K" className="w-56 max-sm:w-40" />}
          />
          <UICard padded={false}>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-hairline px-card-ui py-3">
              {(Object.keys(statuses) as (keyof typeof statuses)[]).map((s) => (
                <Checkbox key={s} label={s} checked={statuses[s]} onChange={(v) => setStatuses({ ...statuses, [s]: v })} />
              ))}
            </div>
            {rows.length ? (
              <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} caption="Customers" initialSort={{ key: "mrr", dir: "desc" }} pageSize={6} />
            ) : (
              <EmptyState icon={<Icons.Search />} title="No customers found" body="Try a different name or turn more statuses on." action={<Button size="ui" variant="secondary" onClick={() => setQuery("")}>Clear search</Button>} />
            )}
          </UICard>
        </section>

        <section className="grid grid-cols-1 gap-app-gap lg:grid-cols-3" aria-label="More">
          <UICard>
            <UICardHeader title="Signups" caption="Per weekday, this month" />
            <BarChart data={[42, 58, 61, 55, 64, 31, 24]} labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} highlight={4} summary="Friday had the most signups this month with 64; weekends are lowest." />
          </UICard>
          <UICard>
            <UICardHeader title="Activity" />
            <ul className="grid grid-cols-1 gap-3.5">
              {[
                ["Northwind Studio", "upgraded to Scale", "2m"],
                ["Initech", "invoice is 7 days past due", "1h"],
                ["Soylent Foods", "started a trial", "3h"],
                ["Hooli Cloud", "added 6 seats", "Yesterday"],
              ].map(([n, t, w]) => (
                <li key={n} className="flex items-start gap-3">
                  <Avatar name={n} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="text-ui-body">
                      <span className="font-semibold">{n}</span> {t}
                    </p>
                    <p className="text-ui-subhead text-ink-3">{w}</p>
                  </div>
                </li>
              ))}
            </ul>
          </UICard>
          <UICard>
            <UICardHeader title="Notifications" caption="Applies immediately" />
            <div className="grid grid-cols-1 gap-4">
              <Switch label="Weekly digest" description="Every Monday at 8:00" checked={settings.digest} onChange={(v) => setSettings({ ...settings, digest: v })} />
              <Switch label="Payment alerts" checked={settings.alerts} onChange={(v) => setSettings({ ...settings, alerts: v })} />
              <Switch label="Beta features" checked={settings.beta} onChange={(v) => setSettings({ ...settings, beta: v })} />
            </div>
          </UICard>
        </section>

        <p className="pt-2 text-center text-ui-subhead text-ink-3">
          Liquid Glass Design System by{" "}
          <SmartLink href={site.author.linkedin} target="_blank" className="text-ink-2 underline decoration-hairline-strong underline-offset-2">
            {site.author.name}
          </SmartLink>{" "}
          · <SmartLink href={site.links.home} className="text-ink-2 underline decoration-hairline-strong underline-offset-2">Landing demo</SmartLink>
        </p>
      </AppContent>

      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        title="Delete this view?"
        description="The view and its saved filters are removed for everyone in the workspace. Reports built on it keep working."
        actions={
          <>
            <Button size="ui" variant="secondary" onClick={() => setDialog(false)}>
              Cancel
            </Button>
            <Button
              size="ui"
              variant="destructive"
              onClick={() => {
                setDialog(false);
                toast({ title: "View deleted", tone: "danger" });
              }}
            >
              Delete view
            </Button>
          </>
        }
      />
      <Sheet
        open={!!sheet}
        onClose={() => setSheet(null)}
        title={sheet?.name ?? ""}
        footer={
          <div className="flex justify-end gap-2">
            <Button size="ui" variant="secondary" onClick={() => setSheet(null)}>
              Close
            </Button>
            <Button size="ui" variant="accent" onClick={() => setSheet(null)}>
              Open account
            </Button>
          </div>
        }
      >
        {sheet && (
          <div className="grid grid-cols-1 gap-5">
            <div className="flex items-center gap-3">
              <Avatar name={sheet.name} size={40} />
              <div>
                <p className="text-ui-title-3">{sheet.name}</p>
                <Badge tone={tone[sheet.status]}>{sheet.status}</Badge>
              </div>
            </div>
            <DescriptionList
              items={[
                { label: "Plan", value: sheet.plan },
                { label: "MRR", value: usd(sheet.mrr) },
                { label: "Seats", value: sheet.seats },
                { label: "Customer since", value: sheet.since },
              ]}
            />
          </div>
        )}
      </Sheet>
    </AppShell>
  );
}

export function Dashboard() {
  return (
    <ToastProvider>
      <DashboardPage />
    </ToastProvider>
  );
}
