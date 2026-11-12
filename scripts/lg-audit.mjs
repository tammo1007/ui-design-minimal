#!/usr/bin/env node
/**
 * lg-audit: static check for the Liquid Glass Design System (by Tammo Elsner, MIT).
 * Usage:  node scripts/lg-audit.mjs [srcDir] [--legacy]      (exit 1 on errors)
 * Checked: every file that imports "@/components/lg" or lives in src/pages, src/app, src/routes, src/demo.
 * Exempt: src/components/lg, src/components/ui, src/styles, src/lib (the only places raw values may live).
 * Silence one line with a trailing  // lg-audit-ignore: reason . Whole illustration files: lg-audit-ignore-file.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const srcDir = join(root, process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "src");
const EXEMPT = ["components/lg/", "components/ui/", "styles/", "lib/", "integrations/", "vite-env.d.ts"].map((p) => p.split("/").join(sep));

const PALETTE = "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const rules = [
  { id: "raw-color-class", level: "error", re: /\b(?:bg|text|border|ring|fill|stroke|from|via|to|shadow|outline|decoration|divide|placeholder)-\[(?:#|rgb|hsl|oklch)/g, msg: "Arbitrary color in className: use a token class (bg-canvas, text-ink-2, bg-accent …)." },
  { id: "palette-color", level: "error", re: new RegExp(`\\b(?:bg|text|border|ring|from|via|to|fill|stroke|divide|outline|decoration|placeholder)-(?:${PALETTE})-\\d{2,3}\\b`, "g"), msg: "Tailwind palette color: use tokens (canvas, surface, ink, ink-2, ink-3, accent, accent-strong, success, warning, danger, chart-1..6)." },
  { id: "hex-literal", level: "error", re: /["'`]#[0-9a-fA-F]{3,8}["'`]/g, msg: "Hex color literal in code: colors live in lg-tokens.css only." },
  { id: "arbitrary-scale", level: "error", re: /\b(?:text|p[trblxyse]?|m[trblxyse]?|gap(?:-[xy])?|space-[xy]|rounded(?:-[trblse]{1,2})?|shadow|leading|tracking|z)-\[[^\]]+\]/g, msg: "Arbitrary value for type/spacing/radius/shadow/z: use the scale (text-h2, text-ui-body, py-section, gap-grid, gap-app-gap, rounded-card, rounded-ui-card, shadow-elev-2, z-popover)." },
  { id: "default-font-size", level: "error", re: /\btext-(?:xs|sm|base|lg|xl|[2-9]xl)\b/g, msg: "Default Tailwind font size: marketing pages use text-hero/display/h1..h4/lead/body/small/label/caption/stat, product pages text-ui-*." },
  { id: "bold-heading", level: "warn", re: /<h[1-4][^>]*className=["'`][^"'`]*\bfont-(?:bold|extrabold|black)\b/g, msg: "Bold heading: marketing headings are 500, product titles 600 (built into the text-* classes). Remove font-bold." },
  { id: "all-caps", level: "warn", re: /className=["'`][^"'`]*\buppercase\b/g, msg: "ALL CAPS label: section headers, eyebrows and table headers are sentence or title case (HIG)." },
  { id: "gradient-text", level: "error", re: /\bbg-clip-text\b|\btext-transparent\b/g, msg: "Gradient text is not part of the system. Use ink and ink-2 (two-tone headings)." },
  { id: "emoji-icon", level: "warn", re: /[\u{1F300}-\u{1FAFF}\u{2728}]/gu, msg: "Emoji in UI: use Heroicons outline through Icons from @/components/lg." },
  { id: "other-icon-lib", level: "error", re: /from\s+["'](?:lucide-react|react-icons[^"']*|@tabler\/icons-react|@phosphor-icons\/react)["']/g, msg: "Other icon library: the system uses Heroicons outline only (Icons from @/components/lg)." },
  { id: "default-radius", level: "warn", re: /\brounded-(?:sm|md|lg|xl|2xl|3xl|full)\b/g, msg: "Generic radius: use rounded-chip/control/card/panel/pill (marketing) or rounded-ui-control/ui-card/ui-panel/ui-window (product)." },
  { id: "inline-style", level: "warn", re: /style=\{\{[^}]*\b(?:color|background|backgroundColor|margin\w*|padding\w*|fontSize|fontWeight|borderRadius|boxShadow|letterSpacing|lineHeight)\s*:/g, msg: "Inline visual style: only CSS custom properties (--lg-*) or computed geometry belong in style={{}}." },
  { id: "raw-container", level: "warn", re: /\b(?:container\s+mx-auto|max-w-(?:screen-\w+|[2-7]xl))\b/g, msg: "Raw width constraint: use <Container size=\"text|content|wide\">." },
  { id: "vh-unit", level: "warn", re: /\b(?:h|min-h|max-h)-screen\b|100vh/g, msg: "100vh breaks on mobile browsers: use svh/dvh (min-h-svh) or the DS layout." },
  { id: "forbidden-lib", level: "error", re: /from\s+["'](?:framer-motion|aos|react-scroll-parallax|locomotive-scroll|@studio-freight\/lenis|react-reveal)["']/g, msg: "Forbidden animation library: use motion/react, lenis and the DS motion primitives." },
  { id: "sf-font", level: "error", re: /SF-Pro[\w-]*\.(?:otf|ttf|woff2?)|fonts\.googleapis\.com/g, msg: "Never embed SF Pro (license) or hotlink Google Fonts (GDPR): fonts come from lg-tokens.css." },
  { id: "dynamic-class", level: "error", re: /`[^`\n]*?(?<![\w-])(?:lg-[\w-]*?|bg|text|border|ring|rounded|shadow|p[trblxy]?|m[trblxy]?|gap|grid-cols|col-span|w|h|size|max-w|min-h|z|opacity|duration|delay)-+\$\{/g, msg: "Class name built from a template: Tailwind only generates classes written out in full. Map variants to complete literal strings ({ card: \"lg-stage--card\" })." },
  { id: "device-hand-placed", level: "warn", re: /<(?:PhoneFrame|WindowFrame)\b[^>]*className=["'`][^"'`]*(?<![\w-])(?:absolute|fixed|scale-|translate-|top-|left-|right-|bottom-|m[trblxy]?-|w-|h-)/g, msg: "Device positioned or sized by hand: place it at native size inside <DeviceStage> (docs §6.1)." },
  { id: "rail-screenshot", level: "warn", re: /className=["'`][^"'`]*lg-rail__shot/g, msg: "Screenshot crop as a rail visual: rebuild the UI piece in HTML (src/pages/landing/appui.tsx pattern); crops leave stray corners and blur." },
  { id: "dead-link", level: "error", re: /href=(?:\{\s*)?["'`]#?["'`]/g, msg: "Dead link (href=\"#\" or empty): every link needs a real destination from src/content/site.ts." },
  { id: "raw-anchor", level: "error", re: /<a\s[^>]*?\bhref=/g, msg: "Raw <a href>: use <SmartLink href={site.…}> (router-aware, adds rel=noopener for new tabs)." },
  { id: "hardcoded-url", level: "warn", re: /\bhref=["'`](?:https?:\/\/|\/(?!#)[\w-])/g, msg: "URL hard-coded in a page: add it to src/content/site.ts (links, cta, nav, footer) and reference it." },
  { id: "tilemedia-margin", level: "warn", re: /<TileMedia\b[^>]*className=["'`][^"'`]*(?<![\w-])m[ty]-/g, msg: "Margin on TileMedia overrides its mt-auto, so visuals in neighbouring cards end at different heights: put pb-8 on the text block instead." },
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === "node_modules" || name.startsWith(".")) continue;
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(tsx|jsx|ts|js)$/.test(name)) out.push(p);
  }
  return out;
}

const findings = [];
const legacy = [];
let checked = 0;
const files = existsSync(srcDir) ? walk(srcDir) : [];
for (const file of files) {
  const rel = relative(srcDir, file);
  if (EXEMPT.some((e) => rel.startsWith(e) || rel === e)) continue;
  const text = readFileSync(file, "utf8");
  if (text.slice(0, 300).includes("lg-audit-ignore-file")) continue; // illustrations/mockups only
  // Only design-system code is checked: files in DS folders, files that import the DS, and the page folders that are on the system.
  // Everything else is a page/component that is not migrated yet: listed as legacy, not checked.
  // ("// lg-legacy" as the first line opts a file out explicitly.)
  const inDsScope =
    /^(?:pages|app|routes|demo|components[\\/]site)[\\/]/.test(rel) ||
    /from\s+["']@\/components\/lg(?:\/[\w-]+)?["']/.test(text);
  if (!inDsScope || /^\s*(?:\/\/|\/\*)\s*lg-legacy\b/.test(text)) {
    legacy.push(relative(root, file));
    continue;
  }
  checked++;
  const lines = text.split("\n");
  for (const rule of rules) {
    lines.forEach((line, i) => {
      if (line.includes("lg-audit-ignore")) return;
      for (const m of line.matchAll(rule.re)) findings.push({ file: relative(root, file), line: i + 1, rule, match: m[0] });
    });
  }
  // grids must declare an unprefixed column count (grid-cols-1 on phones): implicit tracks blow out
  lines.forEach((line, i) => {
    if (line.includes("lg-audit-ignore")) return;
    for (const m of line.matchAll(/className=["'`]([^"'`]*)["'`]/g)) {
      const cls = m[1];
      if (/(^|\s)grid(\s|$)/.test(cls) && !/(^|\s)grid-cols-/.test(cls) && !/(^|\s)place-/.test(cls))
        findings.push({ file: relative(root, file), line: i + 1, rule: { id: "implicit-grid", level: "warn", msg: "Grid without a base column count: add grid-cols-1 (implicit tracks blow out on phones)." }, match: m[0].slice(0, 80) });
    }
  });
  // page-level structure checks
  const dark = (text.match(/tone=["']dark["']/g) ?? []).length;
  if (dark > 2) findings.push({ file: relative(root, file), line: 1, rule: { id: "dark-sections", level: "error", msg: `${dark} dark sections in one file: max 2 per page.` }, match: "" });
  const h1 = (text.match(/<h1\b|as=["']h1["']/g) ?? []).length;
  if (h1 > 1) findings.push({ file: relative(root, file), line: 1, rule: { id: "single-h1", level: "warn", msg: `${h1} h1 elements: exactly one per page.` }, match: "" });
  const glass = (text.match(/<Glass\b|variant=["']glass["']|lg-glass/g) ?? []).length;
  if (glass > 6) findings.push({ file: relative(root, file), line: 1, rule: { id: "glass-budget", level: "warn", msg: `${glass} glass elements: Liquid Glass is for the control layer; keep it sparse.` }, match: "" });
  // product pages: product scale only, never the marketing scale
  const isProduct = /<AppShell\b|data-density=["']product["']/.test(text) && !/<(?:DockNav|GlassNav)\b/.test(text);
  if (isProduct)
    lines.forEach((line, i) => {
      if (line.includes("lg-audit-ignore")) return;
      for (const m of line.matchAll(/\btext-(?:hero|display|h[1-4]|lead|stat)\b/g))
        findings.push({ file: relative(root, file), line: i + 1, rule: { id: "marketing-scale-in-product", level: "error", msg: "Marketing type in a product page: use text-ui-large-title/title-1/title-2/title-3/headline/body/callout/subhead/caption/metric." }, match: m[0] });
      for (const m of line.matchAll(/<(?:Tile|Section|SectionHeader|PageHero|CardRail)\b/g))
        findings.push({ file: relative(root, file), line: i + 1, rule: { id: "marketing-block-in-product", level: "warn", msg: "Marketing block inside a product page: use UICard, UICardHeader, UISectionHeader, AppContent." }, match: m[0] });
    });
  // landing pages (DockNav) always include the horizontal CardRail
  if (/<DockNav\b/.test(text) && !/<CardRail\b/.test(text))
    findings.push({ file: relative(root, file), line: 1, rule: { id: "landing-needs-rail", level: "error", msg: "Landing page without a CardRail: every landing page has one horizontal CardRail section (rail of 6 to 9 RailCards)." }, match: "" });
  // scroll budget: max 3 pinned showpieces per page
  const pinned = (text.match(/<(?:MediaExpand|ZoomThrough|PinnedGallery|StackCards|ScrollStory)\b/g) ?? []).length;
  if (pinned > 3) findings.push({ file: relative(root, file), line: 1, rule: { id: "scroll-budget", level: "error", msg: `${pinned} pinned scroll sections: max 3 per page, never two back to back, never the first section.` }, match: "" });
  // glass on content surfaces
  lines.forEach((line, i) => {
    if (line.includes("lg-audit-ignore")) return;
    if (/<(?:Tile|UICard|PricingTier|Metric)\b[^>]*\blg-glass\b/.test(line) || /\blg-glass\b[^"'`]*\b(?:lg-card|lg-ui-card)\b/.test(line))
      findings.push({ file: relative(root, file), line: i + 1, rule: { id: "glass-on-content", level: "error", msg: "Liquid Glass on a content surface: glass is for navigation and controls only. Cards stay solid." }, match: line.trim().slice(0, 80) });
  });
  if (/<(?:PhoneFrame|WindowFrame)\b/.test(text) && !/<(?:DeviceStage|FloatingDevice)\b/.test(text))
    findings.push({ file: relative(root, file), line: 1, rule: { id: "device-outside-stage", level: "warn", msg: "PhoneFrame/WindowFrame rendered without a DeviceStage (or the hero's FloatingDevice): wrap every device so insets and crops stay consistent." }, match: "" });
}

// viewport zoom must stay enabled
for (const html of ["index.html", "src/routes/__root.tsx"]) {
  const p = join(root, html);
  if (existsSync(p) && /user-scalable\s*=\s*no|maximum-scale\s*=\s*1(?:\.0)?\b/.test(readFileSync(p, "utf8")))
    findings.push({ file: html, line: 1, rule: { id: "zoom-disabled", level: "error", msg: "Viewport disables zoom: remove maximum-scale / user-scalable (WCAG 1.4.4)." }, match: "" });
}

const errors = findings.filter((f) => f.rule.level === "error");
for (const f of findings) {
  const tag = f.rule.level === "error" ? "✖" : "▲";
  console.log(`${tag} ${f.file}:${f.line}  [${f.rule.id}] ${f.rule.msg}${f.match ? `  → ${f.match}` : ""}`);
}
if (legacy.length && process.argv.includes("--legacy")) console.log(`\nNot migrated yet (not checked): ${legacy.length}\n${legacy.map((f) => `  · ${f}`).join("\n")}`);
console.log(`\nlg-audit: ${checked} files checked · ${errors.length} errors · ${findings.length - errors.length} warnings${legacy.length ? ` · ${legacy.length} not migrated yet (--legacy lists them)` : ""}`);
process.exit(errors.length ? 1 : 0);
