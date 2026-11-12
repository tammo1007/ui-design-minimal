import {
  Aurora,
  Button,
  CardRail,
  Container,
  CountUp,
  DockNav,
  FaqList,
  FeatureItem,
  FloatingDevice,
  Icons,
  Marquee,
  MediaExpand,
  ParallaxColumns,
  PhoneFrame,
  RailCard,
  RailControls,
  Reveal,
  Section,
  SectionHeader,
  SmartLink,
  StackCards,
  TextReveal,
  ZoomThrough,
  useCardRail,
  ScrollManager,
} from "@/components/lg";
import { Logo, LogoMark, ThemeToggle } from "../shared/Brand";
import { SiteFooter } from "../shared/Footer";
import { Scene } from "../shared/Scene";
import { site } from "../shared/site";
import { ButtonsVisual, ChartVisual, ControlsVisual, PhoneApp, SegmentVisual, SidebarVisual, StatusVisual, TableVisual, TypeVisual } from "./visuals";

const agents = ["Claude Code", "Cursor", "Lovable", "v0", "Windsurf", "Codex", "Bolt", "Replit", "GitHub Copilot", "Gemini CLI"];

const faq = [
  { q: "What do I give my coding agent?", a: "DESIGN.md. It holds every token in its front matter and every rule in plain sentences. AGENTS.md adds the build rules and the Definition of Done, and the audit script catches what slips through." },
  { q: "Can I use it for dashboards?", a: "Yes. The system has two densities. Landing pages use the marketing scale (17 px body). Products use the product scale inside AppShell: 14 px body, 32 px controls, 44 px table rows, the same tokens and the same glass rules." },
  { q: "Does it ship Apple fonts?", a: "No. Apple devices render SF Pro as the system font; everyone else gets Inter Variable. SF font files are never embedded, which Apple's license does not allow on websites." },
  { q: "Which stack does it need?", a: "React 18 or 19, Tailwind CSS v4, motion and lenis. The tokens are plain CSS variables, so the look also ports to any other stack. A W3C tokens.json is included for design tools." },
  { q: "Is it affiliated with Apple?", a: "No. It is an independent design system that follows the public Human Interface Guidelines for Liquid Glass. Apple is a trademark of Apple Inc." },
];

