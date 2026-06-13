import type { Scorecard } from "@/lib/schemas";
import { ScorecardSchema } from "@/lib/schemas";

export const RISK_LEVELS = ["Låg", "Medel", "Hög", "Mycket hög"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const SCORE_TO_RISK_THRESHOLDS = {
  low: 72,
  medium: 55,
  high: 38,
} as const;

export function isRiskLevel(value: string | null | undefined): value is RiskLevel {
  return !!value && (RISK_LEVELS as readonly string[]).includes(value);
}

/** Total score (0–100, högre = bättre case) → risknivå. */
export function deriveRiskLevelFromScore(score: number): RiskLevel {
  if (score >= SCORE_TO_RISK_THRESHOLDS.low) return "Låg";
  if (score >= SCORE_TO_RISK_THRESHOLDS.medium) return "Medel";
  if (score >= SCORE_TO_RISK_THRESHOLDS.high) return "Hög";
  return "Mycket hög";
}

export const SCORE_TO_RISK_GUIDANCE = `riskLevel ska följa total score (0–100, högre = bättre case):
- score 72–100 → Låg
- score 55–71 → Medel
- score 38–54 → Hög
- score 0–37 → Mycket hög`;

/** Säkerställ att risknivån matchar score — score är source of truth i betalrapporten. */
export function normalizeScorecardRisk(scorecard: Scorecard): Scorecard {
  const derived = deriveRiskLevelFromScore(scorecard.score);
  if (scorecard.riskLevel === derived) return scorecard;
  return { ...scorecard, riskLevel: derived };
}

export function resolveScorecardForAnalysis(analysis: {
  aiRawJson: unknown;
}): Scorecard | null {
  if (analysis.aiRawJson == null || typeof analysis.aiRawJson !== "object") {
    return null;
  }
  const parsed = ScorecardSchema.safeParse(analysis.aiRawJson);
  const scorecard = parsed.success ? parsed.data : (analysis.aiRawJson as Scorecard);
  return normalizeScorecardRisk(scorecard);
}

export function scorecardNeedsRiskSync(analysis: {
  aiRawJson: unknown;
}): boolean {
  if (analysis.aiRawJson == null || typeof analysis.aiRawJson !== "object") return false;
  const raw = analysis.aiRawJson as Scorecard;
  return raw.riskLevel !== deriveRiskLevelFromScore(raw.score);
}

/** Enda riskkälla: normaliserat scorecard, annars aiRiskLevel. */
export function getCanonicalRiskLevel(analysis: {
  aiRawJson: unknown;
  aiRiskLevel: string | null;
}): RiskLevel | null {
  const scorecard = resolveScorecardForAnalysis(analysis);
  if (scorecard) return scorecard.riskLevel;
  if (isRiskLevel(analysis.aiRiskLevel)) return analysis.aiRiskLevel;
  return null;
}
