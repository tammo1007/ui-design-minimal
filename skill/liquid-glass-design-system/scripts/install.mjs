#!/usr/bin/env node
/**
 * Liquid Glass Design System installer (by Tammo Elsner, MIT).
 * Copies every file the system needs into the current project, straight from GitHub:
 *   styles, components, cn(), DESIGN.md, AGENTS.md, docs/COMPONENTS.md, tokens.json, the audit script.
 *
 *   node <skill-dir>/scripts/install.mjs            install into ./ (uses ./src if it exists)
 *   node <skill-dir>/scripts/install.mjs --force    overwrite files that already exist
 *   node <skill-dir>/scripts/install.mjs --ref v1.0 install a tag or branch instead of main
 *
 * No dependencies. Node 18+. Never deletes anything.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = "tammo1007/liquid-glass-design-system";
const args = process.argv.slice(2);
const force = args.includes("--force");
const ref = args.includes("--ref") ? args[args.indexOf("--ref") + 1] : "main";
const root = process.cwd();
const src = existsSync(join(root, "src")) ? "src" : ".";
const here = dirname(fileURLToPath(import.meta.url));
const { files } = JSON.parse(readFileSync(join(here, "files.json"), "utf8"));

// repo path -> project path
const target = (p) => {
  if (p.startsWith("src/")) return join(src, p.slice(4));
  return p;
};
const written = [];
const skipped = [];
for (const p of files) {
  const out = join(root, target(p));
  if (existsSync(out) && !force) {
    skipped.push(target(p));
    continue;
  }
  const res = await fetch(`https://raw.githubusercontent.com/${REPO}/${ref}/${p}`);
  if (!res.ok) {
    console.error(`✖ ${p}: HTTP ${res.status}`);
    process.exitCode = 1;
    continue;
  }
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  written.push(target(p));
}

// one stylesheet to import after Tailwind
const entry = join(root, src, "styles", "liquid-glass.css");
if (!existsSync(entry) || force) {
  mkdirSync(dirname(entry), { recursive: true });
  writeFileSync(
    entry,
    `/* Liquid Glass Design System. Import this file right after @import "tailwindcss"; */\n@import "@fontsource-variable/inter";\n@import "./lg-tokens.css";\n@import "./lg-tailwind.css";\n@import "./lg-product.css";\n@import "./lg-scroll.css";\n`,
  );
  written.push(join(src, "styles", "liquid-glass.css"));
}

// npm script for the audit
const pkgPath = join(root, "package.json");
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.scripts ??= {};
  if (!pkg.scripts.audit) {
    pkg.scripts.audit = `node scripts/lg-audit.mjs${src === "." ? " ." : ""}`;
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    written.push("package.json (audit script)");
  }
}

console.log(`\nLiquid Glass Design System: ${written.length} written, ${skipped.length} kept (use --force to overwrite)`);
for (const f of written) console.log(`  + ${f}`);
for (const f of skipped) console.log(`  = ${f}`);
console.log(`
Next:
  1. npm i motion lenis clsx tailwind-merge class-variance-authority @radix-ui/react-slot @heroicons/react @fontsource-variable/inter
  2. In your main CSS, right after @import "tailwindcss";  add:  @import "./styles/liquid-glass.css";   (path relative to that CSS file)
  3. Make sure the alias @/* points to ${src === "." ? "./" : "src/"} (tsconfig paths + vite resolve.alias). Lovable and shadcn projects have it already.
  4. Wrap the app in <SmoothScroll> from "@/components/lg" and set data-theme="light" or "dark" on <html>.
  5. Read DESIGN.md and AGENTS.md, build, then run: npm run audit
`);