export function Landing() {
  const rail = useCardRail();
  return (
    <div className="lg-root flow-root">
      <ScrollManager />
      <DockNav
        logo={
          <span className="flex items-center gap-1">
            <Logo />
          </span>
        }
        mark={<LogoMark />}
        items={site.nav}
        cta={{ label: "Get it on GitHub", href: site.links.repo }}
        ctaShort={{ label: "GitHub", href: site.links.repo }}
        secondary={{ label: "Dashboard demo", href: site.links.dashboard }}
      />
      <main>
        {/* HERO */}
        <section id="top" className="lg-hero">
          <Aurora />
          <Container size="wide" className="lg-hero__inner">
            <div className="lg-hero__top flex items-start justify-between gap-6">
              <h1 className="text-hero" aria-label="Liquid Glass, written for agents.">
                <span className="lg-hero-in block" style={{ "--lg-hero-i": 0 } as React.CSSProperties}>
                  Liquid Glass,
                </span>
                <span className="lg-hero-in block text-ink-2" style={{ "--lg-hero-i": 1 } as React.CSSProperties}>
                  written for <span className="lg-hero-mark"><LogoMark className="size-full" /></span>agents.
                </span>
              </h1>
              <div className="hidden pt-3 lg:block">
                <ThemeToggle />
              </div>
            </div>
            <div className="lg-hero__device">
              <FloatingDevice>
                <PhoneFrame statusBar screen="light" glare>
                  <PhoneApp />
                </PhoneFrame>
              </FloatingDevice>
            </div>
            <div className="lg-hero__bottom grid grid-cols-1 gap-6 lg:max-w-[34rem]">
              <p className="lg-hero-in text-lead text-ink-2" style={{ "--lg-hero-i": 2 } as React.CSSProperties}>
                An Apple-like design system for landing pages and dashboards. Tokens, components, scroll moments and rules, in a DESIGN.md your agent follows to the pixel.
              </p>
              <div className="lg-hero-in flex flex-col gap-3 sm:flex-row" style={{ "--lg-hero-i": 3 } as React.CSSProperties}>
                <Button asChild size="lg">
                  <SmartLink href={site.links.repo}>
                    <Icons.ArrowUpRight size={18} />
                    Get it on GitHub
                  </SmartLink>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <SmartLink href={site.links.dashboard}>Open the dashboard demo</SmartLink>
                </Button>
              </div>
              <p className="lg-hero-in text-caption text-ink-2" style={{ "--lg-hero-i": 4 } as React.CSSProperties}>
                MIT licensed · React and Tailwind v4 · Light and dark
              </p>
            </div>
          </Container>
        </section>

        {/* PROOF */}
        <Section spacing="sm" aria-labelledby="works-with">
          <Container>
            <h2 id="works-with" className="mb-8 text-label text-ink-2">
              Works with every coding agent that reads Markdown
            </h2>
          </Container>
          <Marquee aria-label="Supported tools" duration={45}>
            {agents.map((a) => (
              <span key={a} className="text-h4 text-ink-3">
                {a}
              </span>
            ))}
          </Marquee>
        </Section>

        {/* STATEMENT */}
        <Section spacing="md" aria-label="Principle">
          <Container size="text">
            <TextReveal text="Content first. Glass on top. The material belongs to navigation and controls, the content below stays solid, calm and readable. Every value comes from a token, every token has a rule." />
          </Container>
        </Section>

        {/* RAIL: always on landing pages */}
        <Section id="components" spacing="md" tone="subtle">
          <Container>
            <SectionHeader title="Every primitive." titleMuted="Ready before you ask." lead="Forty plus components for landing pages and products, each with exact sizes, states and a rule for when to use it." actions={<RailControls rail={rail} label="components" />} />
          </Container>
          <CardRail rail={rail} label="Components">
            <RailCard tone="mist" title="Buttons" body="Capsules. One prominent action per view, always on the trailing side." media={<ButtonsVisual />} />
            <RailCard tone="sky" title="Glass controls" body="Regular glass for bars, clear glass only over rich media." media={<SegmentVisual />} />
            <RailCard tone="sand" title="Sidebar" body="A floating glass panel, 8 px off the edge, two levels at most." media={<SidebarVisual />} />
            <RailCard tone="mist" title="Settings" body="Switches for things that apply at once. The knob turns to glass while pressed." media={<ControlsVisual />} />
            <RailCard tone="sky" title="Metrics" body="Tabular numbers, a delta that says good or bad, a quiet sparkline." media={<ChartVisual />} />
            <RailCard tone="sand" title="Tables" body="44 px rows, hairlines, numbers right aligned, headers in Title Case." media={<TableVisual />} />
            <RailCard tone="mist" title="Status" body="Tinted badges that always carry a word, never color alone." media={<StatusVisual />} />
            <RailCard tone="sky" title="Two type scales" body="Marketing at 17 px body, product at 14 px. Never mixed." media={<TypeVisual />} />
          </CardRail>
        </Section>

        {/* SHOWPIECE 1 */}
        <div id="scroll">
          <MediaExpand
            eyebrow="Scroll sections"
            title="Moments that feel like a product launch."
            media={<Scene variant="dusk" className="size-full" />}
            caption="MediaExpand · pinned · 220 svh"
          />
        </div>

        {/* FEATURES */}
        <Section spacing="md">
          <Container>
            <SectionHeader title="Built like a spec." titleMuted="Read like a story." />
            <Reveal stagger className="grid grid-cols-1 gap-x-grid gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureItem icon={<Icons.Document size={24} />} title="DESIGN.md">Tokens in the front matter, rules in plain sentences. The file your agent reads first.</FeatureItem>
              <FeatureItem icon={<Icons.Stack size={24} />} title="Two densities">Marketing and product scales from one token set, so a landing page and its dashboard feel like one brand.</FeatureItem>
              <FeatureItem icon={<Icons.Moon size={24} />} title="Light, dark, high contrast">Every color has a light, a dark and an increased contrast value, straight from Apple's palette.</FeatureItem>
              <FeatureItem icon={<Icons.Columns size={24} />} title="Real glass rules">Regular, thick and clear glass, each with its place. Fallbacks for reduced transparency built in.</FeatureItem>
              <FeatureItem icon={<Icons.ArrowsUpDown size={24} />} title="Scroll showpieces">MediaExpand, StackCards, ZoomThrough, PinnedGallery, TextReveal and more, all reduced motion safe.</FeatureItem>
              <FeatureItem icon={<Icons.Success size={24} />} title="An audit that says no">A static check fails the build on raw colors, default font sizes, glass on cards and other drift.</FeatureItem>
            </Reveal>
          </Container>
        </Section>

        {/* SHOWPIECE 2 */}
        <Section spacing="sm" tone="subtle" aria-labelledby="layers">
          <Container>
            <SectionHeader as="h2" title="Three layers." titleMuted="One system." />
            <h2 id="layers" className="sr-only">
              Three layers
            </h2>
            <StackCards>
              {[
                {
                  n: "01",
                  t: "Tokens",
                  b: "Color, type, spacing, radius, elevation, motion and layers. CSS variables, Tailwind classes and a W3C tokens.json.",
                  tone: "lg-tone lg-tone--sky",
                  v: (
                    <pre className="overflow-hidden rounded-control bg-surface/80 p-6 font-mono text-small leading-relaxed text-ink shadow-hairline">
{`--lg-ink: 29 29 31;
--lg-accent: 0 136 255;
--lg-ui-body: 0.875rem;
--lg-r-ui-card: 1rem;
--lg-glass-blur: 24px;
--lg-ease-spring: linear(…);`}
                    </pre>
                  ),
                },
                { n: "02", t: "Components", b: "Marketing sections, product controls and scroll showpieces. Each one is the only way to build its pattern.", tone: "lg-tone lg-tone--sand", v: <div className="grid grid-cols-1 justify-items-center gap-4"><ChartVisual /><ButtonsVisual /></div> },
                {
                  n: "03",
                  t: "Rules",
                  b: "When to use glass, how many prominent buttons, which scale where. Written so an agent can follow them without guessing.",
                  tone: "lg-tone lg-tone--slate",
                  v: (
                    <ul className="grid grid-cols-1 gap-3">
                      {["Glass only on navigation and controls", "One prominent action per view", "Product pages use text-ui-* only", "A CardRail on every landing page", "Max 3 pinned scroll sections"].map((r) => (
                        <li key={r} className="flex items-center gap-3 text-lead">
                          <Icons.Check size={20} className="shrink-0 opacity-80" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  ),
                },
              ].map((c) => (
                <div key={c.n} className={`${c.tone} grid min-h-[70svh] grid-cols-1 items-center gap-10 p-card md:min-h-[30rem] md:grid-cols-2`}>
                  <div className="flex h-full flex-col justify-between gap-10">
                    <p className="text-label opacity-70">{c.n}</p>
                    <div>
                      <h3 className="text-h1">{c.t}</h3>
                      <p className="mt-4 max-w-[38ch] text-lead opacity-80">{c.b}</p>
                    </div>
                  </div>
                  <div className="min-w-0">{c.v}</div>
                </div>
              ))}
            </StackCards>
          </Container>
        </Section>

        {/* GALLERY WALL */}
        <Section spacing="md" aria-labelledby="gallery">
          <Container>
            <SectionHeader title="Made from the system." titleMuted="Nothing else." />
            <h2 id="gallery" className="sr-only">
              Gallery
            </h2>
            <ParallaxColumns>
              <div className="grid place-items-center rounded-card bg-surface-2 p-8"><ChartVisual /></div>
              <Scene variant="ocean" className="aspect-[4/5] rounded-card" />
              <div className="grid place-items-center rounded-card bg-surface-2 p-8"><ControlsVisual /></div>
              <div className="grid place-items-center rounded-card bg-surface-2 p-8"><StatusVisual /></div>
              <div className="grid place-items-center rounded-card bg-surface-2 p-8"><TableVisual /></div>
              <Scene variant="dawn" className="aspect-[4/5] rounded-card" />
            </ParallaxColumns>
          </Container>
        </Section>

        {/* SHOWPIECE 3 (dark) */}
        <ZoomThrough
          word="Glass."
          media={<Scene variant="dusk" className="size-full" />}
          after={
            <div className="max-w-[34rem]">
              <p className="text-h2">Clear glass, only over media.</p>
              <p className="mt-3 text-lead text-ink-2">Over photos and video the clear variant lets the color through, with a 35 percent dim when the media is bright.</p>
            </div>
          }
        />

        {/* NUMBERS */}
        <Section spacing="md" aria-labelledby="numbers">
          <Container>
            <h2 id="numbers" className="sr-only">
              In numbers
            </h2>
            <div className="grid grid-cols-2 gap-grid lg:grid-cols-4">
              {[
                [140, "+", "design tokens"],
                [48, "", "components"],
                [7, "", "scroll showpieces"],
                [0, "", "hard-coded values in pages"],
              ].map(([v, s, l]) => (
                <div key={l as string} className="border-t border-hairline pt-5">
                  <CountUp value={v as number} suffix={s as string} className="text-stat tabular-nums" />
                  <p className="mt-2 text-small text-ink-2">{l as string}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* AGENTS */}
        <Section id="agents" spacing="md" tone="subtle">
          <Container>
            <SectionHeader title="Hand it to your agent." titleMuted="Get the same page back." />
            <ol className="grid grid-cols-1 gap-grid md:grid-cols-3">
              {[
                ["01", "Add the files", "Copy src/styles, src/components/lg and src/lib/cn.ts into your project, or clone the repo as a starter."],
                ["02", "Point the agent", "Put DESIGN.md and AGENTS.md in the project root. Claude Code, Cursor and Lovable read them on every message."],
                ["03", "Let the audit judge", "npm run audit fails on raw values, wrong scales and glass on cards. Fix, rerun, ship."],
              ].map(([n, t, b]) => (
                <li key={n} className="border-t border-ink pt-6">
                  <p className="text-label text-ink-3">{n}</p>
                  <h3 className="mt-3 text-h3">{t}</h3>
                  <p className="mt-2 text-body text-ink-2">{b}</p>
                </li>
              ))}
            </ol>
          </Container>
        </Section>

        {/* FAQ */}
        <Section id="faq" spacing="md">
          <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeader title="Questions." titleMuted="Short answers." flush />
            </div>
            <FaqList items={faq} className="lg:col-span-8" />
          </Container>
        </Section>

        {/* FINAL CTA */}
        <Section id="cta" spacing="lg" tone="subtle">
          <Container size="text" className="text-center">
            <SectionHeader align="center" title="Start with the file." titleMuted="Ship with the system." flush />
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <SmartLink href={site.links.repo}>Get it on GitHub</SmartLink>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <SmartLink href={site.links.styleguide}>Browse the styleguide</SmartLink>
              </Button>
            </div>
            <p className="mt-6 text-caption text-ink-2">
              Made by{" "}
              <SmartLink href={site.author.linkedin} target="_blank" className="text-ink underline decoration-hairline-strong underline-offset-4">
                {site.author.name}
              </SmartLink>
            </p>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
