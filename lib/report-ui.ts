import { summaryToBullets } from "@/lib/format-summary";
import type { Scorecard } from "@/lib/schemas";

export function fmtMoney(v: number | null | undefined) {
  if (!v) return "–";
  return new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(v) + " kr";
}

export function fmtMoneyCompact(v: number | null | undefined) {
  if (!v) return "–";
  if (v >= 1_000_000) {
    const m = v / 1_000_000;
    return `${m.toLocaleString("sv-SE", { maximumFractionDigits: 2 })} Mkr`;
  }
  return fmtMoney(v);
}

export function fmtMoneyRange(low: number | null | undefined, high: number | null | undefined) {
  if (low && high) return `${fmtMoneyCompact(low)}–${fmtMoneyCompact(high)}`;
  if (low) return `från ${fmtMoneyCompact(low)}`;
  if (high) return `upp till ${fmtMoneyCompact(high)}`;
  return "–";
}

export function normalizeBid(v: number): number {
  if (v > 0 && v < 500) return v * 1_000_000;
  if (v >= 500 && v < 10_000) return v * 1_000;
  return v;
}

export function fmtPricePerSqm(price: number | null | undefined, sqm: number | null | undefined): string {
  if (!price || !sqm || sqm <= 0) return "–";
  const ppm = Math.round(normalizeBid(price) / sqm);
  return `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(ppm)} kr/kvm`;
}

export function fmtPricePerSqmRange(
  low: number | null | undefined,
  high: number | null | undefined,
  sqm: number | null | undefined
): string {
  if (!sqm || sqm <= 0) return "–";
  if (low && high) return `${fmtPricePerSqm(low, sqm).replace(" kr/kvm", "")} – ${fmtPricePerSqm(high, sqm)}`;
  if (low) return fmtPricePerSqm(low, sqm);
  if (high) return fmtPricePerSqm(high, sqm);
  return "–";
}

function cleanPoint(text: string): string {
  return text.replace(/^[-•*]\s+/, "").trim();
}

function firstSentence(text: string, max = 120): string {
  const cleaned = cleanPoint(text);
  const sentence = cleaned.split(/[.—–]/)[0]?.trim() ?? cleaned;
  return sentence.length > max ? `${sentence.slice(0, max - 1).trim()}…` : sentence;
}

export function deriveScoreInterpretation(sc: Scorecard): string {
  if (sc.score >= 78) return "Starkt case";
  if (sc.score >= 66) return "Medelstarkt case";
  if (sc.score >= 52) return "Blandat case";
  return "Svagt case";
}

export function deriveScoreSubtext(sc: Scorecard): string {
  const cats = sc.categoryScores;
  const labels: Record<string, string> = {
    price: "prisbilden",
    association: "föreningen",
    condition: "skicket",
    location: "läget",
    liquidity: "likviditeten",
    risk: "riskbilden",
  };

  const sorted = Object.entries(cats)
    .filter(([key]) => key in labels)
    .sort(([, a], [, b]) => b - a);

  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  if (best && worst && best[0] !== worst[0]) {
    const up = labels[best[0]] ?? best[0];
    const down = labels[worst[0]] ?? worst[0];
    if (best[1] - worst[1] >= 12) {
      return `${up.charAt(0).toUpperCase()}${up.slice(1)} väger upp, men ${down} drar ner.`;
    }
  }

  if (sc.strengths[0] && sc.weaknesses[0]) {
    return `${firstSentence(sc.strengths[0], 55)} — men ${firstSentence(sc.weaknesses[0], 55).toLowerCase()}.`;
  }

  return "Bedömningen bygger på tillgängligt objekt- och föreningsunderlag.";
}

export function deriveRiskExplanation(sc: Scorecard): string {
  const reason =
    sc.redFlags[0] ??
    sc.weaknesses[0] ??
    (sc.categoryScores.price < 50 ? "hög prisnivå relativt underlaget" : null);

  if (reason) {
    return `${sc.riskLevel} — främst på grund av ${firstSentence(reason, 90).toLowerCase()}.`;
  }

  return `${sc.riskLevel} — ingen enskild risk dominerar, men kontrollera underlaget innan nästa bud.`;
}

