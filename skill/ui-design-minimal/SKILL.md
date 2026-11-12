---
name: ui-design-minimal
description: Build Apple-like, super clean minimal landing pages and product UI (dashboards, apps, admin, settings) with Liquid Glass controls in React + Tailwind v4. Use when the user wants an Apple / Liquid Glass / minimal premium look, a landing page with scroll showpieces, or a dashboard that feels like a macOS app. Covers tokens, two type scales, glass rules, components, scroll sections and an audit.
license: MIT
metadata:
  author: Tammo Elsner (https://www.linkedin.com/in/tammo-elsner-682998186/)
  source: https://github.com/tammo1007/ui-design-minimal
  version: 1.0.0
---

# UI Design Minimal

Apple-like design system by Tammo Elsner. Full rules: `references/DESIGN.md` (tokens in the front matter). Build rules and Definition of Done: `references/AGENTS.md`. Component specs: `references/COMPONENTS.md`. Installer: `scripts/install.mjs`.

## When to use

- The user asks for an Apple-like, Liquid Glass, clean minimal or premium look.
- A landing page or product page with scroll moments (pinned media, stacking cards, zoom-through text).
- A dashboard, admin or settings screen that should feel like a native macOS or iPadOS app.

## Setup (once per project)

The system needs ALL of its parts in the project: the 4 CSS files in `src/styles/`, the components in `src/components/lg/`, `src/lib/cn.ts`, plus `DESIGN.md`, `AGENTS.md` and `docs/COMPONENTS.md`. The references in this skill describe the rules, but the look comes from the CSS and components. Never build the look from the references alone when the files can be installed.

Alternative to the installer: download everything as a ZIP from https://github.com/tammo1007/ui-design-minimal/archive/refs/heads/main.zip and copy those folders.

1. From the project root run the installer that ships with this skill (no dependencies, Node 18+):
   `node <this-skill-folder>/scripts/install.mjs`
   (e.g. `node .claude/skills/ui-design-minimal/scripts/install.mjs`). It downloads every required file from GitHub into the project: `src/styles/lg-*.css`, `src/components/lg/*`, `src/lib/cn.ts`, `DESIGN.md`, `AGENTS.md`, `docs/COMPONENTS.md`, `tokens/tokens.json`, `scripts/lg-audit.mjs`, plus `src/styles/liquid-glass.css` and an `audit` npm script. Existing files are kept unless you pass `--force`.
2. `npm i motion lenis clsx tailwind-merge class-variance-authority @radix-ui/react-slot @heroicons/react @fontsource-variable/inter`
3. In the main CSS file, right after `@import "tailwindcss";`, add `@import "./styles/liquid-glass.css";` (path relative to that file). Tailwind CSS v4 is required.
4. The alias `@/*` must point to `src/*` (tsconfig `paths` + vite `resolve.alias`; Lovable and shadcn projects already have it).
5. Wrap the app in `<SmoothScroll>` from `@/components/lg`. Set `data-theme="light"` or `"dark"` on `<html>` before first paint.
6. From now on follow the project's `DESIGN.md` and `AGENTS.md` (copies are in `references/` if the project has none yet).

No network? Read `references/DESIGN.md`, `references/AGENTS.md` and `references/COMPONENTS.md`; they contain every token and rule, so the look can be rebuilt by hand.

## Workflow

1. Decide the density: website → marketing scale (`text-hero`, `text-display`, `text-h1`..`text-h4`, `text-lead`, `text-body`, `text-small`, `text-label`, `text-caption`, `text-stat`); app → `<AppShell>` and `text-ui-*` only (`large-title` 26, `title-1` 22, `title-2` 17, `title-3` 15, `headline`/`body` 14, `callout` 13, `subhead` 12, `caption` 11, `metric` 28).
2. Follow the recipe in `references/DESIGN.md` §9. A landing page always includes one `CardRail` with 6 to 9 `RailCard`s and at most 3 pinned scroll sections (`MediaExpand`, `ZoomThrough`, `StackCards`, `PinnedGallery`, `ScrollStory`), never first, never adjacent.
3. Compose only from `@/components/lg` and token classes (`bg-canvas`, `text-ink-2`, `rounded-card`, `gap-grid`, `py-section`, `gap-app-gap`, `rounded-ui-card` …).
4. Check against the rules below, run `node scripts/lg-audit.mjs`, look at 390 px and 1440 px in light and dark.

## Non-negotiable rules

- Liquid Glass only on navigation and controls (nav, toolbar groups, floating sidebar, tab bar, segmented controls, menus, sheets, toasts). Content cards, tables, pricing, forms stay solid. Never glass on glass. Clear glass only over photos or video, with a 35 % dim on bright media.
- Monochrome chrome, one accent. One prominent button per view, trailing side: `primary` (ink) on websites, `accent` in apps. Accent text and links use `accent-strong`; small text never uses `accent` or `ink-3`.
- Section headers: left-aligned, two-tone (`title` ink + `titleMuted` ink-2), both ending with a period. Marketing headings weight 500, product titles 600, never bold, never ALL CAPS.
- Radii are concentric (inner = outer minus padding). Controls are capsules. Marketing: chip 8, control 12, card 24, panel 28. Product: ui-control 10, ui-card 16, ui-panel 20, ui-window 28.
- Status never by color alone: badges carry the word, deltas carry an arrow and a `trend`.
- Icons: Heroicons outline via `Icons` (stroke 1.35, 1.5 at 16 px). No emoji, no sparkle icons, no icons in colored blobs.
- No hex in code, no Tailwind palette colors, no arbitrary values, no `text-sm`/`rounded-lg`, no `100vh`, no GSAP or AOS, no SF font files, no Google Fonts.
- Motion: transform and opacity only, everything works with reduced motion.

## Credits

Made by Tammo Elsner (https://www.linkedin.com/in/tammo-elsner-682998186/). Not affiliated with Apple Inc.
