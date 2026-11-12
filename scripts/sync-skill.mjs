#!/usr/bin/env node
// Makes the skill self-contained: copies the docs into references/ and writes scripts/files.json,
// the list of every file the installer downloads. Run: npm run skill
import { copyFileSync, readdirSync, writeFileSync } from "node:fs";
const skill = new URL("../skill/ui-design-minimal/", import.meta.url);
for (const [from, to] of [["DESIGN.md", "DESIGN.md"], ["AGENTS.md", "AGENTS.md"], ["docs/COMPONENTS.md", "COMPONENTS.md"]])
  copyFileSync(new URL(`../${from}`, import.meta.url), new URL(`references/${to}`, skill));
const list = (dir) => readdirSync(new URL(`../${dir}/`, import.meta.url)).filter((f) => !f.startsWith(".")).sort().map((f) => `${dir}/${f}`);
const files = [
  ...list("src/styles"),
  ...list("src/components/lg"),
  "src/lib/cn.ts",
  "DESIGN.md",
  "AGENTS.md",
  "docs/COMPONENTS.md",
  "tokens/tokens.json",
  "scripts/lg-audit.mjs",
];
writeFileSync(new URL("scripts/files.json", skill), JSON.stringify({ repo: "tammo1007/ui-design-minimal", files }, null, 2) + "\n");
console.log(`skill synced: 3 references, ${files.length} installable files`);