export function deriveConclusion(sc: Scorecard): string {
  const bullets = summaryToBullets(sc.summary);
  const bidBullet = bullets.find((b) =>
    /budtak|rekommenderat|slutbud|walk-away|walk away|kräv svar|marknadsvärde/i.test(b),
  );
  if (bidBullet) return bidBullet;

  if (sc.priceAnalysis.conclusion) return sc.priceAnalysis.conclusion;

  return `${sc.recommendation}. Granska prisbilden, röda flaggor och frågor innan slutbud.`;
}

export function deriveConclusionBox(sc: Scorecard): string {
  const whyParts: string[] = [];

  if (sc.priceAnalysis.conclusion) {
    whyParts.push(sc.priceAnalysis.conclusion);
  } else {
    const bullets = summaryToBullets(sc.summary);
    if (bullets.length >= 2) {
      whyParts.push(cleanPoint(bullets[0]), cleanPoint(bullets[1]));
    } else if (bullets.length === 1) {
      whyParts.push(cleanPoint(bullets[0]));
    } else if (sc.weaknesses[0]) {
      whyParts.push(firstSentence(sc.weaknesses[0], 100));
    }
  }

  const why = whyParts.filter(Boolean).slice(0, 2).join(" ").trim();
  const ceiling = sc.bidIntervals.recommendedCeiling ?? sc.maxBidSuggestion;
  const walkAway = sc.bidIntervals.walkAwayLevel;

  let action = sc.bidStrategy.nextStep.trim();
  if (ceiling && !/motiverar inte|budtak|walk-away|analys/i.test(action)) {
    action = `Analysens rekommenderade budtak är ${fmtMoney(normalizeBid(ceiling))}${walkAway ? ` — walk-away runt ${fmtMoney(normalizeBid(walkAway))}` : ""}. Höj bara om ny information motiverar det.`;
  } else if (!action) {
    action = "Kontrollera budhistorik, förenings ekonomi och jämförbara slutpriser innan du höjer.";
  }

  const lead = sc.recommendation.endsWith(".") ? sc.recommendation : `${sc.recommendation}.`;
  return why ? `${lead} ${why} ${action}` : `${lead} ${action}`;
}

export function deriveDecisionSummary(sc: Scorecard): string {
  const parts: string[] = [];

  if (sc.priceAnalysis.conclusion) {
    parts.push(sc.priceAnalysis.conclusion);
  }

  const positive = sc.strengths[0];
  const negative = sc.weaknesses[0] ?? sc.redFlags[0];
  const ceiling = sc.bidIntervals.recommendedCeiling ?? sc.maxBidSuggestion;

  if (positive && parts.length < 2) {
    parts.push(`${firstSentence(positive, 110)}.`);
  }
  if (negative && parts.length < 3) {
    parts.push(
      `Största risken: ${firstSentence(negative, 100).toLowerCase().replace(/\.$/, "")}.`,
    );
  }

  if (ceiling && parts.length < 3) {
    parts.push(
      `Rekommenderat budtak enligt analysen: ${fmtMoney(normalizeBid(ceiling))} — baserat på marknadsdata, inte enbart budget.`,
    );
  }

  if (parts.length === 0 && sc.oneSentenceSummary) {
    return sc.oneSentenceSummary;
  }

  return parts.slice(0, 3).join(" ");
}

export function deriveBudgetNote(sc: Scorecard, userMaxBudget?: number | null): string {
  const note = sc.budgetContext.budgetVsRecommendation.trim();
  const budget = userMaxBudget ?? sc.budgetContext.userMaxBudget ?? null;
  const ceiling = sc.bidIntervals.recommendedCeiling ?? sc.maxBidSuggestion;

  if (note && !/^analysens budtak bygger på objektdata/i.test(note)) {
    return note;
  }

  if (!budget || !ceiling) {
    return note || "Analysens budtak bygger på objektdata och marknadsbedömning.";
  }

  const normalizedBudget = normalizeBid(budget);
  const normalizedCeiling = normalizeBid(ceiling);

  if (normalizedBudget === normalizedCeiling) {
    return `Rekommenderat budtak sammanfaller med din angivna maxgräns (${fmtMoney(normalizedBudget)}), men inte på grund av budgeten i sig. Det stöds av pris/kvm, läget och jämförbara nivåer i underlaget — bekräfta med jämförelseobjekt innan slutbud.`;
  }

  if (normalizedBudget < normalizedCeiling) {
    return `Du har angett ${fmtMoney(normalizedBudget)} som max. Analysen bedömer att objektet kan vara marknadsmässigt försvarbart upp till cirka ${fmtMoney(normalizedCeiling)}, men din personliga budget begränsar hur högt du bör gå utan att acceptera extra ekonomisk risk.`;
  }

  return `Du har angett ${fmtMoney(normalizedBudget)} som max, men analysens rekommenderade budtak är ${fmtMoney(normalizedCeiling)}. Prisbilden och föreningsrisken motiverar inte högre nivå utan ny information.`;
}

