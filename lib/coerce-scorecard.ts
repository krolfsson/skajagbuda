import type { Scorecard } from "@/lib/schemas";

const RECOMMENDATIONS = ["Buda inte", "Buda försiktigt", "Buda", "Starkt case"] as const;
const RISK_LEVELS = ["Låg", "Medel", "Hög", "Mycket hög"] as const;

const RECOMMENDATION_ALIASES: Record<string, (typeof RECOMMENDATIONS)[number]> = {
  "buda inte": "Buda inte",
  "don't bid": "Buda inte",
  "do not bid": "Buda inte",
  "buda försiktigt": "Buda försiktigt",
  "buda forsiktigt": "Buda försiktigt",
  "bid cautiously": "Buda försiktigt",
  "cautious": "Buda försiktigt",
  buda: "Buda",
  bid: "Buda",
  "starkt case": "Starkt case",
  "strong case": "Starkt case",
};

const RISK_ALIASES: Record<string, (typeof RISK_LEVELS)[number]> = {
  låg: "Låg",
  lag: "Låg",
  low: "Låg",
  medel: "Medel",
  medium: "Medel",
  mellan: "Medel",
  hög: "Hög",
  hog: "Hög",
  high: "Hög",
  "mycket hög": "Mycket hög",
  "mycket hog": "Mycket hög",
  "very high": "Mycket hög",
  "very high risk": "Mycket hög",
};

const DEFAULT_DISCLAIMER =
  "Detta är inte finansiell rådgivning. Gör alltid din egen bedömning och rådgör med bank och eventuellt en oberoende mäklare eller jurist innan du fattar beslut.";

const THIN_DATA_STRENGTH =
  "Begränsat underlag i formuläret — analysen bygger främst på adress och allmänna antaganden.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toInt(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value.replace(/\s/g, "").replace(",", "."));
    if (Number.isFinite(n)) return Math.round(n);
  }
  return fallback;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : String(item ?? "")).trim())
      .filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function normalizeRecommendation(value: unknown): (typeof RECOMMENDATIONS)[number] {
  if (typeof value === "string") {
    const exact = RECOMMENDATIONS.find((r) => r === value);
    if (exact) return exact;
    const alias = RECOMMENDATION_ALIASES[value.trim().toLowerCase()];
    if (alias) return alias;
  }
  return "Buda försiktigt";
}

function normalizeRiskLevel(value: unknown): (typeof RISK_LEVELS)[number] {
  if (typeof value === "string") {
    const exact = RISK_LEVELS.find((r) => r === value);
    if (exact) return exact;
    const alias = RISK_ALIASES[value.trim().toLowerCase()];
    if (alias) return alias;
  }
  return "Medel";
}

function normalizeMaxBid(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = toInt(value, NaN);
  if (!Number.isFinite(n) || n <= 0) return null;
  // AI returns millions as 7.5 instead of 7500000
  if (n > 0 && n < 100_000) return Math.round(n * 1_000_000);
  return n;
}

function normalizeBidStrategy(value: unknown): Scorecard["bidStrategy"] {
  const raw = isRecord(value) ? value : {};
  const field = (key: keyof Scorecard["bidStrategy"], fallback: string) => {
    const v = raw[key];
    return typeof v === "string" && v.trim() ? v.trim() : fallback;
  };

  return {
    openingMove: field("openingMove", "Utgå från ett försiktigt öppningsbud baserat på tillgänglig data."),
    nextStep: field("nextStep", "Håll budstegen små tills mer underlag finns på plats."),
    walkAwayPoint: field("walkAwayPoint", "Sätt en tydlig maxnivå innan budgivningen och håll dig till den."),
    negotiationNotes: field(
      "negotiationNotes",
      "Komplettera med annons, årsredovisning och budhistorik för en skarpare strategi."
    ),
  };
}

function normalizeCategoryScores(value: unknown): Scorecard["categoryScores"] {
  const raw = isRecord(value) ? value : {};
  const score = (key: keyof Scorecard["categoryScores"], fallback: number) => {
    const n = toInt(raw[key], fallback);
    return Math.min(100, Math.max(0, n));
  };

  return {
    price: score("price", 50),
    association: score("association", 50),
    condition: score("condition", 50),
    location: score("location", 50),
    liquidity: score("liquidity", 50),
    risk: score("risk", 50),
  };
}

/** Rätta vanliga AI-avvikelser innan Zod-validering. */
export function coerceScorecardInput(raw: unknown): unknown {
  if (!isRecord(raw)) return raw;

  const strengths = toStringArray(raw.strengths);
  const weaknesses = toStringArray(raw.weaknesses);
  const redFlags = toStringArray(raw.redFlags);
  const questionsToAsk = toStringArray(raw.questionsToAsk);

  const summary =
    typeof raw.summary === "string" && raw.summary.trim()
      ? raw.summary.trim()
      : "Analysen bygger på begränsat underlag. Komplettera med annons, pris, boyta och årsredovisning för en skarpare bedömning.";

  const oneSentenceSummary =
    typeof raw.oneSentenceSummary === "string" && raw.oneSentenceSummary.trim()
      ? raw.oneSentenceSummary.trim().slice(0, 150)
      : summary.slice(0, 150);

  return {
    score: Math.min(100, Math.max(0, toInt(raw.score, 50))),
    recommendation: normalizeRecommendation(raw.recommendation),
    riskLevel: normalizeRiskLevel(raw.riskLevel),
    maxBidSuggestion: normalizeMaxBid(raw.maxBidSuggestion),
    oneSentenceSummary,
    summary,
    strengths: strengths.length > 0 ? strengths : [THIN_DATA_STRENGTH],
    weaknesses:
      weaknesses.length > 0
        ? weaknesses
        : ["Begränsat underlag — pris, förening och underhåll kunde inte bedömas i detalj."],
    redFlags,
    questionsToAsk:
      questionsToAsk.length > 0
        ? questionsToAsk
        : [
            "Vad är utgångspris och nuvarande budnivå?",
            "Finns årsredovisning och underhållsplan att granska?",
            "Är stambyte eller större renoveringar planerade?",
            "Hur ser föreningens skuldsättning och avgiftsutveckling ut?",
          ],
    bidStrategy: normalizeBidStrategy(raw.bidStrategy),
    categoryScores: normalizeCategoryScores(raw.categoryScores),
    disclaimer:
      typeof raw.disclaimer === "string" && raw.disclaimer.trim()
        ? raw.disclaimer.trim()
        : DEFAULT_DISCLAIMER,
  };
}
