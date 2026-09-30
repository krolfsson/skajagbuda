/** Run: npx tsx scripts/test-bid-position.ts */
import assert from "node:assert/strict";
import { deriveBidPosition } from "../lib/bid-position";
import { EXAMPLE_SCORECARD } from "../lib/example-scorecard";
import type { Scorecard } from "../lib/schemas";

// The reported case: value 3.75–4.0M, ceiling 3.95M, stretch 4.0M, walk-away 4.35M.
const sc: Scorecard = {
  ...EXAMPLE_SCORECARD,
  maxBidSuggestion: 3_950_000,
  bidIntervals: {
    fairValueLow: 3_750_000,
    fairValueHigh: 4_000_000,
    recommendedCeiling: 3_950_000,
    stretchLevel: 4_000_000,
    walkAwayLevel: 4_350_000,
  },
  budgetContext: {
    userMaxBudget: 5_000_000,
    // What the model wrote — must never reach the UI.
    budgetVsRecommendation:
      "Användarens maxbudget på 5 000 000 kr är högre än det rekommenderade budtaket, vilket ger utrymme för att buda inom budget.",
  },
};

const BANNED = /utrymme (för )?att buda|utrymme inom (din )?budget|har utrymme att höja/i;
const run = (currentBid: number | null, userMaxBudget: number | null) => {
  const raw = deriveBidPosition(sc, { currentBid, userMaxBudget });
  // Intl formats thousands with non-breaking spaces; compare on plain spaces.
  const sp = (t: string | null) => (t ? t.replace(/[\u00a0\u202f]/g, " ") : t);
  const p = { ...raw, currentBidText: sp(raw.currentBidText), budgetText: sp(raw.budgetText), action: sp(raw.action) };
  for (const t of [p.currentBidText, p.budgetText, p.action]) if (t) assert.doesNotMatch(t, BANNED, t);
  return p;
};

// C (the reported case) + F
const c = run(4_300_000, 5_000_000);
assert.equal(c.currentBidState, "above_ceiling");
assert.equal(c.budgetState, "budget_above_ceiling");
assert.match(c.currentBidText!, /redan 350 000 kr över vårt rekommenderade budtak på 3 950 000 kr/);
assert.match(c.currentBidText!, /nära vår walk-away-nivå på cirka 4 350 000 kr/);
assert.match(c.currentBidText!, /stöds inte av det nuvarande underlaget/);
assert.equal(
  c.budgetText,
  "Din maxbudget på 5 000 000 kr innebär att du har råd att bjuda mer, men vår marknadsbedömning motiverar inte ett högre bud utifrån nuvarande underlag."
);
console.log("C+F:", c.currentBidText, "|", c.budgetText);

// C, far from walk-away
const cFar = run(4_000_000, null);
assert.equal(cFar.currentBidState, "above_ceiling");
assert.match(cFar.currentBidText!, /50 000 kr över .* och 350 000 kr under vår walk-away-nivå/);

// A: below reasonable range
const a = run(3_600_000, 5_000_000);
assert.equal(a.currentBidState, "below_range");
assert.match(a.currentBidText!, /under vårt bedömda rimliga värde på 3 750 000 kr–4 000 000 kr/);
assert.match(a.budgetText!, /visar vad du har råd med – inte vad bostaden är värd/);

// B: inside range, below ceiling
const b = run(3_800_000, null);
assert.equal(b.currentBidState, "within_range");
assert.match(b.currentBidText!, /150 000 kr under vårt rekommenderade budtak/);
// B edge: exactly at ceiling
const bAt = run(3_950_000, null);
assert.equal(bAt.currentBidLabel, "På vårt budtak");

// D: at / above walk-away
const d = run(4_350_000, 5_000_000);
assert.equal(d.currentBidState, "at_or_above_walk_away");
assert.match(d.currentBidText!, /ligger på vår walk-away-nivå/);
assert.match(d.currentBidText!, /slutar buda/);
const dOver = run(4_500_000, 5_000_000);
assert.match(dOver.currentBidText!, /150 000 kr över vår walk-away-nivå/);
assert.match(dOver.budgetText!, /motiverar inte ett högre bud/);

// E: budget below ceiling (+ bid already at the budget)
const e = run(3_700_000, 3_700_000);
assert.equal(e.budgetState, "budget_below_ceiling");
assert.match(e.budgetText!, /Håll dig till din budget/);
assert.match(e.budgetText!, /har redan nått din maxbudget/);

// F edge: budget equal to ceiling
assert.equal(run(null, 3_950_000).budgetState, "budget_at_ceiling");

// No current bid → only budget copy; no ceiling → nothing
const noBid = run(null, 5_000_000);
assert.equal(noBid.currentBidText, null);
assert.ok(noBid.budgetText);
const noLevels = deriveBidPosition(
  { ...sc, maxBidSuggestion: null, bidIntervals: { fairValueLow: null, fairValueHigh: null, recommendedCeiling: null, stretchLevel: null, walkAwayLevel: null } },
  { currentBid: 4_300_000, userMaxBudget: 5_000_000 }
);
assert.equal(noLevels.currentBidText, null);
assert.equal(noLevels.budgetText, null);

console.log("OK — all states");