export function deriveNextSteps(sc: Scorecard): string[] {
  const steps: string[] = [];
  const seen = new Set<string>();

  function add(step: string) {
    const key = step.toLowerCase();
    if (!seen.has(key) && steps.length < 5) {
      seen.add(key);
      steps.push(step);
    }
  }

  if (sc.priceAnalysis.missingComparablesNote || sc.comparisonObjects.length === 0) {
    add("Kräv jämförbara slutpriser för liknande objekt — underlaget är begränsat.");
  }

  for (const q of sc.questionsToAsk.slice(0, 2)) {
    if (/budhistorik|bud/i.test(q)) add("Be mäklaren om aktuell budhistorik.");
    else if (/slutpris|jämför|marknad/i.test(q)) add("Jämför med slutpriser för liknande objekt i området.");
    else if (/avgift|höj/i.test(q)) add("Fråga föreningen om planerade avgiftshöjningar.");
    else if (/underhåll|stambyte|renover/i.test(q)) add("Kontrollera underhållsplanen och planerade större åtgärder.");
  }

  add("Be mäklaren om aktuell budhistorik.");
  add("Jämför med slutpriser för liknande objekt i området.");

  if (sc.weaknesses.some((w) => /avgift|förening|stambyte|tomträtt|lån/i.test(w))) {
    add("Fråga föreningen om planerade avgiftshöjningar och större investeringar.");
  }

  if (sc.weaknesses.some((w) => /underhåll|stambyte|renover/i.test(w))) {
    add("Kontrollera underhållsplanen.");
  }

  const ceiling = sc.bidIntervals.recommendedCeiling ?? sc.maxBidSuggestion;
  if (ceiling) {
    add(`Nuvarande underlag motiverar inte bud över ${fmtMoney(normalizeBid(ceiling))} utan ny information.`);
  } else {
    add("Sätt ett budtak baserat på prisanalysen — inte bara på din budget — innan budgivningen.");
  }

  return steps.slice(0, 5);
}

export function deriveWalkAwayAmount(sc: Scorecard): string | null {
  const walkAway = sc.bidIntervals.walkAwayLevel;
  if (walkAway) return fmtMoney(normalizeBid(walkAway));

  const text = sc.bidStrategy.walkAwayPoint;
  const match = text.match(/(\d[\d\s]{5,}|\d+[,.]?\d*)\s*(kr|mkr|Mkr)/i);
  if (match) {
    const raw = match[1].replace(/\s/g, "").replace(",", ".");
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) {
      if (/mkr/i.test(match[2]) || n < 500) return fmtMoney(normalizeBid(n));
      return fmtMoney(n);
    }
  }

  const ceiling = sc.bidIntervals.recommendedCeiling ?? sc.maxBidSuggestion;
  if (ceiling) return fmtMoney(normalizeBid(ceiling));
  return null;
}

export const PRICE_VERDICT_COLORS: Record<
  Scorecard["priceAnalysis"]["verdict"],
  { text: string; bg: string; border: string }
> = {
  Rimligt: { text: "#166534", bg: "#f0fdf4", border: "#bbf7d0" },
  Pressat: { text: "#92400e", bg: "#fffbeb", border: "#fde68a" },
  Överprisat: { text: "#991b1b", bg: "#fef2f2", border: "#fecaca" },
  Osäkert: { text: "#374151", bg: "#f9fafb", border: "#e5e7eb" },
};

export const CATEGORY_LABELS: Record<string, string> = {
  price: "Pris",
  association: "Föreningen",
  condition: "Skick",
  location: "Läge",
  liquidity: "Likviditet",
  risk: "Riskbild",
};

export const CATEGORY_HINTS: Record<string, string> = {
  price: "Hur rimligt priset verkar mot objektets data",
  association: "Ekonomi och stabilitet",
  condition: "Objektets skick och underhåll",
  location: "Lägesstyrka",
  liquidity: "Hur lätt objektet bedöms vara att sälja",
  risk: "Hur kontrollerad riskbilden är",
};
