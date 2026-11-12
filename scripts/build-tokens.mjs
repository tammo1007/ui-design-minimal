#!/usr/bin/env node
/**
 * Generates tokens/tokens.json (W3C Design Tokens Format Module 2025.10) from src/styles/lg-tokens.css,
 * so the CSS stays the single source of truth. Run: npm run tokens
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/lg-tokens.css", import.meta.url), "utf8");
const block = (startMarker) => {
  const i = css.indexOf(startMarker);
  const open = css.indexOf("{", i);
  let depth = 0, j = open;
  for (; j < css.length; j++) {
    if (css[j] === "{") depth++;
    else if (css[j] === "}" && --depth === 0) break;
  }
  return css.slice(open + 1, j);
};
const vars = (text) => {
  const out = {};
  for (const m of text.matchAll(/--lg-([\w-]+):\s*([^;]+);(?:\s*\/\*\s*([^*]*?)\s*\*\/)?/g)) out[m[1]] = { value: m[2].trim(), note: m[3]?.trim() };
  return out;
};
const light = vars(block(':root,\n  [data-theme="light"]'));
const dark = vars(block('  [data-theme="dark"] {'));
const shared = vars(block("3. TYPE"));

const hex = (rgb) => "#" + rgb.split(/\s+/).map((n) => Number(n).toString(16).padStart(2, "0")).join("").toUpperCase();
const resolve = (map, v) => {
  const ref = v.match(/^var\(--lg-([\w-]+)\)$/);
  return ref ? resolve(map, map[ref[1]]?.value ?? v) : v;
};
const colorToken = (map, name) => {
  const v = resolve(map, map[name].value);
  if (/^\d+ \d+ \d+$/.test(v)) {
    const [r, g, b] = v.split(" ").map(Number);
    return { $type: "color", $value: { colorSpace: "srgb", components: [r / 255, g / 255, b / 255], hex: hex(v) } };
  }
  const a = v.match(/^rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)$/);
  if (a) return { $type: "color", $value: { colorSpace: "srgb", components: [a[1] / 255, a[2] / 255, a[3] / 255], alpha: Number(a[4]), hex: hex(`${a[1]} ${a[2]} ${a[3]}`) } };
  return null;
};
const colorNames = Object.keys(light).filter((k) => !/^(glass|material|shadow|aurora)/.test(k) && colorToken(light, k));
const color = {};
for (const theme of ["light", "dark"]) {
  color[theme] = {};
  for (const k of colorNames) {
    const map = theme === "light" ? light : { ...light, ...dark };
    const t = colorToken(map, k);
    if (t) color[theme][k] = { ...t, ...(light[k].note ? { $description: light[k].note } : {}) };
  }
}
const dim = (v) => {
  const m = String(v).match(/^(-?[\d.]+)(rem|px|em)$/);
  return m ? { $type: "dimension", $value: { value: Number(m[1]), unit: m[2] } } : null;
};
const typography = { marketing: {}, product: {} };
for (const n of ["hero", "display", "h1", "h2", "h3", "h4", "lead", "body", "small", "label", "caption", "stat"])
  typography.marketing[n] = {
    $type: "typography",
    $value: {
      fontFamily: "{font.sans}",
      fontSize: shared[`text-${n}`].value,
      fontWeight: { hero: 500, display: 500, h1: 500, h2: 500, h3: 500, h4: 500, label: 500, stat: 300 }[n] ?? 400,
      lineHeight: Number(shared[`lh-${n}`].value),
      letterSpacing: shared[`ls-${n}`].value,
    },
    ...(shared[`text-${n}`].note ? { $description: shared[`text-${n}`].note } : {}),
  };
for (const n of ["large-title", "title-1", "title-2", "title-3", "headline", "body", "callout", "subhead", "caption", "metric", "metric-lg"])
  typography.product[n] = {
    $type: "typography",
    $value: {
      fontFamily: "{font.sans}",
      fontSize: dim(shared[`ui-${n}`].value).$value,
      fontWeight: ["large-title", "title-1", "title-2", "title-3", "headline"].includes(n) ? 600 : ["subhead", "caption", "metric", "metric-lg"].includes(n) ? 500 : 400,
      lineHeight: dim(shared[`ui-${n}-lh`].value).$value,
      letterSpacing: dim(shared[`ui-${n}-ls`].value)?.$value ?? shared[`ui-${n}-ls`].value,
    },
  };
const pick = (re) => Object.fromEntries(Object.entries(shared).filter(([k]) => re.test(k)).map(([k, v]) => [k, { ...(dim(v.value) ?? { $type: "dimension", $value: v.value }), ...(v.note ? { $description: v.note } : {}) }]));
const duration = Object.fromEntries(Object.entries(shared).filter(([k]) => /^dur-/.test(k)).map(([k, v]) => [k.slice(4), { $type: "duration", $value: { value: parseInt(v.value), unit: "ms" } }]));

const tokens = {
  $schema: "https://www.designtokens.org/schemas/2025.10/format.json",
  $description: "UI Design Minimal by Tammo Elsner (https://www.linkedin.com/in/tammo-elsner-682998186/). MIT. Generated from src/styles/lg-tokens.css. Do not edit by hand.",
  font: {
    sans: { $type: "fontFamily", $value: ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "SF Pro Display", "Inter Variable", "Inter", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"] },
    mono: { $type: "fontFamily", $value: ["ui-monospace", "SF Mono", "SFMono-Regular", "Menlo", "Consolas", "monospace"] },
  },
  color,
  typography,
  radius: pick(/^r-/),
  space: pick(/^(gutter|section-y|section-y-sm|section-y-lg|header-gap|grid-gap|card-pad|stage-pad|app-pad|app-gap|app-inset|card-pad-ui)$/),
  size: pick(/^(control-|row|sidebar-w|inspector-w|toolbar-h|nav-h|icon-|w-)/),
  duration,
  easing: {
    out: { $type: "cubicBezier", $value: [0.22, 1, 0.36, 1] },
    "in-out": { $type: "cubicBezier", $value: [0.65, 0, 0.35, 1] },
  },
  glass: {
    $description: "Liquid Glass control layer. Regular: tint 72 % white, blur 24 px (18 on phones), saturate 180 %. Thick 86 %. Clear 16 % (+ 35 % black dim on bright media).",
    blur: { $type: "dimension", $value: { value: 24, unit: "px" } },
    "tint-light": { $type: "color", $value: { colorSpace: "srgb", components: [1, 1, 1], alpha: 0.72, hex: "#FFFFFF" } },
    "tint-thick-light": { $type: "color", $value: { colorSpace: "srgb", components: [1, 1, 1], alpha: 0.86, hex: "#FFFFFF" } },
    "tint-clear-light": { $type: "color", $value: { colorSpace: "srgb", components: [1, 1, 1], alpha: 0.16, hex: "#FFFFFF" } },
    "clear-dim": { $type: "color", $value: { colorSpace: "srgb", components: [0, 0, 0], alpha: 0.35, hex: "#000000" } },
  },
};
mkdirSync(new URL("../tokens/", import.meta.url), { recursive: true });
writeFileSync(new URL("../tokens/tokens.json", import.meta.url), JSON.stringify(tokens, null, 2) + "\n");
console.log(`tokens.json: ${colorNames.length} colors x 2 themes, ${Object.keys(typography.marketing).length + Object.keys(typography.product).length} type styles`);
