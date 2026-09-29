/** Run: npx tsx scripts/test-bid-intervals.ts */
import assert from "node:assert/strict";
import { normalizeScorecardBidIntervals } from "../lib/normalize-bid-intervals";
import { EXAMPLE_SCORECARD } from "../lib/example-scorecard";
import type { Scorecard } from "../lib/schemas";

const base = EXAMPLE_SCORECARD as Scorecard;
const withVerdict = (verdict: Scorecard["priceAnalysis"]["verdict"]): Scorecard => ({
  ...base,
  weaknesses: [],
  redFlags: [],
  strengths: ["Bra läge"],
  priceAnalysis: { ...base.priceAnalysis, verdict, conclusion: "", askingPriceNote: "" },
});

// No asking price → no bid levels at all.
const none = normalizeScorecardBidIntervals(base, { askingPrice: null });
assert.equal(none.maxBidSuggestion, null);
assert.equal(none.bidIntervals.recommendedCeiling, null);
assert.equal(none.bidIntervals.walkAwayLevel, null);
assert.equal(none.uncertaintyLevel, "Hög");

const asking = 5_000_000;
const check = (sc: Scorecard) => {
  const b = sc.bidIntervals;
  assert.ok(b.fairValueLow! < b.fairValueHigh!, "fair low < high");
  assert.ok(b.recommendedCeiling! <= b.stretchLevel!, "ceiling <= stretch");
  assert.ok(b.stretchLevel! < b.walkAwayLevel!, "stretch < walk-away");
  assert.equal(sc.maxBidSuggestion, b.recommendedCeiling);
  return b;
};

const over = check(normalizeScorecardBidIntervals(withVerdict("Överprisat"), { askingPrice: asking }));
assert.ok(over.fairValueHigh! <= asking && over.recommendedCeiling! <= asking, "overpriced stays at/below asking");

const low = check(normalizeScorecardBidIntervals(withVerdict("Pressat"), { askingPrice: asking }));
assert.ok(low.fairValueHigh! > asking, "Pressat (lockpris) → fair value extends above asking");

check(normalizeScorecardBidIntervals(withVerdict("Rimligt"), { askingPrice: asking }));
console.log("OK", { over, low });

// Walk-away stays within the normalized band even if the AI text says otherwise.
const wild = normalizeScorecardBidIntervals(
  { ...withVerdict("Rimligt"), bidStrategy: { ...base.bidStrategy, walkAwayPoint: "Sluta buda vid 8 300 000 kr." } },
  { askingPrice: asking }
);
check(wild);
assert.ok(wild.bidIntervals.walkAwayLevel! <= wild.bidIntervals.recommendedCeiling! + 400_000, "walk-away capped");
assert.ok(wild.bidStrategy.walkAwayPoint.includes(new Intl.NumberFormat("sv-SE").format(wild.bidIntervals.walkAwayLevel!)), "text synced");
console.log("walk-away OK", wild.bidIntervals.walkAwayLevel, wild.bidStrategy.walkAwayPoint);
