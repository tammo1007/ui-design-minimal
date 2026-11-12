# Component specs

Exact values for every primitive in `src/components/lg`. Sizes are given at 390 px (phone) and 1440 px (desktop) where they differ. Rules for when to use what live in `DESIGN.md`. Part of UI Design Minimal by [Tammo Elsner](https://www.linkedin.com/in/tammo-elsner-682998186/).

## Page structure

| Component | Spec |
|---|---|
| **Section** | `<Section tone="light\|subtle\|dark" spacing="sm\|md\|lg\|none" inset offsetNav>`. Owns background and vertical padding. Light sections inherit the page theme; `tone="dark"` forces dark tokens. `inset` (dark/subtle only): rounded panel r 28 / 20, 8 to 20 px from the viewport edge, scales 0.95 → 1 on enter. Warns `[LG]` in the console when dark-section rules break. |
| **Container** | `size="text"` 720 · `content` 1280 (default) · `wide` 1440 · `full`. Gutter 20 → 40 px built in. The only way to constrain width. |
| **SectionHeader** | Left-aligned two-tone heading (`title` ink + `titleMuted` ink-2, ONE h2), optional `eyebrow` (14/500 ink-2) above, `lead` below (max 38rem), `actions` bottom-right (stack under on phones). `size` display/h1/h2 (default)/h3, `as` h1/h2/h3, `align="center"` only for heroes and the final CTA, `flush` removes the 40 / 64 px bottom margin. Staggered reveal built in. |
| **PageHero** | Subpage hero under the GlassNav: two-tone h1 `text-display` (max 20ch), lead, CTAs (stack below 640), `meta` proof line (`CheckRow`), optional `aside` (from 1024, 5/12: one glass info card or image). Soft aurora. Entrance `lg-hero-in`. |
| **DockNav** (landing) | First child of the page wrapper. Desktop hero state: glass pill 384 × 56 bottom-center 24 px above the viewport edge (menu button left, logo right). Pure CSS sticky: rides up with the page, docks at the top and morphs into the 64 px bar (max-width 760 ms, radius/height 520 ms, content crossfade 260 / 200 ms). Below 1024: a 56 px bar at the top from the first pixel, clear until 4 px of scroll. Props: `logo`, `mark`, `items` (4 to 6), `cta`, `ctaShort`, `secondary`. |
| **GlassNav** (subpages) | 64 / 56 px, content width. Clear at the top, glass after 4 px (white 72 %, blur 24, saturate 180 %, bottom hairline). Links 15/400, hover opacity 60 %. Right: secondary text link + primary `sm` button. Phones: 40 px menu button → thick-glass sheet, 22 px links, full-width `lg` buttons. Switches to dark glass over dark sections. |
| **StickyCTA** | Phones and tablets only (subpages, never with DockNav). Glass pill at the bottom (safe-area aware), note up to 20 characters + `sm` button. Hides while `[data-lg-hide-sticky]` (final CTA, footer) is visible. |
| **SmartLink** | Every link. External → `<a>` (`target="_blank"` adds `rel="noopener noreferrer"`); `#id` on the same page → smooth scroll with nav offset; paths → your router via `<LinkAdapterProvider component={…}>`, else a plain `<a>`. |
| **SmoothScroll** | Lenis, desktop with a fine pointer only, off for reduced motion. Mount once at the root. |

## Marketing content

| Component | Spec |
|---|---|
| **CardRail / RailCard / RailControls** | THE horizontal list, required once on every landing page. Full-bleed rail outside `Container`, starts on the content edge, ends with the same inset. Cards `clamp(280px, 14rem + 9vw, 368px)` wide, 4 : 5, r 24, `gap-grid`, scroll-snap. Card: text on top (28 px padding, `text-h4` title, `text-small` ink-2 body up to 30ch and 3 lines), visual slot fills the rest with 24 px margins. Visuals are built at a 296 px design width and scaled down (never up, 0.65 to 1) until they fit: nothing cropped, nothing sticking out. Visuals are product UI rebuilt in HTML from system components, never screenshot crops. Tones sky, mist, sand, slate, ink, clay. Mouse drag with momentum, touch swipe, arrow keys, `RailControls` (40 px discs) in the SectionHeader `actions`. 6 to 9 cards. Visuals lift 6 px on hover. |
| **Tile / TileMedia** | Content card. r 24 / 20, padding 40 / 24. `filled` = surface-2 on white (white on subtle), `outline` = white + 1 px hairline. Title `text-h3`, body `text-lead` ink-2, visual below with `TileMedia` (32 px gap, concentric radius) or `TileMedia bleed` to the edges. Never glass. |
| **MediaCard** | Visual fills the card, bottom scrim black 70 → 0 %, label 14 white/70, title `text-h3` white, `ArrowLink tone="onMedia"`. |
| **FeatureItem** | 1 px hairline top, 24 px top padding, 24 px Heroicon, `text-h4` title, `text-body` ink-2. 3 columns, 48 px row gap. |
| **Stat / CountUp** | Hairline top, 20 px padding, `text-stat` numeral counting up once at 40 % visibility, `text-small` ink-2 label. |
| **ArrowLink** | 40 px disc (ink 6 %) + label 17/500. Hover: disc fills ink, arrow turns white and nudges 2 px. Tertiary action. |
| **Steps** (pattern) | 1 px ink rule on top, 24 px padding, `01` label ink-3, `text-h3`, `text-body` ink-2. |
| **InlineSignup** | From 640: one pill (6 px padding, surface, hairline-strong + shadow) containing a 48 px field and an `lg` button. Phones: stacked field + full-width button. |
| **TrustItem** | 48 px ink disc with a 20 px icon in canvas color, title 15/500, detail 15 ink-2. |
| **Marquee** | 40 to 50 s loop, 10 % edge fade, pauses on hover/focus; reduced motion: static, wrapping rows. Logos monochrome at the same optical height (20 to 24 px), ink-3, ink on hover. |
| **FaqList** | Rows separated by hairlines, question `text-h4` (24 px vertical padding), 36 px plus disc rotating 45°, answer body ink-2 up to 60ch. One open at a time. Use in a 4/8 split. |
| **AccordionShowcase** | 12 columns: list 5 (border-top rows, active `text-h4` ink, inactive ink-2, body up to 60ch, up to 4 checks) + stage 7 (sticky at nav + 32, crossfade 600 ms). Optional auto-advance (8 s, only in view, pauses on hover, stops after the first click, off with reduced motion). |
| **PricingTier / PlanBanner / ComparisonTable** | Card r 24, gap 32: name h4 + caption, price `text-h1` tabular + note, full-width CTA, checklist small ink-2 with a hairline on top. One `featured` (dark) card per row. 4 per row from lg, 2 from sm. ComparisonTable from 768: first column 34 %, groups with label rows, check / minus / text values; below 768 a SegmentedControl picks one plan. Never a horizontally scrolling table. |
| **CtaSection** | Closing dark inset panel of subpages: `Haze`, r 28 / 20, two-tone h2 `text-display` left (7/12), lead + CTAs right (5/12), stacked on phones. Counts as the page's dark section. |
| **Field / TextInput / TextArea** | Marketing forms. Label 14/500, control 48 px, r 12, inset hairline-strong ring, hover ink 28 %, focus 1.5 px accent-strong ring + 4 px accent halo, invalid danger ring, 17 px text, hint or error below (`aria-describedby`). TextArea min 136 px. |
| **ActionRow / ChipList / PhotoCollage** | ActionRow: full-width link row min 80 px, 48 px icon disc, title + detail, arrow nudges. ChipList: 36 px pills, hairline-strong ring. PhotoCollage: one 16 : 10 photo over two 4 : 3, gap 12, r 24. |
| **VideoPanel** | Film in an inset panel r 28 / 20, always the full original 16 : 9 frame (never cropped). Centered glass play pill (52 px ink disc + label), 44 px glass sound toggle bottom-right, 3 px progress line. Pauses when it leaves the viewport. |
| **Aurora / Haze** | Aurora: soft accent + lilac + peach light behind the landing hero (drifts 28 s). Haze: atmospheric light inside dark sections (drifts 30 s). Never behind text blocks. |

## Devices

| Component | Spec |
|---|---|
| **DeviceStage** | The one way to place devices. `fit="contain"` (centered, equal inset `--lg-stage-pad` 32 → 56 px) or `fit="bleed"` (top inset, cropped by the bottom edge, 60 to 85 % of the device visible). Presets `size="story"` (592 → min(672, 100svh − nav − 48)), `card` (400 → 416), `panel` (400 → 512), `hero` (496 → 1.85 : 1, max 704), `auto`. Backdrops none, subtle, cool, lilac, warm, mint (max 4 per page). Devices in one row are identical in size. Never add margin to the stage or the device. |
| **PhoneFrame** | 280 × 588 native (screen 264 × 572, iPhone aspect), r 48, 8 px bezel, island. `src` + `screen` paints a clean 9:41 status bar; `statusBar` does the same for HTML screens. `glare` adds a reflection. Only inside DeviceStage or FloatingDevice. |
| **WindowFrame** | r 14, 40 px toolbar (traffic lights + URL pill), device shadow. Only inside DeviceStage. |
| **FloatingDevice** | Hero only. 3D pose x 8° · y −16° · z 12°, bob 10 px / 6.8 s, sway up to 1.8° / 11 s, pointer tilt ±3° (fine pointer), scroll straightens and lifts 70 px. Scale 0.92 → 1.3 by breakpoint. |

## Product

| Component | Spec |
|---|---|
| **AppShell** | `lg-root lg-app`, `data-density="product"`, background canvas-subtle (canvas in dark). Floating sidebar: thick glass, 248 px (64 collapsed), 8 px inset from top, left and bottom, r 20. Brand row 52 px. Items 36 px, r 10, 14/500, 20 px icon ink-2 (current: ink 8 % fill, icon accent-strong), trailing count 12 ink-2. Section titles 12/500 ink-2 sentence case. Footer row for the account. Below 1024: sidebar becomes a sheet (slides in, scrim, Escape closes). Below 768: floating glass tab bar (up to 5 `tab` items, 64 px min width, 24 px icons, 10/500 labels, current = accent-strong on ink 8 %). |
| **Toolbar** | Sticky, min 52 px, padding 8 px / app-pad. Leading: sidebar toggle (collapse on desktop, open on mobile) + `text-ui-title-2` title + optional subtitle 12 ink-2. Center: one control (date range Tabs), hidden below 768. Trailing: max 3 groups, then the one accent `Button size="ui"`. Clear at rest; after 4 px of scroll: blur 20, saturate 180 %, canvas-subtle 92 → 60 %, bottom hairline (scroll edge effect). |
| **ToolbarGroup / ToolbarButton** | Regular glass capsule, 3 px padding, 2 px gap. Buttons 32 px min, pill, 18 px icons, hover ink 6 %, pressed ink 10 %. One group = icons OR text labels, never mixed. Icon buttons need `aria-label` (+ `Tooltip`). |
| **AppContent** | `<main>`: max 1440 (`width="wide"`) or 720 (`text`), padding app-pad (24 / 16), 8 px top, 96 px bottom on phones (tab bar), 40 on desktop. |
| **UISectionHeader** | `text-ui-title-3` + optional `text-ui-callout` ink-2 description, trailing action, 12 px bottom margin. |
| **UICard / UICardHeader** | surface, r 16, hairline + elev-1 (dark: hairline only), padding 20 / 16 (`padded={false}` for tables). Header: `text-ui-title-3` + callout ink-2 caption, trailing control, 16 px below. |
| **Metric** | UICard: label 13 ink-2, value `text-ui-metric` (or `metric-lg` for one hero KPI) tabular, delta `Badge` with arrow (tone from `trend`: up-good/down-good = success, up-bad/down-bad = danger), hint 12 ink-3, optional `Sparkline` (hidden on phones). KPI rows: 2 columns on phones, 4 from xl. |
| **Badge** | 20 px, pill, 11/500, 8 px padding, 6 px dot. Tones: neutral (ink 6 % / ink-2), success, warning, danger, info (status 12 to 14 % fill, status-text label). Always contains the status word. |
| **DataTable** | Inside `UICard padded={false}`. Header 36 px, 12/500 ink-2, Title Case, hairline below. Rows 44 px (compact 36 with 13 px text, comfy 52), hairline separators, hover ink 2.5 %, selected accent 8 %. First and last cells use card padding. Numbers `align="end"`, tabular. Sortable headers: click sorts (numbers start descending), click again reverses, `aria-sort`. `hideBelow` drops low-priority columns on small screens; the table scrolls inside its card only as a last resort. `pageSize` adds `Pagination` (range text + 32 px chevron buttons). |
| **LineChart** | SVG, viewBox 640 wide, 5 horizontal grid lines at round values (hairline), y labels 11 px ink-3 on the trailing side, x labels thinned to about 6. Series 1 accent 2 px + 10 % area, series 2 to 4 at 1.5 px dashed in chart-2..4, end dot 3.5 px with a surface ring. `summary` = accessible name (the chart's main message in one sentence). Legend when more than one series. |
| **BarChart** | Bars at 64 % of the slot, rounded top r 4, baseline zero, 3 grid lines. `highlight` one bar in accent, others ink 12 %. Each bar has a title with its value. |
| **BarList** | Label + value row over a 6 px meter (accent). Readable without color. |
| **Sparkline** | 1.5 px accent line + 10 % area, no axes, decorative (the value sits next to it in text). |
| **Avatar** | 24 / 32 / 40 px circle; initials on surface-3 (ink-2) unless an approved photo exists. |
| **DescriptionList** | Label 13 ink-2 left, value 14 right (tabular), hairline dividers, 10 px vertical padding. |
| **EmptyState / Skeleton / Meter** | Empty: 44 px icon disc (ink 5 %), title-3, one callout sentence (36ch), one action, centered, 48 px vertical padding. Skeleton: shimmer 1.6 s (static with reduced motion). Meter: 6 px track ink 8 %, accent fill. |

## Controls and overlays

| Component | Spec |
|---|---|
| **Button** | Capsule, 500 weight, press scale 0.97 (spring), focus 2 px accent-strong ring with 2 px offset, disabled 40 %. Marketing sizes `sm` 36/14/16 px, `md` 44/15/20, `lg` 48/16/24, `icon` 44. Product sizes `xs` 28/13/12, `ui` 32/13/14, `icon-ui` 32. `.lg-hit` grows touch targets to 44. Variants: `primary` ink/canvas (hover 80 %), `accent` accent-fill/white, `secondary` inset 1 px hairline-strong (hover ink 4 %), `ghost`, `glass` (over media only), `destructive` danger-text fill, `link`. Icons 16 to 18 px. |
| **SegmentedControl / Tabs** | Glass capsule, 4 px padding, segments 36 px (`size="sm"` 32), 15 px (13 in product), a solid chip glides to the selected option (spring). Arrow-key navigation. 2 to 5 options. |
| **Switch** | Track 44 × 26, pill, off ink 14 %, on `success`. Knob 22 px white with a soft shadow; while pressed it stretches to 28 px and turns to glass (HIG). Label leading, switch trailing, optional description 13 ink-2. For settings that apply immediately. |
| **Checkbox** | 18 px, r 5 (radio: circle), 1.5 px hairline-strong ring, checked = accent-fill with a white check. Label 14 px, 10 px gap. |
| **UIInput / SearchField / Select** | 32 px (44 on touch, 16 px text), r 10, fill ink 5 % (hover 7 %), focus: surface + 1 px accent-strong ring + 3 px accent 20 % halo. Leading 16 px icon ink-2. SearchField: magnifier, clear button (20 px disc) when filled, optional shortcut hint. Select keeps the native picker with a trailing chevron. |
| **Menu** | Trigger morphs into a thick-glass list (spring, scale 0.92 → 1 from the trigger corner). r 16, 6 px padding, min 208 px. Items 32 px, r 10, 18 px icon ink-2; hover/focus accent-fill with white text. Destructive item last, after a separator, danger-text (danger fill on hover). Escape and outside click close. |
| **Tooltip** | Pointer devices only, after 500 ms. Solid ink capsule, 12/500 canvas text, r 8. For icon-only controls (which still need `aria-label`). |
| **Dialog** | Centered, solid surface, r 28, 24 px padding, max 448 px, shadow elev-3, scrim. Title `text-ui-title-2`, description body ink-2. Actions bottom-right (stacked full width on phones): cancel secondary, confirm accent (or destructive). Escape closes. |
| **Sheet** | Inspector/detail panel from the trailing edge, thick glass, inset 8 px, r 20, width 384 (inspector + 64). Header 52 px with title-2 and a close button; scrolling body; optional footer with actions. |
| **Toasts** | `ToastProvider` + `useToast()({ title, body?, tone })`. Thick-glass capsules bottom-center (above the tab bar on phones), max 3 stacked, 5 s, always dismissible, tone icon (Heroicons) in status-text color. Never critical information. |
| **Glass** | `<Glass as variant="regular\|thick\|clear" dim tone="auto\|dark" shape="pill\|control\|card" interactive>`. Logs `[LG]` when nested inside glass. `interactive` adds a pointer-following highlight (desktop). |

## Scroll showpieces

| Component | Spec |
|---|---|
| **MediaExpand** | Track 220 svh, sticky 100 svh stage. Media panel starts at scale 0.56, 22 svh lower, r 44, and grows to full bleed (r 0) by 70 % progress; the media inside counter-scales 1.18 → 1. Eyebrow + `text-display` title centered at 13 svh, fading out by 22 %. Optional caption: clear dimmed glass pill fading in at 72 to 85 %. Reduced motion: title + 16 : 9 media in a container. |
| **ZoomThrough** | Dark, track 200 svh. Word (`.lg-zoom-text`, 64 → 256 px, 600, −6 % tracking) scales 1 → 14 by 60 % and fades 35 to 58 %. Media fades in 20 to 60 % and settles 1.25 → 1 with a bottom gradient. `after` content rises in at 70 to 85 %. |
| **StackCards** | Cards stick at nav + 24 px + 12 px per index, 12 svh apart. As later cards arrive, earlier ones scale down 4 % per remaining card and dim up to 35 % (black overlay). Card r 28, shadow elev-2. 3 to 5 cards, each min 70 svh on phones, 30rem on desktop. |
| **PinnedGallery** | Track 100 + 55 svh per panel. Header in a container, panels `min(78vw, 36rem)` wide in a row that translates with a spring (stiffness 220, damping 40). Reduced motion: 2-column grid. |
| **ScrollStory** | Desktop: 5/7 split, steps scroll, sticky DeviceStage (story preset) crossfades in place (device glides 14 px), inactive steps 30 %. Phones: one pinned panel with progress bars, the device, and a material caption. |
| **TextReveal** | `text-h2` (override with a class) statement, each word fades 18 % → 100 % between 85 % and 45 % of the viewport. Max 40 words. |
| **ParallaxColumns** | 3 columns from 768 (1 below), offsets ±40 / 50 / 70 % of `strength` (default 160 px) across the section's pass. 6 to 12 tiles. |
| **ScrollScale** | Media scales 0.9 → 1, tilt 10° → 0, rises 48 px as it enters. |
| **Reveal / RevealText** | 28 px rise, 900 ms, out easing, 80 ms stagger, once. Reduced motion: 200 ms fade. |
