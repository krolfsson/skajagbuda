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

const THIN_DATA_BOILERPLATE = /begränsat underlag|komplettera med annons/i;

function isThinDataBoilerplate(text: string): boolean {
  return THIN_DATA_BOILERPLATE.test(text);
}

function bulletLine(text: string): string {
  const cleaned = text.replace(/^[-•*]\s+/, "").trim();
  return cleaned ? `- ${cleaned}` : "";
}

function normalizeSummary(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    const text = value.trim();
    if (!isThinDataBoilerplate(text)) return text;
  }

  const bullets = toStringArray(value);
  if (bullets.length > 0) {
    return bullets
      .map(bulletLine)
      .filter(Boolean)
      .join("\n");
  }

  return null;
}

function buildSummaryFallback(strengths: string[], weaknesses: string[], redFlags: string[]): string {
  const points = [...weaknesses.slice(0, 3), ...redFlags.slice(0, 2), ...strengths.slice(0, 2)]
    .map((point) => point.replace(/^[-•*]\s+/, "").trim())
    .filter(Boolean);

  if (points.length > 0) {
    return points.map((point) => `- ${point}`).join("\n");
  }

  return "- Analys baserad på inskickat underlag.";
}

function deriveOneSentenceSummary(
  raw: unknown,
  summary: string,
  strengths: string[],
): string {
  if (typeof raw === "string" && raw.trim() && !isThinDataBoilerplate(raw)) {
    return raw.trim().slice(0, 150);
  }

  const summaryLines = summary
    .split(/\n/)
    .map((line) => line.replace(/^[-•*]\s+/, "").trim())
    .filter(Boolean);

  if (summaryLines[0] && !isThinDataBoilerplate(summaryLines[0])) {
    return summaryLines[0].slice(0, 150);
  }

  const strength = strengths.find((item) => item.trim() && !isThinDataBoilerplate(item));
  if (strength) {
    return strength.replace(/^[-•*]\s+/, "").slice(0, 150);
  }

  return "Sammanfattning baserad på inskickat objektunderlag.";
}

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
    nextStep: field("nextStep", "Håll budstegen små och vänta in svar på viktiga frågor innan du höjer."),
    walkAwayPoint: field("walkAwayPoint", "Sätt en tydlig maxnivå innan budgivningen och håll dig till den."),
    negotiationNotes: field(
      "negotiationNotes",
      "Använd svagheter och öppna frågor som förhandlingsunderlag innan slutbud."
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
    normalizeSummary(raw.summary) ??
    buildSummaryFallback(strengths, weaknesses, redFlags);

  const oneSentenceSummary = deriveOneSentenceSummary(raw.oneSentenceSummary, summary, strengths);

  return {
    score: Math.min(100, Math.max(0, toInt(raw.score, 50))),
    recommendation: normalizeRecommendation(raw.recommendation),
    riskLevel: normalizeRiskLevel(raw.riskLevel),
    maxBidSuggestion: normalizeMaxBid(raw.maxBidSuggestion),
    oneSentenceSummary,
    summary,
    strengths:
      strengths.length > 0
        ? strengths
        : ["Analys genomförd utifrån inskickat underlag."],
    weaknesses,
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
