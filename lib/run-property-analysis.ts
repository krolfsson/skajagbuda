import type { PropertyAnalysis } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createCompletion } from "@/lib/ai";
import { coerceScorecardInput } from "@/lib/coerce-scorecard";
import { buildUserPrompt, SYSTEM_PROMPT } from "@/lib/prompt";
import { ScorecardSchema, type Scorecard } from "@/lib/schemas";
import { fetchEnrichmentForAnalysis } from "@/lib/fetch-enrichment";
import { normalizeScorecardRisk } from "@/lib/risk-level";
import type { AiMessage } from "@/lib/ai";

function tryParseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export class AnalysisRunError extends Error {
  constructor(
    message: string,
    public readonly code: "AI_FAILED" | "INVALID_JSON" | "VALIDATION_FAILED",
    public readonly details?: unknown
  ) {
    super(message);
  }
}

async function requestScorecard(messages: AiMessage[]): Promise<Scorecard> {
  let rawResponse: string;
  try {
    rawResponse = await createCompletion({
      messages,
      temperature: 0.2,
      maxTokens: 8000,
      jsonMode: true,
    });
  } catch (err) {
    console.error("[analysis] createCompletion failed:", err);
    throw new AnalysisRunError("AI-anropet misslyckades. Försök igen.", "AI_FAILED");
  }

  const parsed = tryParseJson(rawResponse);
  if (!parsed) {
    console.error("[analysis] Invalid JSON from AI:", rawResponse.slice(0, 500));
    throw new AnalysisRunError("AI returnerade ogiltig JSON. Försök igen.", "INVALID_JSON");
  }

  const coerced = coerceScorecardInput(parsed);
  const validated = ScorecardSchema.safeParse(coerced);
  if (!validated.success) {
    console.error("[analysis] Scorecard validation failed:", validated.error.flatten());
    throw new AnalysisRunError("AI-svaret hade fel format.", "VALIDATION_FAILED", validated.error.flatten());
  }

  return validated.data;
}

/** Kör en enda fullständig analys — samma resultat används i gratis- och betalvy. */
export async function runPropertyAnalysis(
  analysis: PropertyAnalysis
): Promise<{ analysis: PropertyAnalysis; scorecard: Scorecard }> {
  await prisma.propertyAnalysis.update({
    where: { id: analysis.id },
    data: {
      fullAnalysisStatus: "RUNNING",
      freeAnalysisStatus: "RUNNING",
      analysisStatus: "RUNNING",
    },
  });

  const enrichment = await fetchEnrichmentForAnalysis(analysis);

  console.info("[analysis] enrichment", {
    id: analysis.id,
    listing: !!enrichment.listingHtml,
    comparables: !!enrichment.comparables,
    scb: !!enrichment.scbNote,
    hasListingText: !!analysis.listingText,
    hasAnnualReport: !!analysis.annualReportText,
  });

  const userPrompt = buildUserPrompt(analysis, enrichment);
  const baseMessages: AiMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ];

  let scorecard: Scorecard;
  try {
    scorecard = await requestScorecard(baseMessages);
  } catch (firstErr) {
    if (!(firstErr instanceof AnalysisRunError) || firstErr.code === "AI_FAILED") {
      await prisma.propertyAnalysis.update({
        where: { id: analysis.id },
        data: {
          fullAnalysisStatus: "FAILED",
          freeAnalysisStatus: "FAILED",
          analysisStatus: "FAILED",
        },
      });
      throw firstErr;
    }

    console.warn("[analysis] First attempt failed, retrying with correction prompt", {
      id: analysis.id,
      code: firstErr.code,
      details: firstErr.details,
    });

    try {
      scorecard = await requestScorecard([
        ...baseMessages,
        {
          role: "user",
          content:
            "Ditt förra svar kunde inte valideras. Returnera ENDAST ett komplett JSON-objekt med exakt den schema-struktur som beskrivs i systemprompten. Alla fält måste finnas inklusive bidIntervals, priceAnalysis, bidArguments, comparisonObjects, budgetContext och associationRiskSummary. score och categoryScores ska vara heltal 0–100. recommendation måste vara exakt en av: Buda inte, Buda försiktigt, Buda, Starkt case. riskLevel måste vara exakt en av: Låg, Medel, Hög, Mycket hög. strengths måste ha minst ett element. maxBidSuggestion får ALDRIG automatiskt spegla användarens maxbudget.",
        },
      ]);
    } catch (retryErr) {
      await prisma.propertyAnalysis.update({
        where: { id: analysis.id },
        data: {
          fullAnalysisStatus: "FAILED",
          freeAnalysisStatus: "FAILED",
          analysisStatus: "FAILED",
        },
      });
      throw retryErr;
    }
  }

  scorecard = normalizeScorecardRisk(scorecard);

  if (analysis.userMaxBudget) {
    scorecard = {
      ...scorecard,
      budgetContext: {
        ...scorecard.budgetContext,
        userMaxBudget: analysis.userMaxBudget,
      },
    };
  }

  const updated = await prisma.propertyAnalysis.update({
    where: { id: analysis.id },
    data: {
      fullAnalysisStatus: "COMPLETED",
      freeAnalysisStatus: "COMPLETED",
      analysisStatus: "COMPLETED",
      aiScore: scorecard.score,
      aiRecommendation: scorecard.recommendation,
      aiRiskLevel: scorecard.riskLevel,
      aiMaxBidSuggestion: scorecard.maxBidSuggestion,
      aiSummary: scorecard.summary,
      aiRawJson: scorecard as object,
      freeRiskLevel: scorecard.riskLevel,
      freeRawJson: { riskLevel: scorecard.riskLevel } as object,
    },
  });

  return { analysis: updated, scorecard };
}
