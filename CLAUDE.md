# CLAUDE.md

This project uses UI Design Minimal (by Tammo Elsner, MIT).

Before any UI change:
1. Read `DESIGN.md` (tokens and rules) and `AGENTS.md` (how to build, Definition of Done).
2. Read `docs/COMPONENTS.md` for the exact spec of every component you touch.
3. Build only from `@/components/lg` and token classes. Product pages use `text-ui-*` inside `AppShell`; marketing pages use the marketing scale.
4. Finish with `npm run audit` and `npm run build`, and check 390 px and 1440 px in light and dark.
