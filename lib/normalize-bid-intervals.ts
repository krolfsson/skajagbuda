import { alignBidConsistency } from "@/lib/bid-consistency";
import type { Scorecard } from "@/lib/schemas";

const BID_STEP = 25_000;

export type BidIntervalContext = {
  askingPrice?: number | null;
};

function roundBid(amount: number): number {
  return Math.max(BID_STEP, Math.round(amount / BID_STEP) * BID_STEP);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function halfWidthFraction(
  uncertainty: Scorecard["uncertaintyLevel"],
  hasComparables: boolean
): number {
  if (uncertainty === "Hög" || !hasComparables) return 0.04;
  if (uncertainty === "Medel") return 0.035;
  return 0.03;
}

function suggestsDiscount(scorecard: Scorecard): boolean {
  const verdict = scorecard.priceAnalysis.verdict;
  if (verdict === "Överprisat") return true;
  if (verdict === "Pressat") return false;
  const text = [
    ...scorecard.weaknesses,
    ...scorecard.redFlags,
    scorecard.priceAnalysis.conclusion,
    scorecard.priceAnalysis.askingPriceNote,
  ].join(" ");
  return /överpris|dyrt|högt pris|för högt|sänk|rabatt/i.test(text);
}

function suggestsPremium(scorecard: Scorecard): boolean {
  if (scorecard.recommendation === "Starkt case") return true;
  const text = [...scorecard.strengths, scorecard.priceAnalysis.conclusion].join(" ");
  return /underpris|starkt läge|attraktiv|premium|sällsynt/i.test(text);
}

function buildUncertaintyNote(
  scorecard: Scorecard,
  hasComparables: boolean,
  wasVeryWide: boolean
): string | undefined {
  const uncertainty = scorecard.uncertaintyLevel ?? "Medel";
  const existing = scorecard.bidIntervals.uncertaintyNote?.trim();

  if (uncertainty === "Hög" || !hasComparables) {
    return (
      existing ??
      "Osäkerhet i underlaget är förhöjd — vi saknar tillräckligt med jämförbara slutpriser och komplett föreningsdata. Verifiera budhistorik och slutpriser innan du höjer, inte bara det breda spannet."
    );
  }

  if (wasVeryWide) {
    return (
      existing ??
      "Det ursprungliga prisspannet var för brett givet underlaget. Intervallet har justerats kring utgångspriset — bekräfta gärna med jämförelseobjekt."
    );
  }

  return existing;
}

export const MISSING_ASKING_PRICE_NOTE =
  "Utgångspris saknas i underlaget, så vi anger inga budnivåer. Lägg till utgångspriset och kör en ny analys för rimligt värde, budtak och walk-away.";

/**
 * Without an asking price every bid level would rest on a number the model made up,
 * so we show none rather than a precise-looking guess.
 */
function withoutBidLevels(scorecard: Scorecard): Scorecard {
  return {
    ...scorecard,
    uncertaintyLevel: "Hög",
    maxBidSuggestion: null,
    bidIntervals: {
      fairValueLow: null,
      fairValueHigh: null,
      recommendedCeiling: null,
      stretchLevel: null,
      walkAwayLevel: null,
      uncertaintyNote: MISSING_ASKING_PRICE_NOTE,
    },
    priceAnalysis: {
      ...scorecard.priceAnalysis,
      estimatedFairRangeLow: null,
      estimatedFairRangeHigh: null,
    },
  };
}

/**
 * Gör pris- och budintervall smalare, utgångsprisankrade och tydligt åtskilda.
 */
export function normalizeScorecardBidIntervals(
  scorecard: Scorecard,
  context: BidIntervalContext
): Scorecard {
  const asking =
    context.askingPrice && context.askingPrice > 0 ? context.askingPrice : null;
  if (!asking) return withoutBidLevels(scorecard);
  const hasComparables = scorecard.comparisonObjects.length >= 2;
  const uncertainty = scorecard.uncertaintyLevel ?? "Medel";
  const widthFrac = halfWidthFraction(uncertainty, hasComparables);

  const originalLow = scorecard.bidIntervals.fairValueLow;
  const originalHigh = scorecard.bidIntervals.fairValueHigh;
  const wasVeryWide =
    !!originalLow &&
    !!originalHigh &&
    (originalHigh - originalLow) / asking > 0.12;

  const discount = suggestsDiscount(scorecard);
  let fairLow: number;
  let fairHigh: number;

  if (discount) {
    fairHigh = roundBid(asking);
    fairLow = roundBid(asking * (1 - widthFrac * 1.25));
  } else if (scorecard.priceAnalysis.verdict === "Pressat") {
    // "Pressat" = utgångspriset ligger lågt mot jämförelserna (lockpris).
    fairHigh = roundBid(asking * (1 + widthFrac * 0.75));
    fairLow = roundBid(asking * (1 - widthFrac));
  } else if (uncertainty === "Hög" || !hasComparables) {
    fairLow = roundBid(asking * (1 - widthFrac * 1.25));
    fairHigh = roundBid(asking * (1 + widthFrac * 0.35));
  } else {
    fairLow = roundBid(asking * (1 - widthFrac));
    fairHigh = roundBid(asking * (1 + widthFrac));
  }

  if (fairHigh <= fairLow) {
    fairHigh = fairLow + roundBid(asking * 0.03);
  }

  const aiCeiling = scorecard.bidIntervals.recommendedCeiling ?? scorecard.maxBidSuggestion ?? null;
  let ceiling: number;
  if (discount) {
    const target = aiCeiling ? Math.min(aiCeiling, asking) : asking * 0.97;
    ceiling = roundBid(clamp(target, fairLow, fairHigh));
  } else {
    ceiling = roundBid(clamp(asking, fairLow, fairHigh));
  }

  let stretch = scorecard.bidIntervals.stretchLevel;
  if (!stretch || stretch <= ceiling) {
    stretch = roundBid(ceiling + (suggestsPremium(scorecard) ? 125_000 : 100_000));
  }
  stretch = Math.min(stretch, ceiling + 200_000);

  let walkAway = scorecard.bidIntervals.walkAwayLevel;
  if (!walkAway || walkAway <= stretch) {
    walkAway = roundBid(stretch + 100_000);
  }
  walkAway = Math.min(walkAway, ceiling + 400_000);
  if (walkAway <= stretch) walkAway = roundBid(stretch + 50_000);

  const uncertaintyNote = buildUncertaintyNote(scorecard, hasComparables, wasVeryWide);

  const bidIntervals = {
    ...scorecard.bidIntervals,
    fairValueLow: fairLow,
    fairValueHigh: fairHigh,
    recommendedCeiling: ceiling,
    stretchLevel: stretch,
    walkAwayLevel: walkAway,
    uncertaintyNote,
  };

  const aligned = alignBidConsistency(scorecard.bidStrategy, bidIntervals, { preferLevels: true });

  return {
    ...scorecard,
    maxBidSuggestion: aligned.bidIntervals.recommendedCeiling,
    bidIntervals: aligned.bidIntervals,
    bidStrategy: aligned.bidStrategy,
    priceAnalysis: {
      ...scorecard.priceAnalysis,
      estimatedFairRangeLow: fairLow,
      estimatedFairRangeHigh: fairHigh,
    },
  };
}

export function bidIntervalsDiffer(
  a: Scorecard["bidIntervals"] | undefined,
  b: Scorecard["bidIntervals"]
): boolean {
  if (!a) return true;
  return (
    a.fairValueLow !== b.fairValueLow ||
    a.fairValueHigh !== b.fairValueHigh ||
    a.recommendedCeiling !== b.recommendedCeiling ||
    a.stretchLevel !== b.stretchLevel ||
    a.walkAwayLevel !== b.walkAwayLevel ||
    a.uncertaintyNote !== b.uncertaintyNote
  );
}
