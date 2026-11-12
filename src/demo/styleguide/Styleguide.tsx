import { useState, type ReactNode } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Container,
  GlassNav,
  Glass,
  Icons,
  Metric,
  PinnedGallery,
  SearchField,
  Section,
  SectionHeader,
  SegmentedControl,
  Select,
  Switch,
  TextInput,
  Field,
  Tile,
  UIInput,
  ScrollManager,
} from "@/components/lg";
import { Logo, ThemeToggle } from "../shared/Brand";
import { SiteFooter } from "../shared/Footer";
import { Scene } from "../shared/Scene";
import { site } from "../shared/site";

const colors: [string, string, string][] = [
  ["canvas", "bg-canvas", "Page"],
  ["canvas-subtle", "bg-canvas-subtle", "Alternate sections, app background"],
  ["surface", "bg-surface", "Cards on subtle, inputs"],
  ["surface-2", "bg-surface-2", "Cards on white"],
  ["surface-3", "bg-surface-3", "Pressed, wells, tracks"],
  ["ink", "bg-ink", "Text, primary button"],
  ["ink-2", "bg-ink-2", "Secondary text"],
  ["ink-3", "bg-ink-3", "Meta ≥ 14 px medium, icons"],
  ["ink-4", "bg-ink-4", "Placeholders on fills"],
  ["accent", "bg-accent", "Fills, selection, chart 1"],
  ["accent-strong", "bg-accent-strong", "Links, focus, accent button"],
  ["success", "bg-success", "Status fill"],
  ["warning", "bg-warning", "Status fill"],
  ["danger", "bg-danger", "Status fill"],
];
const charts = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5", "bg-chart-6"];

const marketingType: [string, string, string][] = [
  ["text-hero", "Hero", "48 · 123 · 136 / 500"],
  ["text-display", "Display", "42 · 64 · 72 / 500"],
  ["text-h1", "Heading 1", "36 · 52 · 60 / 500"],
  ["text-h2", "Heading 2", "30 · 40 · 46 / 500"],
  ["text-h3", "Heading 3", "22 · 26 · 28 / 500"],
  ["text-h4", "Heading 4", "18 · 20 / 500"],
  ["text-lead", "Lead paragraph for heroes and cards", "18 · 20 · 21 / 400"],
  ["text-body", "Body copy for running text on landing pages", "17 / 400"],
  ["text-small", "Small for nav, lists and meta", "15 / 400"],
  ["text-label", "Label for eyebrows", "14 / 500"],
  ["text-caption", "Caption for legal and reassurance", "13 / 400"],
];
const productType: [string, string, string][] = [
  ["text-ui-large-title", "Large Title", "26 / 32 · 600"],
  ["text-ui-title-1", "Title 1", "22 / 28 · 600"],
  ["text-ui-title-2", "Title 2 for toolbars and panels", "17 / 24 · 600"],
  ["text-ui-title-3", "Title 3 for card titles", "15 / 20 · 600"],
  ["text-ui-headline", "Headline for emphasised rows", "14 / 20 · 600"],
  ["text-ui-body", "Body, the default in products", "14 / 20 · 400"],
  ["text-ui-callout", "Callout for dense tables and secondary text", "13 / 18 · 400"],
  ["text-ui-subhead", "Subhead for column headers and meta", "12 / 16 · 500"],
  ["text-ui-caption", "Caption for axes and badges, the minimum", "11 / 14 · 500"],
  ["text-ui-metric", "$48,210", "28 / 32 · 500 tabular"],
];

function Block({ title, children, note }: { title: string; note?: string; children: ReactNode }) {
  return (
    <div className="border-t border-hairline pt-6">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-h4">{title}</h3>
        {note && <p className="text-small text-ink-2">{note}</p>}
      </div>
      {children}
    </div>
  );
}

