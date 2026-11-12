---
name: UI Design Minimal
version: 1.0.0
description: Apple-like, super clean minimal design system with Liquid Glass controls for landing pages and product UI (dashboards, apps, admin). Monochrome chrome, one accent, glass only on navigation and controls, two type scales, scroll showpieces.
author: Tammo Elsner (https://www.linkedin.com/in/tammo-elsner-682998186/)
license: MIT
source: https://github.com/tammo1007/ui-design-minimal
based_on: Apple Human Interface Guidelines (Materials, Color, Typography, Layout, Accessibility, Liquid Glass), public guidance only
stack: React 18/19, Tailwind CSS v4, motion, lenis, Heroicons
colors:
  light:
    canvas: "#FFFFFF"
    canvas-subtle: "#F5F5F7"
    surface: "#FFFFFF"
    surface-2: "#F5F5F7"
    surface-3: "#E8E8ED"
    ink: "#1D1D1F"
    ink-2: "#6E6E73"
    ink-3: "#8E8E93"
    ink-4: "#C7C7CC"
    accent: "#0088FF"
    accent-strong: "#1E6EF4"
    accent-fill: "#1E6EF4"
    accent-ink: "#FFFFFF"
    success: "#34C759"
    success-text: "#008932"
    warning: "#FF8D28"
    warning-text: "#C55300"
    danger: "#FF383C"
    danger-text: "#E9152D"
    chart: ["#0088FF", "#FF8D28", "#00C3D0", "#CB30E0", "#34C759", "#8E8E93"]
    hairline: "rgba(0,0,0,0.08)"
    hairline-strong: "rgba(0,0,0,0.14)"
    scrim: "rgba(0,0,0,0.32)"
  dark:
    canvas: "#000000"
    canvas-subtle: "#121214"
    surface: "#1C1C1E"
    surface-2: "#1C1C1E"
    surface-3: "#2C2C2E"
    ink: "#F5F5F7"
    ink-2: "#A1A1A6"
    ink-3: "#6E6E73"
    ink-4: "#48484A"
    accent: "#0091FF"
    accent-strong: "#5CB8FF"
    accent-fill: "#0A64E6"
    accent-ink: "#FFFFFF"
    success: "#30D158"
    success-text: "#4AD968"
    warning: "#FF9230"
    warning-text: "#FFA056"
    danger: "#FF4245"
    danger-text: "#FF6165"
    chart: ["#0091FF", "#FF9230", "#00D2E0", "#DB34F2", "#30D158", "#636366"]
    hairline: "rgba(255,255,255,0.10)"
    hairline-strong: "rgba(255,255,255,0.17)"
    scrim: "rgba(0,0,0,0.55)"
typography:
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Inter Variable', Inter, 'Segoe UI', Roboto, sans-serif"
  marketing:   # fontSize at 390 / 1440 / 1920 px viewport
    hero:    { fontSize: "48 / 123 / 136px", fontWeight: 500, lineHeight: 0.94, letterSpacing: "-0.05em", class: text-hero }
    display: { fontSize: "42 / 64 / 72px",   fontWeight: 500, lineHeight: 1.04, letterSpacing: "-0.035em", class: text-display }
    h1:      { fontSize: "36 / 52 / 60px",   fontWeight: 500, lineHeight: 1.06, letterSpacing: "-0.03em", class: text-h1 }
    h2:      { fontSize: "30 / 40 / 46px",   fontWeight: 500, lineHeight: 1.10, letterSpacing: "-0.025em", class: text-h2 }
    h3:      { fontSize: "22 / 26 / 28px",   fontWeight: 500, lineHeight: 1.20, letterSpacing: "-0.018em", class: text-h3 }
    h4:      { fontSize: "18 / 20 / 20px",   fontWeight: 500, lineHeight: 1.30, letterSpacing: "-0.012em", class: text-h4 }
    lead:    { fontSize: "18 / 20 / 21px",   fontWeight: 400, lineHeight: 1.50, letterSpacing: "-0.012em", class: text-lead }
    body:    { fontSize: "17px", fontWeight: 400, lineHeight: 1.53, letterSpacing: "-0.01em", class: text-body }
    small:   { fontSize: "15px", fontWeight: 400, lineHeight: 1.47, letterSpacing: "-0.006em", class: text-small }
    label:   { fontSize: "14px", fontWeight: 500, lineHeight: 1.30, letterSpacing: "0", class: text-label }
    caption: { fontSize: "13px", fontWeight: 400, lineHeight: 1.38, letterSpacing: "0", class: text-caption }
    stat:    { fontSize: "44 / 64 / 72px",   fontWeight: 300, lineHeight: 1.00, letterSpacing: "-0.04em", class: text-stat }
  product:
    large-title: { fontSize: 26px, fontWeight: 600, lineHeight: 32px, letterSpacing: "-0.022em", class: text-ui-large-title }
    title-1:     { fontSize: 22px, fontWeight: 600, lineHeight: 28px, letterSpacing: "-0.02em", class: text-ui-title-1 }
    title-2:     { fontSize: 17px, fontWeight: 600, lineHeight: 24px, letterSpacing: "-0.015em", class: text-ui-title-2 }
    title-3:     { fontSize: 15px, fontWeight: 600, lineHeight: 20px, letterSpacing: "-0.01em", class: text-ui-title-3 }
    headline:    { fontSize: 14px, fontWeight: 600, lineHeight: 20px, letterSpacing: "-0.006em", class: text-ui-headline }
    body:        { fontSize: 14px, fontWeight: 400, lineHeight: 20px, letterSpacing: "-0.006em", class: text-ui-body }
    callout:     { fontSize: 13px, fontWeight: 400, lineHeight: 18px, letterSpacing: "-0.003em", class: text-ui-callout }
    subhead:     { fontSize: 12px, fontWeight: 500, lineHeight: 16px, letterSpacing: "0", class: text-ui-subhead }
    caption:     { fontSize: 11px, fontWeight: 500, lineHeight: 14px, letterSpacing: "0.006em", class: text-ui-caption }
    metric:      { fontSize: 28px, fontWeight: 500, lineHeight: 32px, letterSpacing: "-0.025em", class: text-ui-metric }
    metric-lg:   { fontSize: 40px, fontWeight: 500, lineHeight: 44px, letterSpacing: "-0.03em", class: text-ui-metric-lg }
spacing:
  base: 4px
  marketing:
    section-y: "88 / 144 / 160px (py-section)"
    section-y-sm: "56 / 80 / 96px (py-section-sm)"
    section-y-lg: "104 / 170 / 192px (py-section-lg)"
    header-gap: "40 / 64px (mb-header)"
    grid-gap: "16 / 24px (gap-grid)"
    card-pad: "24 / 40px (p-card)"
    gutter: "20 / 40px (built into Container)"
  product:
    app-pad: "16 / 24px (px-app)"
    app-gap: "12 / 16px (gap-app-gap)"
    card-pad-ui: "16 / 20px (p-card-ui)"
    app-inset: "8px (floating glass panels off the window edge)"
    control: { xs: 28px, sm: 32px, md: 36px, lg: 44px }
    row: { compact: 36px, regular: 44px, comfy: 52px }
    sidebar: 248px
    sidebar-collapsed: 64px
    toolbar: 52px
    inspector: 320px
  containers: { text: 720px, content: 1280px, wide: 1440px, measure: 60ch }
rounded:
  marketing: { chip: 8px, control: 12px, card: "24px (20 on phones)", panel: "28px (20 on phones)", pill: 9999px }
  product: { ui-control: 10px, ui-card: 16px, ui-panel: 20px, ui-window: 28px, pill: 9999px }
  rule: "concentric: inner radius = outer radius minus padding"
elevation:
  shadow-elev-1: "0 1px 2px rgba(0,0,0,.04)"
  shadow-elev-2: "0 2px 4px rgba(0,0,0,.03), 0 12px 32px -8px rgba(0,0,0,.10)"
  shadow-elev-3: "0 4px 8px rgba(0,0,0,.04), 0 32px 64px -16px rgba(0,0,0,.20)"
  shadow-hairline: "0 0 0 1px hairline"
  z: { raised: 10, sticky: 20, nav: 40, overlay: 50, modal: 60, popover: 70, toast: 80, tooltip: 90 }
glass:
  regular: { tint: "white 72% (dark: rgb(40,40,44) 55%)", blur: "24px (18 on phones)", saturate: "180%", rim: "inset 1px top highlight + 1px edge", use: "nav, toolbar, tab bar, sidebar, segmented controls, sticky CTA" }
  thick: { tint: "white 86% (dark: rgb(30,30,33) 86%)", use: "menus, popovers, sheets, toasts, phone nav sheet" }
  clear: { tint: "white 16%", dim: "black 35% when media is bright", use: "controls floating over photos and video only" }
motion:
  easing: { out: "cubic-bezier(.22,1,.36,1)", in-out: "cubic-bezier(.65,0,.35,1)", spring: "linear() damped spring, zeta .62" }
  duration: { press: 120ms, fast: 200ms, base: 320ms, slow: 600ms, reveal: 900ms }
  reveal: "28px rise, 80ms stagger (max 8), once"
icons:
  set: "Heroicons v2 outline (24px grid)"
  stroke: "1.35 at 20 and 24px, 1.5 at 16px"
  sizes: [16, 20, 24]
components:
  button-primary: { background: ink, color: canvas, radius: pill, height: "36 / 44 / 48px marketing, 28 / 32px product", fontWeight: 500 }
  button-accent: { background: accent-fill, color: accent-ink, radius: pill, rule: "the ONE prominent action of a view, trailing side" }
  button-secondary: { background: transparent, border: "inset 1px hairline-strong", color: ink, radius: pill }
  card-marketing: { background: "surface-2 on white, surface on subtle", radius: card, padding: card-pad, shadow: none }
  card-product: { background: surface, radius: ui-card, padding: card-pad-ui, shadow: "hairline + elev-1" }
  input-marketing: { height: 48px, radius: control, fontSize: 17px, focus: "1.5px accent-strong ring + 4px accent 18% halo" }
  input-product: { height: "32px (44 on touch)", radius: ui-control, background: "ink 5%", fontSize: 14px }
  table: { header: "12/500 ink-2, Title Case", row: 44px, separators: hairline, numbers: "right-aligned, tabular" }
  badge: { height: 20px, radius: pill, fontSize: 11px, weight: 500, fill: "status 12%", text: "status-text" }
  sidebar: { material: "thick glass", width: 248px, inset: 8px, radius: 20px, item: "36px, r 10, 14/500" }
  toolbar: { height: 52px, rest: transparent, scrolled: "blur 20 + canvas-subtle 92%->60% + hairline", groups: "max 3, glass capsules" }
  rail-card: { width: "clamp(280px, 14rem + 9vw, 368px)", ratio: "4:5", radius: 24px, tones: [sky, mist, sand, slate, ink, clay] }
---

# UI Design Minimal

An Apple-like, minimal design system: monochrome chrome, one accent, two type scales and Liquid Glass reserved for navigation and controls.

Made by [Tammo Elsner](https://www.linkedin.com/in/tammo-elsner-682998186/). MIT license.

This file is the contract for humans and AI coding agents. Every value above is a token in `src/styles/lg-tokens.css`. Every sentence below is a rule. When this file and a request disagree, say so in one sentence, propose the closest system-conform option, and ask whether to use it, extend the system, or make a documented exception.

Read order for agents: this file, then `AGENTS.md` (how to build and the Definition of Done), then `docs/COMPONENTS.md` (exact component specs) when you touch a component.

---

## 1. Overview

**Character.** Quiet confidence. Monochrome interface, medium-weight type, generous whitespace, one accent color. Content carries the color; the chrome never competes with it. It should feel like an Apple product page on the marketing side and like a macOS or iPadOS app on the product side.

**Principles**

1. **Content first, glass on top.** Liquid Glass is a functional layer for navigation and controls that floats above content. Content (cards, tables, charts, forms, text) sits on solid surfaces.
2. **Two densities, one brand.** Marketing pages use the marketing scale. Product pages (dashboards, apps, admin, settings) use the product scale. Same colors, radii logic, glass rules and motion. Never mix the two scales on one surface.
3. **Monochrome chrome, one accent.** Navigation, buttons, headers and links are black, white and grey. The accent is the only hue in UI chrome, used for the one prominent action, selection, focus and the first chart series.
4. **Tokens, not values.** Pages contain no raw colors, sizes, radii, shadows, durations or z-indices. If a value is missing, add a token first.
5. **Left-aligned reading.** Section headers are left-aligned two-tone statements. Center only the landing hero variant and the final CTA.
6. **One idea per section.** A landing page has 8 to 14 sections, max 3 pinned scroll showpieces, exactly one CardRail.
7. **Everyone can use it.** WCAG 2.2 AA, light and dark, increased contrast, reduced motion and reduced transparency are part of the system, not extras.

**Which density?**

| You are building | Use | Wrapper |
|---|---|---|
| Landing page, product page, pricing, about, blog, docs | Marketing scale | `<div className="lg-root">` + `DockNav` (home) or `GlassNav` (subpages) |
| Dashboard, admin, settings, internal tool, any app screen | Product scale | `<AppShell>` (sets `data-density="product"`) |
| A product widget shown on a landing page | Product scale inside its own frame | wrapper with `data-density="product"` |

---

## 2. Colors

All colors are RGB triplets: `rgb(var(--lg-ink))`, Tailwind classes `bg-ink`, `text-ink-2`, `border-hairline`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `canvas` | #FFFFFF | #000000 | Page background |
| `canvas-subtle` | #F5F5F7 | #121214 | Alternate sections, app background behind cards |
| `surface` | #FFFFFF | #1C1C1E | Cards on subtle backgrounds, product cards, inputs |
| `surface-2` | #F5F5F7 | #1C1C1E | Cards on white sections |
| `surface-3` | #E8E8ED | #2C2C2E | Pressed states, wells, tracks, avatars |
| `ink` | #1D1D1F (16.8:1) | #F5F5F7 | Text, icons, primary button |
| `ink-2` | #6E6E73 (5.1:1) | #A1A1A6 | Secondary text, second line of two-tone headers |
| `ink-3` | #8E8E93 (3.3:1) | #6E6E73 | Meta at 14 px medium or larger, icons, disabled. Never body text |
| `ink-4` | #C7C7CC | #48484A | Placeholders on fills, decorative only |
| `accent` | #0088FF | #0091FF | Fills: selection tint, meters, chart series 1, aurora. Never small text |
| `accent-strong` | #1E6EF4 (4.9:1) | #5CB8FF | Links, focus ring, accent text, selected sidebar icon |
| `accent-fill` | #1E6EF4 | #0A64E6 | The prominent button, checked checkbox, highlighted menu item. White label |
| `success` / `success-text` | #34C759 / #008932 | #30D158 / #4AD968 | Status fill / status label |
| `warning` / `warning-text` | #FF8D28 / #C55300 | #FF9230 / #FFA056 | Status fill / status label |
| `danger` / `danger-text` | #FF383C / #E9152D | #FF4245 / #FF6165 | Status fill / label, destructive button (`danger-text` fill) |
| `chart-1..6` | blue, orange, teal, purple, green, grey | same, dark values | Data series in this order. Series 1 = accent |
| `hairline` / `hairline-strong` | black 8 % / 14 % | white 10 % / 17 % | Dividers, card outlines, secondary button ring |
| `scrim` | black 32 % | black 55 % | Behind dialogs and sheets |

**Rules**

- Chrome is monochrome. The accent appears at most on: one prominent button per view, selection, focus, links, the active sidebar icon, chart series 1. Never color several controls (HIG: color only the background of the primary action, never several).
- Swap the brand by changing `--lg-accent`, `--lg-accent-strong`, `--lg-accent-fill` (light, dark and increased contrast). Keep `accent-fill` at 4.5:1 or more against white. Nothing else changes.
- Status is never color alone: a badge always contains the word, a delta has an arrow, a chart series has a label or a dash pattern.
- `ink-3` and `accent` fail 4.5:1 for small text. Use `ink-2` and `accent-strong` for text.
- Dark mode: `<html data-theme="dark">` switches the whole page (the demo saves the choice in `localStorage["lg-theme"]` and falls back to `prefers-color-scheme`). A `<Section tone="dark">` on a light page is a near-black showcase panel (#0A0A0C). Max 2 dark sections per light page, never first, never adjacent.
- Increased contrast (`prefers-contrast: more`) darkens ink-2, ink-3, accent and status text and doubles hairlines. Do not override it.
- Rail tones (only inside `RailCard` and StackCards panels): sky #DBE7F6, mist #EEF1F5, sand #EDE7DE (ink text), slate #3A4C64, ink #1D1D1F, clay #785C42 (white text).
- Aurora (marketing hero and PageHero only): accent + lilac #B0A4FA + peach #FFD2B2, soft, never behind body text.

---

## 3. Typography

**Font.** `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter Variable", Inter, …`. Apple devices render SF Pro as the system font (nothing embedded). Everyone else gets Inter Variable, self-hosted via `@fontsource-variable/inter`. Never ship SF font files (Apple's license forbids it on websites) and never load Google Fonts.

**Marketing scale** (landing and content pages, sizes at 390 / 1440 / 1920 px): see front matter. Classes `text-hero`, `text-display`, `text-h1` … `text-caption`, `text-stat`.

**Product scale** (inside `AppShell` or `[data-density="product"]`): classes `text-ui-large-title` (26/32 600), `text-ui-title-1` (22/28 600), `text-ui-title-2` (17/24 600, toolbar title, dialog title), `text-ui-title-3` (15/20 600, card titles), `text-ui-headline` (14/20 600), `text-ui-body` (14/20, default), `text-ui-callout` (13/18, secondary and dense tables), `text-ui-subhead` (12/16 500, column headers, meta), `text-ui-caption` (11/14 500, axis labels, badges; the minimum), `text-ui-metric` (28/32 500), `text-ui-metric-lg` (40/44 500, one hero KPI per page).

Why two scales: Apple's own body size is 17 pt on iOS and 13 pt on macOS. Marketing pages are read like iOS (17 px body); dashboards are scanned like macOS. The product scale lands at 14 px body, the common size for dense web apps, with 11 px as the floor (HIG minimum).

**Rules**

- Marketing headings are weight 500, never bold. Product titles are 600 (built into `text-ui-*`). Body is 400. Never use 100 to 300 except `text-stat`.
- Never combine a size class with `font-bold`, a custom `leading-*` or `tracking-*`; the classes carry line height, tracking and weight.
- Two-tone header: statement in `ink`, continuation in `ink-2`, same size, both end with a period. `title="See every number." titleMuted="Act on the right one."` Statement up to 6 words, continuation up to 10. It renders as ONE h2.
- Sentence case everywhere. Title Case only for table column headers and button labels in product UI (HIG). No ALL CAPS except tiny product labels inside illustrations.
- Leads max 38rem wide, paragraphs max 60ch (`max-w-measure`), headings max 20ch.
- Numbers that line up (prices, KPIs, tables, times): `tabular-nums`.
- One `h1` per page. Every section opens with an `h2` (use `sr-only` when the design has no visible header). Cards, steps, FAQ questions are `h3`.
- On touch devices inputs are at least 16 px so iOS never zooms (handled by the input classes).

---

## 4. Layout

### Marketing pages

- Anatomy: `<Section tone spacing>` → `<Container size>` → `<SectionHeader>` → content. Width only through `Container`, vertical rhythm only through `Section spacing`.
- Containers: `text` 720, `content` 1280 (default), `wide` 1440 (hero), `full` (marquee). Gutter 20 to 40 px is built in.
- Section spacing: `md` 88 / 144 / 160 px (default), `sm` 56 / 80 / 96 (proof strips, subpage headers), `lg` 104 / 170 / 192 (final CTA). Header to content: 40 / 64 px (built into `SectionHeader`).
- Tones: `light` (default), `subtle` (#F5F5F7; never two subtle sections in a row), `dark` (showcase, max 2, `inset` + `<Haze />`).
- 12-column thinking from 1024 px: 7/5 card pairs, 8/4 quote + stats, 4/8 FAQ, 5/7 footer. Grids always declare a base column count (`grid-cols-1 …`) and use `gap-grid`.
- Breakpoints: sm 640, md 768, lg 1024, xl 1280, 2xl 1536. Test at 320, 390, 768, 1024, 1280, 1440, 1920. Use `svh`/`dvh`, never `h-screen` or `100vh`.

### Product pages

- Frame: `<AppShell brand nav currentHref footer>` → `<Toolbar title actions>` → `<AppContent>` → sections of `UICard`s.
- App background `canvas-subtle`; cards `surface` with a hairline. The sidebar is a floating thick-glass panel, 248 px wide, 8 px off the window edges, r 20. It collapses to 64 px (icons only). Below 1024 px it becomes a sheet opened from the toolbar; below 768 px a floating glass tab bar (up to 5 items with `tab: true`) sits bottom-center.
- Content: max 1440 px wide, padding 24 px (16 on phones), gap 16 px (12 on phones) between cards. Card padding 20 px (16 on phones).
- Grids: KPI row `grid-cols-2 xl:grid-cols-4`, chart + side card `xl:grid-cols-3` with the chart spanning 2, settings `lg:grid-cols-3`.
- Toolbar: title on the leading side (under 15 characters, never the app name), optional center control (date range), trailing groups. Max 3 groups. The one prominent action is the last item on the trailing side.
- Sidebar: max 2 levels of hierarchy, section titles in sentence case, icons from Heroicons at 20 px, badges are counts in `ink-2`.

---

## 5. Elevation and depth

There are three layers. Keep them apart.

| Layer | Material | Examples |
|---|---|---|
| Content | Solid surfaces, hairlines, rare soft shadows | Sections, tiles, product cards, tables, charts, forms, pricing, testimonials |
| Controls (Liquid Glass) | Regular or thick glass | Dock nav, glass nav after scroll, toolbar groups, floating sidebar, tab bar, segmented controls, sticky CTA |
| Overlays | Thick glass or solid surface + scrim | Menus, popovers, sheets, toasts (glass); dialogs (solid r 28) |

**Liquid Glass variants**

| Variant | Recipe | Use |
|---|---|---|
| Regular (`<Glass>`, `.lg-glass`) | white 72 %, blur 24 (18 on phones), saturate 180 %, 1 px top rim, 1 px edge, soft shadow | Bars, nav, segmented controls, toolbar groups, tab bar |
| Thick (`variant="thick"`) | white 86 % | Text-heavy glass: menus, sheets, sidebar, phone nav sheet, toasts |
| Clear (`variant="clear"`, `dim`) | white 16 %, plus black 35 % when the media is bright | Only controls floating over photos and video |
| Material (`.lg-material`) | white 70 %, blur 30, no rim | Translucent content surface over haze or imagery (Apple "standard material") |

**Rules**

- Glass is never used for content: no glass cards, grids, pricing, testimonials, tables, forms or section backgrounds.
- Never glass on glass. A menu opened from a glass toolbar is its own layer, not nested inside it.
- Use glass sparingly: the number of glass elements visible at once should stay small (nav + one control group is typical).
- Tint glass only for the one prominent action. Over colorful content keep bars monochrome.
- Do not animate `backdrop-filter`. Fallbacks are built in: no backdrop-filter support or `prefers-reduced-transparency` → near-opaque; `prefers-contrast: more` → opaque with an outline.
- Scroll edge effect instead of solid bars: bars are clear at rest and gain glass plus a hairline once content scrolls beneath them (4 px).

**Shadows:** `shadow-elev-1` (product cards), `shadow-elev-2` (floating marketing visuals, stack cards), `shadow-elev-3` (dialogs), `shadow-elev-device` (phones and windows). Never a shadow on every card.

**Layers (z):** raised 10, sticky 20, nav 40, overlay 50, modal 60, popover 70, toast 80, tooltip 90. Use `z-nav`, `z-modal` … never numbers.

---

## 6. Shapes

- Marketing: chip 8, control 12, card 24 (20 on phones), panel 28 (20 on phones), pill.
- Product: ui-control 10 (inputs, menu items, sidebar items), ui-card 16 (cards, table frames), ui-panel 20 (floating sidebar, sheets), ui-window 28 (dialogs), pill.
- Concentric rule: inner radius = outer radius minus the padding between them. A 20 px panel with 10 px padding holds 10 px items.
- Buttons, segmented controls, tab bars, badges, toasts, chips: capsules (`rounded-pill`). HIG: hardware curvature informs controls.
- Icons: Heroicons v2 outline only, 16 / 20 / 24 px, stroke 1.35 (1.5 at 16 px), color `ink` or `ink-2`. Never emoji, never "AI sparkle" icons, never icons inside colored blobs. Toolbar icons have no circle around them. Every icon-only control has an `aria-label`.

---

## 7. Components

Import everything from `@/components/lg`. Exact sizes and behavior: `docs/COMPONENTS.md`.

**Page structure:** `Section`, `Container`, `SectionHeader`, `PageHero`, `DockNav` (landing), `GlassNav` (subpages), `StickyCTA` (phones, subpages), `SmoothScroll`, `SmartLink`, `LinkAdapterProvider`, `ScrollManager`.

**Marketing content:** `CardRail` + `RailCard` + `RailControls` (the horizontal list; one per landing page, always), `Tile`, `TileMedia`, `MediaCard`, `FeatureItem`, `Stat`, `CountUp`, `ArrowLink`, `TrustItem`, `InlineSignup`, `Marquee`, `FaqList`, `AccordionShowcase`, `PricingTier`, `PlanBanner`, `ComparisonTable`, `CtaSection`, `PhotoCollage`, `ActionRow`, `ChipList`, `Field`, `TextInput`, `TextArea`, `VideoPanel`, `Aurora`, `Haze`.

**Devices:** `DeviceStage` (the only way to place devices), `PhoneFrame`, `WindowFrame`, `FloatingDevice` (hero only).

**Product:** `AppShell`, `Toolbar`, `ToolbarGroup`, `ToolbarButton`, `AppContent`, `UISectionHeader`, `UICard`, `UICardHeader`, `Metric`, `Badge`, `DataTable`, `Pagination`, `LineChart`, `BarChart`, `BarList`, `Sparkline`, `Legend`, `DescriptionList`, `Avatar`, `Meter`, `Skeleton`, `EmptyState`.

**Controls and overlays:** `Button` (variants primary, accent, secondary, ghost, glass, destructive, link; sizes sm, md, lg, icon for marketing; xs, ui, icon-ui for product), `SegmentedControl` / `Tabs`, `Switch`, `Checkbox` (box or radio), `UIInput`, `SearchField`, `Select`, `Menu`, `Tooltip`, `Dialog`, `Sheet`, `ToastProvider` + `useToast`, `Glass`.

**Scroll showpieces:** `ScrollStory`, `ScrollScale`, `MediaExpand`, `ZoomThrough`, `StackCards`, `PinnedGallery`, `TextReveal`, `ParallaxColumns`, `ScrollProgress`, `Reveal`, `RevealText`.

**Button rules:** one prominent button (`primary` on marketing, `accent` in products) per view, two at most. Style, not size, marks the preferred option; buttons in one row share a size. The prominent action sits on the trailing side. Destructive actions never get the prominent or default role. Labels start with a verb.

---

## 8. Motion and scroll

| Token | Value |
|---|---|
| `ease-lg-out` | cubic-bezier(.22, 1, .36, 1) for reveals and layout |
| `ease-lg-spring` | damped spring via `linear()` for press, toggles, arrows |
| Durations | press 120 · fast 200 · base 320 · slow 600 · reveal 900 ms |
| Reveal | 28 px rise, 80 ms stagger (max 8), once |
| Hero entrance | `.lg-hero-in`, 1000 ms, 16 px rise, transform only, 110 ms cascade via `--lg-hero-i` |

**Scroll showpieces (marketing pages)**

| Component | What happens | Pinned | Track |
|---|---|---|---|
| `MediaExpand` | Inset rounded media grows to full bleed, title fades up, caption pill appears | yes | 220 svh |
| `ZoomThrough` | Giant word scales up 14x and fades while media behind comes into focus (dark) | yes | 200 svh |
| `StackCards` | 3 to 5 full-width cards stick under the nav and stack; covered cards scale down and dim | yes | auto |
| `PinnedGallery` | Vertical scroll moves a horizontal track of 3 to 6 panels | yes | 100 + 55 svh per panel |
| `ScrollStory` | Steps scroll on the left, a sticky device crossfades on the right (one pinned panel on phones) | yes | auto |
| `TextReveal` | A statement lights up word by word | no | |
| `ParallaxColumns` | 3-column gallery wall drifting at different speeds | no | |
| `ScrollScale` | Media straightens and grows as it enters | no | |
| `ScrollProgress` | 2 px accent line for long reads | no | |

**Budget:** max 3 pinned showpieces per page, never the first section, never two pinned sections back to back (put at least one normal section between them). Light effects (`TextReveal`, `ParallaxColumns`, `ScrollScale`, `Reveal`) are unlimited but each section uses one at most. Product pages use no scroll showpieces.

**Rules:** motion explains or rewards, never decorates (HIG). Animate only `transform` and `opacity`; never width, height, top, left, blur radius or backdrop-filter. Frequent interactions get no extra motion beyond the press state. Everything is interruptible. Smooth scroll (lenis) runs only on desktop with a fine pointer. With `prefers-reduced-motion`, every showpiece renders a complete static layout, reveals become 200 ms fades, marquees stop. Libraries: `motion` (`motion/react`) and `lenis` only.

---

## 9. Page recipes

**Landing page** (order is a guide, the CardRail is required):

1. `DockNav` (first child of the page wrapper) + hero (`.lg-hero`): two-line `text-hero` H1 left, lead + 2 CTAs + reassurance line bottom-left, `FloatingDevice` with an HTML product screen, `Aurora`.
2. Proof: caption + `Marquee` of customer or tool names (`spacing="sm"`).
3. Statement: `TextReveal` in a `text` container.
4. **CardRail** (required): `SectionHeader` with `RailControls`, 6 to 9 `RailCard`s with product UI rebuilt in HTML.
5. Showpiece 1: `MediaExpand` or `ScrollStory`.
6. Features: `FeatureItem` grid (3 columns, 6 items).
7. Showpiece 2: `StackCards` (subtle section).
8. Gallery or detail: `ParallaxColumns` or `AccordionShowcase`.
9. Showpiece 3 (optional, dark): `ZoomThrough` or a dark inset `Section` with stats.
10. Numbers: `Stat`s with `CountUp`.
11. How it works: 3 numbered steps (1 px ink rule on top).
12. Pricing: `PricingTier`s (one featured, dark) when relevant.
13. FAQ (subtle, 4/8 split).
14. Final CTA (centered two-tone h2, `lg` spacing) + footer.

**Subpage:** `GlassNav` → `PageHero` → content sections → `CtaSection` (dark inset closing panel) → footer.

**Dashboard:** `AppShell` → `Toolbar` (title, range `Tabs`, one `ToolbarGroup` of icons, one accent `Button size="ui"`) → `AppContent` → KPI row of 4 `Metric`s → chart card (2/3) + breakdown card (1/3) → `UISectionHeader` with `SearchField` → `UICard padded={false}` with filters + `DataTable` → secondary cards. Details open in a `Sheet`; confirmations in a `Dialog`; feedback as a toast.

**Settings page:** `AppShell` → `Toolbar` → `AppContent width="text"` → `UICard`s grouped by topic, each a list of `Switch` rows (label leading, switch trailing) or form rows; one accent "Save" only when changes are not applied immediately.

---

## 10. Content and copy

- Numbers over adjectives. No exclamation marks. Real quotes only, verbatim. No placeholder logos or invented testimonials.
- Buttons: a verb and an object ("Create report", "Save changes"). Title Case in product UI, sentence case on marketing pages.
- Error messages say what happened and what to do. Empty states: one title, one sentence, one action.
- Never put a photo next to a real person's name unless it is their approved photo; use initials (`Avatar`).
- Dates in product UI: "Nov 12, 2026" or relative ("2m", "Yesterday"); never ambiguous formats like 11/12.

---

## 11. Accessibility

- WCAG 2.2 AA: body text 4.5:1, large text and UI parts 3:1. Check light AND dark.
- Targets: 44 x 44 px on touch (`.lg-hit` expands small controls), 28 px minimum visual size for product controls on pointer devices. Space bezelled controls about 12 px apart, borderless ones about 24 px.
- Focus ring on everything: 2 px `accent-strong`, 2 to 3 px offset. Never remove outlines without a replacement.
- Zoom stays enabled (no `maximum-scale`, no `user-scalable=no`). Support 200 % text zoom without loss of content.
- Charts carry a one-sentence `summary` (their accessible name) and never rely on color alone.
- Dialogs trap attention (`aria-modal`), close on Escape, return focus. Toasts never hold critical information and can be dismissed.
- Respect `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast` (all built in).

---

## 12. Do's and Don'ts

**Do**

- Use `@/components/lg` primitives and token classes for everything.
- Keep chrome monochrome and let one accent mark the one prominent action.
- Use glass only for navigation and controls, solid surfaces for content.
- Use the product scale in apps and the marketing scale on websites.
- Include one CardRail on every landing page.
- Use two-tone, left-aligned section headers.
- Place every phone or window inside `DeviceStage` or the hero's `FloatingDevice`.
- Build product imagery in HTML from system components, not screenshot crops.
- Run `npm run audit` and check 390 px and 1440 px in light and dark before finishing.

**Don't**

- Glass cards, glass grids, glass on glass, glass behind body text.
- Gradient text, gradient buttons, colored eyebrows, pill badges above the hero headline.
- Bold (700+) headings, ALL CAPS headers, more than one accent color in chrome.
- Default Tailwind sizes (`text-sm`, `rounded-lg`), palette colors (`bg-blue-500`), arbitrary values (`text-[15px]`), hex in code.
- Emoji or sparkle icons, icons in colored blobs, any icon set other than Heroicons.
- `100vh`, `h-screen`, animating width/height/top/blur, GSAP, AOS, framer-motion imports in system code.
- Marketing type (`text-h2`, `text-lead` …) inside product pages, or `text-ui-*` on marketing sections.
- More than 3 pinned scroll sections, a pinned section as the first section, two pinned sections in a row.
- Shipping SF font files or loading Google Fonts.
- Fake logos, placeholder quotes, invented photos of real people.
