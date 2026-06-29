# Tarot Run — Overnight Build Log

> Autonomous senior-director run. Human is asleep. Goal: take Tarot Run from
> "mechanically deep but visually placeholder" to "genuinely amazing, unique,
> engaging, polished" — end to end. Respecting the project's hard rules
> (never bump VERSION, don't sim-chase win%, commit as standalone calls,
> don't destroy existing depth). Live: https://stephenuffugus.github.io/Tarot_Run/

---

## ☀️ WAKE-UP SUMMARY  (read me first)

_(finalized at the end of the run — see bottom of file for the live log)_

**TL;DR (provisional):** The biggest gap was ART — the game had real mechanical
depth across 24 build increments but every card, enemy, and the title were bare
unicode glyphs. Mission: a complete **ART_BIBLE.txt** (the production manifest)
**and** a dependency-free **procedural vector-art fallback** so the game *looks*
finished tonight — plus research/audit/design and permanent game/UX/polish.

**Mid-run steer from the user (asleep):** "work autonomously, don't ask" +
"I will make all the damn art for this game later." → Recalibrated:
- ART_BIBLE.txt is for YOU to execute later → keep it dense + production-ready.
- Procedural art is a NON-DESTRUCTIVE fallback only. The moment you drop a real
  `art-slots/card-<id>.png`, `hydrateArt()` auto-overrides it. So it makes the
  game look finished tonight and steps aside silently when your art lands. I
  will NOT over-invest in bespoke per-card scenes you intend to replace —
  systematic, cohesive, suit-coded, good-enough-to-playtest-with.
- Extra weight shifts to PERMANENT value your art won't touch: confirmed bug
  fixes, UX-friction removal, game-feel/juice, onboarding, mobile/accessibility.

---

## Running log (timestamped, newest at bottom)

### Phase 0 — Orient  (2026-06-29, run start)
- Confirmed repo: single-file vanilla HTML/CSS/JS PWA. `index.html` (4066 lines)
  is the whole game; `data/*.json` mirror card/enemy/relic defs; `sim-*.js` +
  `test*.js` + `diag-combat.js` are the Node test/sim harness.
- Deploy: GitHub Pages serves branch `setup/project-structure` (root). Every
  push auto-deploys in ~1 min. Working/​committing on that branch (it IS the
  deploy branch).
- Read RESUME.md, NEXT.md, README, DESIGN.md, ART_DIRECTION.md, BALANCE.md.
  Project is at **B24 · THE SHADOW DECK** — a Slay-the-Spire-style tarot
  deckbuilder: 4 Patrons, 78 cards (22 Major + 56 Minor w/ authored Shadow
  faces), The Reading/Prophecy, The Chain, The Cut, 3 Acts, Merchant, relics.
- **Baseline tests GREEN:** `test-cards.js` DONE (0 err), `test.js` full fight OK,
  `diag-combat.js` TEST A–H PASS, `sim-run.js` completes (wins present).
- **Key finding:** ZERO art exists. `art-slots/` is empty; every `.card-art`,
  `.enemy-portrait`, and `.title-mark` falls back to a unicode glyph via
  `::before{content:attr(data-glyph)}`. `hydrateArt()` loads `art-slots/<slot>.png`
  if present, else leaves the placeholder. → The non-destructive win: paint
  beautiful procedural SVG into the placeholder; a dropped PNG still overrides.
- Tooling: no Chrome/rasterizer in env; installed `@resvg/resvg-js` in scratch
  so generated SVG can be rasterized to PNG and visually verified.
- Decision log → see DESIGN.md additions as they land.
