#!/usr/bin/env node
// Copies DESIGN.md and docs/COMPONENTS.md into the skill so it is self-contained. Run: npm run skill
import { copyFileSync } from "node:fs";
const dir = new URL("../skill/liquid-glass-design-system/references/", import.meta.url);
copyFileSync(new URL("../DESIGN.md", import.meta.url), new URL("DESIGN.md", dir));
copyFileSync(new URL("../docs/COMPONENTS.md", import.meta.url), new URL("COMPONENTS.md", dir));
console.log("skill references synced");
