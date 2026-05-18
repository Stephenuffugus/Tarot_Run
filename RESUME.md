# Tarot Run — Resume Plan

When the user says "lets get started", read this first.

## Where things are (as of B9 · CHAIN TEETH, commit 8648c4f)

- Live game: **tinyurl.com/29xf8brd** (served off disk by `python3 -m http.server 8000`
  in this Codespace; every commit is instantly live — never a new link).
  Restart server if down: `nohup python3 -m http.server 8000 >/tmp/tarot-server.log 2>&1 &`
- Branch: **setup/project-structure** (pushed to origin). NOT merged to main.
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
   resets, Major is wild, chain-of-3 detonates the suit Aspect. One legible
   mechanic (replaced old hidden Aspect Resonance). Loud banner.
7. **Chain has teeth** — extending a chain costs energy (`chainTaxFor`:
   FREE=2, CAP=3 → tax 0,0,1,2,3,3). Charged before affordability; taxed
   cost shows amber-pulsing in hand.

## THE OPEN DECISION — do this first on resume

I asked the user to playtest B9 and answer:
1. Does "push the chain vs. bank energy for defense/Reading" feel like a real,
   interesting decision each turn — or too tight/annoying?
2. Can they still win with smart play, or does it feel unfair?

Their answer routes the next move:
- **"Too punishing"** → raise `CHAIN_TAX_FREE` to 3 (and/or `CHAIN_TAX_CAP` to 2)
  in index.html, re-verify diag, ship, bump BUILD.
- **"Still too easy / I just pay it"** → `CHAIN_TAX_FREE` 1 and/or raise CAP,
  consider also nudging `ENEMY_DMG_MULT` up ~0.66.
- **"This is the decision I wanted"** → lock it; proceed to the deep fix below.

DO NOT sim-chase. `sim-run.js` greedy AI only mass-mashes its dominant suit —
exactly the line the Chain Tax punishes — so it now reads ~0% by design and
is NOT a validity signal. Tune by the user's felt experience + diag shape.

## Next deep work (task #18, after the dial is locked)

**Rework the 56 vanilla minor cards for real card-to-card synergy.** This is
the deferred core fix. Right now minors are "Strike N / Block N" stat sticks;
the Chain adds tension but the cards themselves don't interact. Per the R&D:
- Wands → Ember (lay/detonate), Swords → debuff payoff, Cups → Ward engine,
  Pentacles → block-into-damage. Each suit gets cards that key off the others.
- Keep all 78 cards working (`node test-cards.js` must stay 0 errors).
- Build combo pieces into the Patron starter decks so synergy is felt turn one.

## Backlog (lower priority)
- Apply the VEILS modifiers (data exists; wire enemy HP/dmg/restHeal mods + a
  Veil picker at run start).
- Per-Patron balance pass once the Chain economy is locked.
- Reading-as-decision rework (currently underused RNG, should be info/choice).
- Eventually: merge setup/project-structure → main; per the user's call.

## Gotchas
- Never bump `VERSION` (save-version) — it discards in-progress runs.
  Add new meta fields via `migrateMeta()` defensively instead.
- `chainTaxFor` / `scaledEnemyHit` are single sources of truth — both
  playCard/renderHand and resolve/telegraph call them; keep it that way.
- Commit + push after every green increment; the user works in fast
  ship-and-playtest loops on their phone.
