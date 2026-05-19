# Tarot Run — Resume Plan

When the user says "lets get started", read this first.

## Where things are (as of B15 · THE TURN OF FATE — visible bendable reversal shipped)

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
  `node diag-combat.js` (regression suite TEST A–H: threat, Ward, Study,
  Spread, Chain, **and H = Wands Ember lay/detonate**).
- `node sim-archetypes.js` (dev-only stress harness, `SEEDS=N` env;
  4 player types × 4 Patrons). Reports SHAPE/deltas — do NOT tune to
  its win% (bot-capped ≈0 by design); read engine-reachability,
  Patron spread, comboist−masher delta, run shape.

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
9. **B10 · THE CUT** — the Reading is now an active skill: pre-combat
   "Cut the Deck" marker-sweep. Sun (center)=+2 Str & free Reading;
   faint=+1 Str; Tower (edges)=start Weak 2; else silent (=legacy).
   `combat.readingFortune` defaults 'silent' (engine/tests untouched);
   `cutTheDeck()` is UI-only (enterNode path, rAF-guarded). Marker
   speed scales with floor.
10. **B11 · THE WEB** — task #18: suits got a second verb. n=1–3 kept
   as clean baseline (regression anchor); n=4–10 are now engines —
   Wands lay/detonate Ember, Swords apply→cash debuffs, Cups turn
   sustain→damage, Pents turn Block→fist; cross-suit web throughout.
   Patron decks are 4 bespoke 16-card decks (was one re-suited
   template), each with a turn-1 combo seed, power held even.
11. **B12 · THE OPENING** — `sim-archetypes.js` (4 player types × 4
   Patrons × 60 seeds, dev-only, NEVER loaded by the game) found two
   STRUCTURAL breaks: Empress/Emperor decks had no opening offense
   (Empress 51/60 dead by floor 1, stalled with no win condition);
   the Cups heal→damage verb was dead (7 fires in 629 fights, gated
   at heal 12+). Fixes: Empress += wands-4+cups-10+swords-5; Emperor
   += pents-7+wands-4 (pents-9 kept); cups-9 gate 12→6 (now reliably
   fires), cups-10 also scales off Ward. Re-run: Cups verb 7→81,
   engine reachability 0.83→1.21 fires/fight. Bot win% is bot-capped
   by design — NOT the signal; the engine-reachability delta is.

12. **B13 · THE CHANNEL** — playtest found the "dead hand" problem
   (combos are conditional → off-combo cards feel like bricks; sim
   agreed: only ~1.2 payoffs/fight so most cards aren't the combo).
   Patron Channel: long-press a card → "Channel" feeds it to your
   Patron 1×/turn instead of playing it — Magician +1 energy,
   Priestess draw 1, Empress Heal4+3 Ward, Emperor Block6 (+Plate
   every 3rd fed). Differs per Patron so leftovers also play
   differently. Card→discard, no energy, 1×/turn. UI-only
   (`channelCard` from inspect modal); state defaults inert →
   engine/tests untouched. (User picked this over Bank / Signature
   Abilities — those remain on the table as later variants.)

13. **B14 · THE STRIKE** — two feel fixes. Banish DID let you pick
   (deck shows as a grid) but instant-spliced w/ no feedback → added
   a destruction animation on the chosen card. Enemy attacks had NO
   visual → added a walked-through strike (enemy lunge, screen shake,
   slash + red flash, floating −N / gold BLOCKED). `endTurn()` stays
   synchronous; FX is UI-only + rAF-guarded; tests untouched.

14. **B15 · THE TURN OF FATE** — user picked this (over Fortune Dice /
   Criteria Gates). Minors only, cost≥1. Reversed = −1 cost, effect
   ×mult via `ctx.fateMult` threaded through the 4 resolve helpers;
   upright = `Math.round(raw*1)=raw` so engine path byte-identical
   (tests untouched). Patron bends: Magician forces Upright
   (`fateChanceFor`→0), Emperor gentler ×0.80, Empress reversed also
   heals 3, Priestess may `turnFate` 1×/turn (inspect-modal action).
   `broken-mirror` relic +15% chance. Knobs: `FATE_BASE_CHANCE`
   (0.22), `FATE_REVERSED_MULT` map. Hand readable (no 180 flip;
   ribbon + discounted cost); inspect shows the rule. NOTE: Fortune
   Dice (opt-in push-luck) & Criteria Gates remain on the table.

## THE OPEN QUESTION — next playtest verdict (post B10–B15)

Both confirmed needs from the 2026-05-19 verdict are now SHIPPED:
A (active skill) = B10 The Cut; B (strategy depth) = B11 The Web +
bespoke decks. The Chain dial stays locked — do NOT re-tune the tax,
do NOT sim-chase (sim greedy ~0% by design, never uses Reading/Cut).

Awaiting the user's felt verdict on:
1. **The Cut** — does it create a "lean in" beat each fight, or a
   chore? Are Sun worth chasing / Tower scary? Speed curve OK on phone?
   → routes to: keep as-is / make it rarer-but-bigger (elite+boss only) /
   widen payoff spread / tune marker speed.
2. **The Web** — do the suits now feel like engines with real combos?
   Do the 4 Patrons feel genuinely different to pilot? Any combo that
   is degenerate (too strong) or never worth it (dead)?
   → routes to: per-card power tuning by feel + diag, NOT sim.
3. **Decks balanced?** Each Patron deck is 16 cards, low curve, one
   off-suit splash that seeds its engine. If one feels weak/strong,
   adjust that deck's list in `PATRON_DECKS` (no test asserts contents).

## Likely next increments (let the user steer)

- Per-feel balance pass on B11 cards / Patron decks (fast dials).
- The 2nd skill moment if Cut lands: **skill input on Chain detonation**
  (the chain-of-3 Aspect) — was the user's stated follow-on.
- Card rewards/draft pool should surface the new engine cards so a
  build can be drafted mid-run (check the reward generator picks from
  the textured n=4–10 band, not just stat-sticks).
- Reading reveal UI could hint when it's free (readingFortune==='strong').

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
