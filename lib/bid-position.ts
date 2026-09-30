/**
 * Where the current bid and the user's budget stand relative to the value-based bid levels.
 *
 * Principles:
 * - Reasonable value, recommended ceiling and walk-away come from the market/value analysis.
 * - The user's max budget is an affordability constraint only. It can lower what the user
 *   should pay, never raise what the analysis recommends.
 * - The copy is deterministic — model free text about budget is not shown, because it has
 *   framed a large budget as "room to bid" even when the bidding was past the ceiling.
 */
import type { Scorecard } from "@/lib/schemas";
import { fmtMoney, normalizeBid } from "@/lib/report-ui";

export type BidLevels = {
  fairLow: number | null;
  fairHigh: number | null;
  ceiling: number | null;
  stretch: number | null;
  walkAway: number | null;
};

/** A–D: current bid vs value levels. */
export type CurrentBidState = "below_range" | "within_range" | "above_ceiling" | "at_or_above_walk_away";
/** E–F: user budget vs recommended ceiling. */
export type BudgetState = "budget_below_ceiling" | "budget_at_ceiling" | "budget_above_ceiling";

export type Tone = "good" | "neutral" | "caution" | "danger";

export type BidPosition = {
  levels: BidLevels;
  currentBid: number | null;
  budget: number | null;
  currentBidState: CurrentBidState | null;
  budgetState: BudgetState | null;
  /** Short status label for the current bid, e.g. "Över vårt budtak". */
  currentBidLabel: string | null;
  currentBidText: string | null;
  currentBidTone: Tone | null;
  budgetText: string | null;
  /** One-line action for "Nästa steg" / the conclusion. */
  action: string | null;
};

/** Distance from the walk-away level that counts as "nära" in the copy. */
const NEAR_WALK_AWAY_KR = 100_000;

const kr = (v: number) => fmtMoney(v);
const norm = (v: number | null | undefined) => (v && v > 0 ? normalizeBid(v) : null);

export function bidLevelsFromScorecard(sc: Scorecard): BidLevels {
  const i = sc.bidIntervals;
  return {
    fairLow: norm(i.fairValueLow ?? sc.priceAnalysis.estimatedFairRangeLow),
    fairHigh: norm(i.fairValueHigh ?? sc.priceAnalysis.estimatedFairRangeHigh),
    ceiling: norm(i.recommendedCeiling ?? sc.maxBidSuggestion),
    stretch: norm(i.stretchLevel),
    walkAway: norm(i.walkAwayLevel),
  };
}

export function classifyCurrentBid(bid: number, l: BidLevels): CurrentBidState | null {
  if (!l.ceiling) return null;
  if (l.walkAway && bid >= l.walkAway) return "at_or_above_walk_away";
  if (bid > l.ceiling) return "above_ceiling";
  if (l.fairLow && bid < l.fairLow) return "below_range";
  return "within_range";
}

export function classifyBudget(budget: number, l: BidLevels): BudgetState | null {
  if (!l.ceiling) return null;
  if (budget < l.ceiling) return "budget_below_ceiling";
  if (budget === l.ceiling) return "budget_at_ceiling";
  return "budget_above_ceiling";
}

