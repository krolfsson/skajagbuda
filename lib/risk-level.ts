import type { Scorecard } from "@/lib/schemas";
import { ScorecardSchema } from "@/lib/schemas";
import { coerceScorecardInput } from "@/lib/coerce-scorecard";

export const RISK_LEVELS = ["Låg", "Medel", "Hög", "Mycket hög"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const UNCERTAINTY_LEVELS = ["Låg", "Medel", "Hög"] as const;
export type UncertaintyLevel = (typeof UNCERTAINTY_LEVELS)[number];

export const SCORE_TO_RISK_THRESHOLDS = {
  low: 75,
  medium: 60,
  high: 45,
} as const;

const UNCERTAINTY_FLAG_PATTERNS = [
  /saknas/i,
  /saknar/i,
  /osäker/i,
  /ofullständ/i,
  /kräver/i,
  /kontrollera/i,
  /frågetecken/i,
  /begränsat underlag/i,
  /oklart/i,
  /måste verifieras/i,
  /saknar bekräft/i,
];

const SERIOUS_FLAG_PATTERNS = [
  /stambyte/i,
  /tomträtt/i,
  /avgiftshöj/i,
  /hög skuld/i,
  /skuldsätt/i,
  /kassaflöde/i,
  /negativ/i,
  /likviditet/i,
  /räntebind/i,
  /uppenbar/i,
  /allvarlig/i,
  /kritisk/i,
  />\s*8\s*%/,
  /mycket hög/i,
];

export function isRiskLevel(value: string | null | undefined): value is RiskLevel {
  return !!value && (RISK_LEVELS as readonly string[]).includes(value);
}

export function isUncertaintyLevel(value: string | null | undefined): value is UncertaintyLevel {
  return !!value && (UNCERTAINTY_LEVELS as readonly string[]).includes(value);
}

/** Poängbaserad risk — utgångspunkt innan röda flaggor och osäkerhet justeras. */
export function deriveRiskLevelFromScore(score: number): RiskLevel {
  if (score >= SCORE_TO_RISK_THRESHOLDS.low) return "Låg";
  if (score >= SCORE_TO_RISK_THRESHOLDS.medium) return "Medel";
  if (score >= SCORE_TO_RISK_THRESHOLDS.high) return "Medel";
  if (score >= 30) return "Hög";
  return "Mycket hög";
}

export function classifyRedFlags(flags: string[]): { serious: string[]; questions: string[] } {
  const serious: string[] = [];
  const questions: string[] = [];

  for (const flag of flags) {
    const text = flag.trim();
    if (!text) continue;

    if (SERIOUS_FLAG_PATTERNS.some((pattern) => pattern.test(text))) {
      serious.push(text);
    } else if (UNCERTAINTY_FLAG_PATTERNS.some((pattern) => pattern.test(text))) {
      questions.push(text);
    } else if (/hög risk|varning|riskabel/i.test(text)) {
      serious.push(text);
    } else {
      questions.push(text);
    }
  }

  return { serious, questions };
}

export function hasSeriousRedFlags(scorecard: Scorecard): boolean {
  return classifyRedFlags(scorecard.redFlags).serious.length > 0;
}

/** Hur osäkert är underlaget — separat från objektets risk. */
export function deriveUncertaintyLevel(scorecard: Scorecard): UncertaintyLevel {
  let signals = 0;

  if (scorecard.priceAnalysis.verdict === "Osäkert") signals += 1;
  if (scorecard.priceAnalysis.missingComparablesNote?.trim()) signals += 1;
  if (scorecard.bidIntervals.uncertaintyNote?.trim()) signals += 1;
  if (classifyRedFlags(scorecard.redFlags).questions.length > 0) signals += 1;
  if (scorecard.weaknesses.some((w) => UNCERTAINTY_FLAG_PATTERNS.some((p) => p.test(w)))) {
    signals += 1;
  }

  if (signals >= 3) return "Hög";
  if (signals >= 1) return "Medel";
  return "Låg";
}

/** Balanserad risknivå — score + faktiska röda flaggor, inte bara saknad data. */
export function deriveRiskLevelFromScorecard(scorecard: Scorecard): RiskLevel {
  let risk = deriveRiskLevelFromScore(scorecard.score);
  const serious = hasSeriousRedFlags(scorecard);

  if (!serious) {
    if (risk === "Mycket hög" || risk === "Hög") {
      risk = "Medel";
    }
  }

  if (risk === "Mycket hög" && classifyRedFlags(scorecard.redFlags).serious.length < 2) {
    risk = "Hög";
  }

  if (risk === "Låg") {
    if (serious || scorecard.weaknesses.length >= 4) {
      risk = "Medel";
    }
  }

  if (risk === "Hög" && !serious && scorecard.score >= 45) {
    risk = "Medel";
  }

  return risk;
}

export function reclassifyRedFlags(scorecard: Scorecard): Scorecard {
  const { serious, questions } = classifyRedFlags(scorecard.redFlags);
  if (questions.length === 0) {
    return { ...scorecard, redFlags: serious };
  }

  const existingWeaknesses = new Set(scorecard.weaknesses.map((w) => w.trim()));
  for (const question of questions) {
    if (!existingWeaknesses.has(question)) {
      existingWeaknesses.add(question);
    }
  }

  return {
    ...scorecard,
    redFlags: serious,
    weaknesses: [...scorecard.weaknesses, ...questions.filter((q) => !scorecard.weaknesses.includes(q))],
  };
}

export const SCORE_TO_RISK_GUIDANCE = `score (0–100, högre = bättre case) och riskLevel ska hänga ihop, men risknivån ska INTE bara spegla saknad data.

Poäng → risk (utgångspunkt):
- score 75–100 → Låg (om inga tydliga röda flaggor)
- score 60–74 → Medel
- score 45–59 → Medel (standard om frågetecken men inga allvarliga problem)
- score 30–44 → Hög endast om tydliga röda flaggor finns, annars Medel
- score 0–29 → Hög eller Mycket hög endast med tydlig motivering

uncertaintyLevel (Låg/Medel/Hög) — separat fält för osäkerhet i underlaget:
- Hög: mycket saknad data, inga jämförelser, osäker prisbild
- Medel: viss data saknas eller kräver verifiering
- Låg: tillräckligt underlag för bedömning

redFlags: endast tydliga, allvarliga problem (stambyte utan finansiering, hög skuld + avgiftshöjning, tomträtt med avgäldsrisk, etc.).
Saknad data och frågetecken hör hemma i weaknesses — inte redFlags.

Ton: mindre alarmistisk. Använd "Buda försiktigt" och "Medel risk" som normalfall. "Hög risk" kräver konkret motivering.`;

/** Normalisera risk, osäkerhet och flaggklassning efter AI-svar. */
export function normalizeScorecardRisk(scorecard: Scorecard): Scorecard {
  const reclassified = reclassifyRedFlags(scorecard);
  const uncertaintyLevel = isUncertaintyLevel(reclassified.uncertaintyLevel)
    ? reclassified.uncertaintyLevel
    : deriveUncertaintyLevel(reclassified);
  const riskLevel = deriveRiskLevelFromScorecard(reclassified);

  return { ...reclassified, riskLevel, uncertaintyLevel };
}

export function resolveScorecardForAnalysis(analysis: {
  aiRawJson: unknown;
}): Scorecard | null {
  if (analysis.aiRawJson == null || typeof analysis.aiRawJson !== "object") {
    return null;
  }
  const coerced = coerceScorecardInput(analysis.aiRawJson);
  const parsed = ScorecardSchema.safeParse(coerced);
  if (!parsed.success) {
    const fallback = ScorecardSchema.safeParse(analysis.aiRawJson);
    if (!fallback.success) return null;
    return normalizeScorecardRisk(fallback.data);
  }
  return normalizeScorecardRisk(parsed.data);
}

export function scorecardNeedsRiskSync(analysis: {
  aiRawJson: unknown;
}): boolean {
  const normalized = resolveScorecardForAnalysis(analysis);
  if (!normalized || analysis.aiRawJson == null || typeof analysis.aiRawJson !== "object") {
    return false;
  }
  const raw = analysis.aiRawJson as Scorecard;
  return (
    raw.riskLevel !== normalized.riskLevel ||
    raw.uncertaintyLevel !== normalized.uncertaintyLevel ||
    raw.redFlags.length !== normalized.redFlags.length
  );
}

export function getCanonicalRiskLevel(analysis: {
  aiRawJson: unknown;
  aiRiskLevel: string | null;
}): RiskLevel | null {
  const scorecard = resolveScorecardForAnalysis(analysis);
  if (scorecard) return scorecard.riskLevel;
  if (isRiskLevel(analysis.aiRiskLevel)) return analysis.aiRiskLevel;
  return null;
}
