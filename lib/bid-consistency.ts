import type { Scorecard } from "@/lib/schemas";

const MONEY_RE = /(\d[\d\s]{5,}|\d+(?:[,.]\d+)?)\s*(kr|mkr|Mkr)?/gi;

export function parseMoneyAmount(raw: string, unit?: string): number | null {
  const normalized = raw.replace(/\s/g, "").replace(",", ".");
  const n = Number(normalized);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (unit && /mkr/i.test(unit)) return Math.round(n * 1_000_000);
  if (n > 0 && n < 500) return Math.round(n * 1_000_000);
  return Math.round(n);
}

export function formatAmountForText(amount: number): string {
  return new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(amount);
}

export function extractAllMoneyAmounts(text: string): number[] {
  const amounts: number[] = [];
  for (const match of text.matchAll(MONEY_RE)) {
    const amount = parseMoneyAmount(match[1], match[2]);
    if (amount && amount >= 100_000) amounts.push(amount);
  }
  return amounts;
}

/** Hitta walk-away-belopp i fri text (sluta buda, gå inte över, inledande belopp före tankstreck). */
export function parseWalkAwayFromText(text: string): number | null {
  const explicitPatterns = [
    /sluta\s+buda\s+vid\s+(\d[\d\s]{5,}|\d+(?:[,.]\d+)?)\s*(kr|mkr|Mkr)?/i,
    /gå\s+inte\s+över\s+(\d[\d\s]{5,}|\d+(?:[,.]\d+)?)\s*(kr|mkr|Mkr)?/i,
    /^(\d[\d\s]{5,}|\d+(?:[,.]\d+)?)\s*(kr|mkr|Mkr)?\s*[—–-]/i,
  ];

  for (const pattern of explicitPatterns) {
    const match = text.match(pattern);
    if (match) {
      const amount = parseMoneyAmount(match[1], match[2]);
      if (amount) return amount;
    }
  }

  const amounts = extractAllMoneyAmounts(text);
  return amounts.length > 0 ? Math.max(...amounts) : null;
}

/** Första beloppet i öppningsbud-texten. */
export function parseOpeningBidFromText(text: string): number | null {
  const match = text.match(/(\d[\d\s]{5,}|\d+(?:[,.]\d+)?)\s*(kr|mkr|Mkr)?/i);
  if (!match) return null;
  return parseMoneyAmount(match[1], match[2]);
}

function roundToBidStep(amount: number): number {
  return Math.max(500_000, Math.round(amount / 25_000) * 25_000);
}

function replaceFirstMoneyAmount(text: string, oldAmount: number, newAmount: number): string {
  const oldFormatted = formatAmountForText(oldAmount);
  const newFormatted = formatAmountForText(newAmount);
  if (text.includes(oldFormatted)) {
    return text.replace(oldFormatted, newFormatted);
  }
  return text.replace(
    /(\d[\d\s]{5,}|\d+(?:[,.]\d+)?)(\s*(?:kr|mkr|Mkr)?)/i,
    `${newFormatted}$2`
  );
}

function syncWalkAwayText(text: string, walkAway: number): string {
  const formatted = formatAmountForText(walkAway);

  const slutaMatch = text.match(/(sluta\s+buda\s+vid\s+)(\d[\d\s.,]+)(\s*(?:kr|mkr|Mkr)?)/i);
  if (slutaMatch) {
    return text.replace(slutaMatch[0], `${slutaMatch[1]}${formatted} kr`);
  }

  const leadingMatch = text.match(/^(\d[\d\s]{5,}|\d+(?:[,.]\d+)?)(\s*(?:kr|mkr|Mkr)?)(\s*[—–-]\s*)/i);
  if (leadingMatch) {
    return text.replace(leadingMatch[1], formatted);
  }

  const parsed = parseWalkAwayFromText(text);
  if (parsed) {
    const oldFormatted = formatAmountForText(parsed);
    if (text.includes(oldFormatted)) {
      return text.replace(oldFormatted, formatted);
    }
  }

  return text;
}

/**
 * Synka budstrategi och budintervall så att öppningsbud < budtak ≤ stretch < walk-away
 * och samma walk-away visas i både siffra och text.
 */
export function alignBidConsistency(
  bidStrategy: Scorecard["bidStrategy"],
  bidIntervals: Scorecard["bidIntervals"]
): { bidStrategy: Scorecard["bidStrategy"]; bidIntervals: Scorecard["bidIntervals"] } {
  const ceiling = bidIntervals.recommendedCeiling;
  const textWalkAway = parseWalkAwayFromText(bidStrategy.walkAwayPoint);
  const levelWalkAway = bidIntervals.walkAwayLevel;
  const opening = parseOpeningBidFromText(bidStrategy.openingMove);

  let walkAway =
    textWalkAway ??
    levelWalkAway ??
    (ceiling ? ceiling + 150_000 : null);

  // Om strukturerat walk-away är lägre än text (eller öppningsbud redan över nivån) — lita på texten.
  if (textWalkAway && levelWalkAway && textWalkAway !== levelWalkAway) {
    if (textWalkAway > levelWalkAway || (opening && opening >= levelWalkAway)) {
      walkAway = textWalkAway;
    }
  }

  if (ceiling && walkAway && walkAway < ceiling) {
    walkAway = ceiling + 150_000;
  }

  let stretch = bidIntervals.stretchLevel;
  if (ceiling && walkAway) {
    if (!stretch || stretch >= walkAway) {
      stretch = Math.min(ceiling + 100_000, walkAway - 25_000);
    }
    if (stretch < ceiling) stretch = ceiling;
  }

  let openingMove = bidStrategy.openingMove;
  if (opening && walkAway && opening >= walkAway) {
    const target = ceiling
      ? Math.min(ceiling - 100_000, walkAway - 250_000)
      : walkAway - 250_000;
    openingMove = replaceFirstMoneyAmount(openingMove, opening, roundToBidStep(target));
  } else if (opening && ceiling && opening > ceiling) {
    openingMove = replaceFirstMoneyAmount(
      openingMove,
      opening,
      roundToBidStep(ceiling - 150_000)
    );
  }

  let walkAwayPoint = bidStrategy.walkAwayPoint;
  if (walkAway) {
    walkAwayPoint = syncWalkAwayText(walkAwayPoint, walkAway);
  }

  return {
    bidStrategy: { ...bidStrategy, openingMove, walkAwayPoint },
    bidIntervals: { ...bidIntervals, stretchLevel: stretch, walkAwayLevel: walkAway },
  };
}