function currentBidCopy(
  state: CurrentBidState,
  bid: number,
  l: BidLevels
): { label: string; text: string; tone: Tone; action: string } {
  const ceiling = l.ceiling!;
  const range = l.fairLow && l.fairHigh ? `${kr(l.fairLow)}–${kr(l.fairHigh)}` : null;

  switch (state) {
    case "below_range":
      return {
        label: "Under rimligt värde",
        tone: "good",
        text:
          `Det aktuella budet på ${kr(bid)} ligger under vårt bedömda rimliga värde` +
          `${range ? ` på ${range}` : ""}. Att följa med upp till vårt rekommenderade budtak på ` +
          `${kr(ceiling)} stöds av underlaget – bestäm stegen i förväg så att du inte passerar det i farten.`,
        action: `Budgivningen ligger under vår värdebedömning. Underlaget stöder bud upp till ${kr(ceiling)}.`,
      };

    case "within_range": {
      const gap = ceiling - bid;
      return {
        label: gap === 0 ? "På vårt budtak" : "Inom rimligt värde",
        tone: gap === 0 ? "caution" : "neutral",
        text:
          gap === 0
            ? `Det aktuella budet på ${kr(bid)} ligger precis på vårt rekommenderade budtak. Nästa bud innebär att du betalar mer än vår bedömning motiverar.`
            : `Det aktuella budet på ${kr(bid)} ligger inom vårt rimliga intervall och ${kr(gap)} under vårt rekommenderade budtak på ${kr(ceiling)}. Bud upp till budtaket stöds av underlaget; över det betalar du mer än vår bedömning motiverar.`,
        action:
          gap === 0
            ? `Budgivningen har nått vårt budtak på ${kr(ceiling)}. Höj bara om ny information stärker caset.`
            : `Underlaget stöder bud upp till ${kr(ceiling)} – ${kr(gap)} över det aktuella budet.`,
      };
    }

    case "above_ceiling": {
      const over = bid - ceiling;
      const walkGap = l.walkAway ? l.walkAway - bid : null;
      const walkPart = l.walkAway
        ? walkGap! <= NEAR_WALK_AWAY_KR
          ? ` och nära vår walk-away-nivå på cirka ${kr(l.walkAway)}`
          : ` och ${kr(walkGap!)} under vår walk-away-nivå på cirka ${kr(l.walkAway)}`
        : "";
      return {
        label: "Över vårt budtak",
        tone: "caution",
        text:
          `Det aktuella budet på ${kr(bid)} ligger redan ${kr(over)} över vårt rekommenderade budtak på ${kr(ceiling)}${walkPart}. ` +
          "Du betalar alltså redan en premie jämfört med vår bedömning, och fortsatta bud stöds inte av det nuvarande underlaget. " +
          "Bjud bara vidare medvetet – om ny information stärker caset, eller om du själv väljer att betala ett personligt överpris för just den här bostaden.",
        action: `Budgivningen ligger redan ${kr(over)} över vårt budtak. Fortsatta bud stöds inte av underlaget – bjud bara vidare om ny information stärker caset.`,
      };
    }

    case "at_or_above_walk_away": {
      const walkAway = l.walkAway!;
      const overWalk = bid - walkAway;
      return {
        label: "Vid eller över walk-away",
        tone: "danger",
        text:
          `Det aktuella budet på ${kr(bid)} ligger ${overWalk === 0 ? "på" : `${kr(overWalk)} över`} vår walk-away-nivå på ${kr(walkAway)} – ` +
          `${kr(bid - ceiling)} över vårt rekommenderade budtak på ${kr(ceiling)}. ` +
          "Här rekommenderar vi att du slutar buda. Gå bara vidare om ny och väsentlig information ändrar bedömningen av bostaden eller föreningen.",
        action: `Budgivningen har passerat vår walk-away-nivå på ${kr(walkAway)}. Vi rekommenderar att du slutar buda.`,
      };
    }
  }
}

function budgetCopy(
  state: BudgetState,
  budget: number,
  l: BidLevels,
  currentBidState: CurrentBidState | null,
  bid: number | null
): string {
  const ceiling = l.ceiling!;

  if (state === "budget_below_ceiling") {
    const reached =
      bid && bid >= budget
        ? ` Det aktuella budet på ${kr(bid)} har redan nått din maxbudget.`
        : "";
    return (
      `Din maxbudget på ${kr(budget)} ligger under vårt rekommenderade budtak på ${kr(ceiling)}. ` +
      "Håll dig till din budget – att bostaden kan vara värd mer är inget skäl att gå över det du har råd med." +
      reached
    );
  }

  if (state === "budget_at_ceiling") {
    return `Din maxbudget sammanfaller med vårt rekommenderade budtak på ${kr(ceiling)}. Budtaket bygger på marknadsbedömningen, inte på din budget – det är två oberoende gränser som råkar landa på samma belopp.`;
  }

  // Budget above the ceiling: affordability is never presented as a reason to bid higher.
  if (currentBidState === "above_ceiling" || currentBidState === "at_or_above_walk_away") {
    return `Din maxbudget på ${kr(budget)} innebär att du har råd att bjuda mer, men vår marknadsbedömning motiverar inte ett högre bud utifrån nuvarande underlag.`;
  }
  return `Din maxbudget på ${kr(budget)} visar vad du har råd med – inte vad bostaden är värd. Vår marknadsbedömning motiverar inte bud över ${kr(ceiling)} utifrån nuvarande underlag, även om din budget skulle räcka längre.`;
}

export function deriveBidPosition(
  sc: Scorecard,
  input: { currentBid?: number | null; userMaxBudget?: number | null }
): BidPosition {
  const levels = bidLevelsFromScorecard(sc);
  const currentBid = norm(input.currentBid);
  const budget = norm(input.userMaxBudget ?? sc.budgetContext.userMaxBudget);

  const currentBidState = currentBid ? classifyCurrentBid(currentBid, levels) : null;
  const budgetState = budget ? classifyBudget(budget, levels) : null;
  const bidCopy = currentBidState && currentBid ? currentBidCopy(currentBidState, currentBid, levels) : null;

  return {
    levels,
    currentBid,
    budget,
    currentBidState,
    budgetState,
    currentBidLabel: bidCopy?.label ?? null,
    currentBidText: bidCopy?.text ?? null,
    currentBidTone: bidCopy?.tone ?? null,
    budgetText: budgetState && budget ? budgetCopy(budgetState, budget, levels, currentBidState, currentBid) : null,
    action: bidCopy?.action ?? null,
  };
}