export function Styleguide() {
  const [seg, setSeg] = useState<"regular" | "thick" | "clear">("regular");
  const [sw, setSw] = useState(true);
  const [cb, setCb] = useState(true);
  const [q, setQ] = useState("");
  return (
    <div className="lg-root flow-root">
      <ScrollManager />
      <GlassNav
        logo={<Logo />}
        items={[
          { label: "Color", href: "#color" },
          { label: "Type", href: "#type" },
          { label: "Shape", href: "#shape" },
          { label: "Glass", href: "#glass" },
          { label: "Controls", href: "#controls" },
        ]}
        cta={{ label: "GitHub", href: site.links.repo }}
        secondary={{ label: "Dashboard", href: site.links.dashboard }}
        homeHref={site.links.home}
      />
      <main>
        <Section spacing="sm" offsetNav>
          <Container>
            <div className="flex items-start justify-between gap-6">
              <SectionHeader as="h1" size="display" title="Styleguide." titleMuted="Every token, live." lead="Toggle the theme to check light and dark. Turn on Increase Contrast or Reduce Transparency in your OS to see the accessible fallbacks." flush />
              <ThemeToggle />
            </div>
          </Container>
        </Section>

        <Section id="color" spacing="md">
          <Container className="grid grid-cols-1 gap-16">
            <SectionHeader title="Color." titleMuted="Monochrome, one accent." flush />
            <Block title="Semantic colors" note="Tailwind class = bg-/text-/border- + token">
              <div className="grid grid-cols-2 gap-grid sm:grid-cols-3 lg:grid-cols-5">
                {colors.map(([name, cls, use]) => (
                  <div key={name}>
                    <div className={`${cls} h-20 rounded-control shadow-hairline`} />
                    <p className="mt-2 text-small font-medium">{name}</p>
                    <p className="text-caption text-ink-2">{use}</p>
                  </div>
                ))}
              </div>
            </Block>
            <Block title="Chart palette" note="Series 1 is always the accent. Max 6 series.">
              <div className="flex h-12 overflow-hidden rounded-control">
                {charts.map((c) => (
                  <div key={c} className={`${c} flex-1`} />
                ))}
              </div>
            </Block>
            <Block title="Status" note="Fill tint + text color, always with a word">
              <div className="flex flex-wrap gap-2">
                <Badge tone="success">Success</Badge>
                <Badge tone="warning">Warning</Badge>
                <Badge tone="danger">Danger</Badge>
                <Badge tone="info">Info</Badge>
                <Badge>Neutral</Badge>
              </div>
            </Block>
          </Container>
        </Section>

        <Section id="type" spacing="md" tone="subtle">
          <Container className="grid grid-cols-1 gap-16">
            <SectionHeader title="Typography." titleMuted="Two scales, never mixed." lead="SF Pro on Apple devices, Inter Variable everywhere else. Marketing headings 500, product titles 600." flush />
            <Block title="Marketing scale" note="390 · 1440 · 1920 px">
              <div className="grid grid-cols-1 gap-5">
                {marketingType.map(([cls, sample, spec]) => (
                  <div key={cls} className="grid grid-cols-1 items-baseline gap-2 md:grid-cols-[14rem_1fr]">
                    <p className="text-caption text-ink-2">
                      {cls}
                      <br />
                      {spec}
                    </p>
                    <p className={`${cls} truncate`}>{sample}</p>
                  </div>
                ))}
              </div>
            </Block>
            <Block title="Product scale" note="inside AppShell or [data-density=product]">
              <div className="grid grid-cols-1 gap-4" data-density="product">
                {productType.map(([cls, sample, spec]) => (
                  <div key={cls} className="grid grid-cols-1 items-baseline gap-2 md:grid-cols-[14rem_1fr]">
                    <p className="text-caption text-ink-2">
                      {cls}
                      <br />
                      {spec}
                    </p>
                    <p className={`${cls} ${cls === "text-ui-metric" ? "tabular-nums" : ""}`}>{sample}</p>
                  </div>
                ))}
              </div>
            </Block>
          </Container>
        </Section>

        <Section id="shape" spacing="md">
          <Container className="grid grid-cols-1 gap-16">
            <SectionHeader title="Shape and depth." titleMuted="Concentric, quiet." lead="Inner radius = outer radius minus padding. Controls are capsules. Shadows are rare and soft." flush />
            <Block title="Radii">
              <div className="grid grid-cols-2 gap-grid sm:grid-cols-4 lg:grid-cols-8">
                {[
                  ["chip", "rounded-chip", "8"],
                  ["control", "rounded-control", "12"],
                  ["card", "rounded-card", "24"],
                  ["panel", "rounded-panel", "28"],
                  ["ui-control", "rounded-ui-control", "10"],
                  ["ui-card", "rounded-ui-card", "16"],
                  ["ui-panel", "rounded-ui-panel", "20"],
                  ["pill", "rounded-pill", "∞"],
                ].map(([n, c, v]) => (
                  <div key={n}>
                    <div className={`${c} h-20 bg-surface-2 shadow-hairline`} />
                    <p className="mt-2 text-small">{n}</p>
                    <p className="text-caption text-ink-2">{v} px</p>
                  </div>
                ))}
              </div>
            </Block>
            <Block title="Elevation">
              <div className="grid grid-cols-2 gap-grid md:grid-cols-4">
                {["shadow-hairline", "shadow-elev-1", "shadow-elev-2", "shadow-elev-3"].map((s) => (
                  <div key={s} className={`${s} grid h-28 place-items-center rounded-card bg-surface text-small text-ink-2`}>
                    {s}
                  </div>
                ))}
              </div>
            </Block>
          </Container>
        </Section>

        <Section id="glass" spacing="md" tone="subtle">
          <Container className="grid grid-cols-1 gap-12">
            <SectionHeader title="Liquid Glass." titleMuted="Controls only." lead="Regular for bars and controls, thick for menus and sheets, clear only over photos and video (with a 35 % dim on bright media)." flush />
            <SegmentedControl aria-label="Glass variant" value={seg} onChange={setSeg} options={[{ value: "regular", label: "Regular" }, { value: "thick", label: "Thick" }, { value: "clear", label: "Clear" }]} />
            <div className="relative overflow-hidden rounded-panel">
              <Scene variant={seg === "clear" ? "dusk" : "dawn"} className="h-[22rem]" />
              <div className="absolute inset-0 grid place-items-center gap-4 p-6">
                <Glass variant={seg} dim={seg === "clear"} shape="pill" className="flex items-center gap-1 p-1.5" interactive>
                  {[Icons.Home, Icons.Search, Icons.Bell, Icons.Settings].map((I, i) => (
                    <span key={i} className={`grid size-11 place-items-center rounded-pill ${seg === "clear" ? "text-white" : "text-ink"} ${i === 0 ? "bg-ink/[0.08]" : ""}`}>
                      <I size={22} />
                    </span>
                  ))}
                </Glass>
                <p className={`text-small ${seg === "clear" ? "text-white" : "text-ink"}`}>{seg} glass, move the pointer over it</p>
              </div>
            </div>
          </Container>
        </Section>

        <Section id="controls" spacing="md">
          <Container className="grid grid-cols-1 gap-16">
            <SectionHeader title="Controls." titleMuted="Marketing and product sizes." flush />
            <Block title="Buttons, marketing" note="sm 36 · md 44 · lg 48">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg">Primary</Button>
                <Button size="lg" variant="secondary">Secondary</Button>
                <Button size="lg" variant="accent">Accent</Button>
                <Button size="lg" variant="ghost">Ghost</Button>
                <Button size="md">Medium</Button>
                <Button size="sm">Small</Button>
                <Button size="icon" variant="secondary" aria-label="Next">
                  <Icons.ArrowRight />
                </Button>
              </div>
            </Block>
            <Block title="Buttons, product" note="xs 28 · ui 32 · icon-ui 32 (44 hit area)">
              <div className="flex flex-wrap items-center gap-2" data-density="product">
                <Button size="ui" variant="accent">Save changes</Button>
                <Button size="ui">Continue</Button>
                <Button size="ui" variant="secondary">Cancel</Button>
                <Button size="ui" variant="ghost">Skip</Button>
                <Button size="ui" variant="destructive">Delete</Button>
                <Button size="xs" variant="secondary">Edit</Button>
                <Button size="icon-ui" variant="ghost" aria-label="More">
                  <Icons.More />
                </Button>
              </div>
            </Block>
            <Block title="Product inputs" note="32 px wells, 44 px on touch">
              <div className="grid max-w-xl grid-cols-1 gap-4" data-density="product">
                <SearchField value={q} onChange={setQ} shortcut="⌘K" />
                <UIInput placeholder="Workspace name" icon={<Icons.Document size={16} />} />
                <Select aria-label="Plan" defaultValue="growth">
                  <option value="starter">Starter</option>
                  <option value="growth">Growth</option>
                  <option value="scale">Scale</option>
                </Select>
                <Switch label="Email digest" description="Every Monday" checked={sw} onChange={setSw} />
                <div className="flex gap-6">
                  <Checkbox label="Checkbox" checked={cb} onChange={setCb} />
                  <Checkbox label="Radio" shape="radio" checked={!cb} onChange={() => setCb(!cb)} />
                </div>
              </div>
            </Block>
            <Block title="Marketing form field" note="48 px, 17 px text (no iOS zoom)">
              <div className="max-w-md">
                <Field label="Work email" hint="We never share it.">
                  <TextInput placeholder="you@company.com" />
                </Field>
              </div>
            </Block>
            <Block title="Metric" note="product">
              <div className="grid max-w-text grid-cols-1 gap-4 sm:grid-cols-2" data-density="product">
                <Metric label="Revenue" value="$48,210" delta="+12.4%" trend="up-good" spark={[3, 4, 3, 5, 6, 5, 7, 8]} />
                <Metric label="Open invoices" value="$4,210" delta="+$900" trend="up-bad" hint="3 past due" />
              </div>
            </Block>
            <Block title="Tiles" note="marketing content cards, solid, never glass">
              <div className="grid grid-cols-1 gap-grid md:grid-cols-2">
                <Tile>
                  <h4 className="text-h3">Filled tile</h4>
                  <p className="mt-2 text-lead text-ink-2">Surface-2 on white sections.</p>
                </Tile>
                <Tile variant="outline">
                  <h4 className="text-h3">Outline tile</h4>
                  <p className="mt-2 text-lead text-ink-2">White with a hairline.</p>
                </Tile>
              </div>
            </Block>
          </Container>
        </Section>

        <PinnedGallery header={<SectionHeader title="PinnedGallery." titleMuted="Scroll down, move sideways." flush />}>
          {(["dusk", "ocean", "dawn", "dusk"] as const).map((v, i) => (
            <div key={i} className="relative overflow-hidden rounded-panel">
              <Scene variant={v} className="aspect-[4/3]" />
              <Glass variant="clear" dim shape="pill" className="absolute bottom-5 left-5 px-4 py-2 text-small font-medium">
                Chapter {i + 1}
              </Glass>
            </div>
          ))}
        </PinnedGallery>
      </main>
      <SiteFooter />
    </div>
  );
}
