# Tarot Run — Resume Plan

When the user says "lets get started", read this first.

## Where things are (as of B9 · CHAIN TEETH, hosting solved)

- **Live game (PERMANENT): https://stephenuffugus.github.io/Tarot_Run/**
  - GitHub Pages, "Deploy from a branch" = `setup/project-structure` root.
  - Up 24/7 regardless of the Codespace. Every `git push` auto-deploys in ~1 min.
  - The old Codespace `python3 -m http.server` + tinyurl chain is DEAD —
    never restart it, never hand the user a tinyurl. The github.io URL is it.
  - `.nojekyll` at repo root makes Pages serve files as-is. Keep it.
  - Verify a deploy: `curl -s https://stephenuffugus.github.io/Tarot_Run/ | grep "const BUILD"`
    should echo the current `BUILD` const from index.html.
- Branch: **setup/project-structure** (pushed to origin). NOT merged to main.
  Pages serves THIS branch — keep shipping here.
- Build tag shown on title screen = `BUILD` const in index.html. Bump it every
  shippable change so the user can verify cache by reading it back.
- Tests: `node test-cards.js` (78/0 errors), `node test.js`, `node sim-run.js`,
  `node diag-combat.js` (regression suite TEST A–G: threat, Ward, Study, Spread, Chain).

## Shipped so far (depth-injection roadmap)

1. Combat-feel overhaul: real enemy threat, truthful telegraph, Ward wired,
   Kings = payoffs, suit archetypes. Knob: `ENEMY_DMG_MULT` 0.62.
2. Deck-thinning ("Hermit's Bargain" banish at Rest) + real Study (+2, ctx.studyBonus).
3. 4 Patrons (Magician/Priestess/Empress/Emperor) — picked via modal.
4. The Spread (8 ARCANA_BOONS, offered after elites, applied at combat start).
5. Retention meta: Insight (every run), The Mirror (spend Insight on Vigor/
   Fortune/Deep Reading), VEILS ladder data (unlock on win; application deferred).
6. **The Chain** — consecutive same-suit minor cards: +2/+4/+6/+8, off-suit
   resets, Major is wild, chain-of-3 detonates the suit Aspect. Loud banner.
7. **Chain has teeth** — extending a chain costs energy (`chainTaxFor`:
   FREE=2, CAP=3 → tax 0,0,1,2,3,3). Charged before affordability.
8. **Hosting solved** — permanent GitHub Pages URL (see above).

## THE OPEN DECISION — RESOLVED (2026-05-19 playtest verdict)

User's verdict: "starting to get more fun, we're getting there" but
"more than just a choice to make — like a mini game sometimes, little
skill things" and "still very simple, lacking depth in strategy."

Routing: the Chain dial is RIGHT — do NOT re-tune the tax, do NOT
sim-chase. The game now needs TWO things, both confirmed by the user:
  A. An **active skill layer** ("little skill things, mini game sometimes")
     — Hades-style active inputs, not deeper menus. This is the new
     headline direction.
  B. **More strategic depth** — the deferred task #18 (rework 56 minor
     cards for real card-to-card synergy).

Ship A first in small playtestable increments (it changes moment-to-moment
feel fastest); B is the slower deep fix underneath it.

## Next work — the skill layer (A), ship-small loop

Candidate first increments (let the user steer; see session for the
chosen one). All must keep `node test-cards.js` at 0 errors + diag green:
- **Active Reading** — convert the passive RNG Reading into a recurring
  skill input ("cut the deck" timing/precision → scales the boon).
- **Chain detonation skill** — sweet-spot timing on the chain-of-3
  Aspect detonation; nailing it amplifies, optional push-luck backfire.
- **Arcana Trial events** — occasional Major-Arcana mini-game rooms
  (Wheel push-luck, Tower reflex, Star memory) between fights.

## Then: task #18 — 56-card synergy (strategy depth, B)

Rework the 56 vanilla minors for real card-to-card synergy: Wands→Ember
lay/detonate, Swords→debuff payoff, Cups→Ward engine, Pents→block→damage;
each suit keys off the others. Build combo pieces into Patron starter
decks so synergy is felt turn one. Keep all 78 cards working.

## Backlog (lower priority)
- Apply the VEILS modifiers (data exists; wire enemy HP/dmg/restHeal mods
  + a Veil picker at run start).
- Per-Patron balance pass once the skill layer + synergy land.
- Hostinger/custom domain for the branded *published* build (later;
  Pages is the dev/playtest home).
- Eventually: merge setup/project-structure → main; per the user's call.

## Gotchas
- Never bump `VERSION` (save-version) — it discards in-progress runs.
  Add new meta fields via `migrateMeta()` defensively instead.
- `chainTaxFor` / `scaledEnemyHit` are single sources of truth — both
  playCard/renderHand and resolve/telegraph call them; keep it that way.
- Don't sim-chase. `sim-run.js` greedy AI mass-mashes its dominant suit,
  reads ~0% by design, and never uses Reading — NOT a validity signal.
  Tune by the user's felt playtest experience + diag shape.
- Commit + push after every green increment; Pages auto-deploys it.
  The user playtests on their phone in fast loops — keep changelogs
  punchy and tell them exactly what to FEEL for.
