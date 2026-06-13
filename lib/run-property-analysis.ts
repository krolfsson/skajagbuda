import type { PropertyAnalysis } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createCompletion } from "@/lib/ai";
import { buildUserPrompt, SYSTEM_PROMPT } from "@/lib/prompt";
import { ScorecardSchema, type Scorecard } from "@/lib/schemas";
import { fetchEnrichmentForAnalysis } from "@/lib/fetch-enrichment";
import { normalizeScorecardRisk } from "@/lib/risk-level";

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

  let rawResponse: string;
  try {
    rawResponse = await createCompletion({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(analysis, enrichment) },
      ],
      temperature: 0.2,
      maxTokens: 6000,
      jsonMode: true,
    });
  } catch (err) {
    await prisma.propertyAnalysis.update({
      where: { id: analysis.id },
      data: {
        fullAnalysisStatus: "FAILED",
        freeAnalysisStatus: "FAILED",
        analysisStatus: "FAILED",
      },
    });
    console.error("[analysis] createCompletion failed:", err);
    throw new AnalysisRunError("AI-anropet misslyckades. Försök igen.", "AI_FAILED");
  }

  const parsed = tryParseJson(rawResponse);
  if (!parsed) {
    await prisma.propertyAnalysis.update({
      where: { id: analysis.id },
      data: {
        fullAnalysisStatus: "FAILED",
        freeAnalysisStatus: "FAILED",
        analysisStatus: "FAILED",
      },
    });
    throw new AnalysisRunError("AI returnerade ogiltig JSON. Försök igen.", "INVALID_JSON");
  }

  const validated = ScorecardSchema.safeParse(parsed);
  if (!validated.success) {
    await prisma.propertyAnalysis.update({
      where: { id: analysis.id },
      data: {
        fullAnalysisStatus: "FAILED",
        freeAnalysisStatus: "FAILED",
        analysisStatus: "FAILED",
      },
    });
    console.error("[analysis] Scorecard validation failed:", validated.error.flatten());
    throw new AnalysisRunError("AI-svaret hade fel format.", "VALIDATION_FAILED", validated.error.flatten());
  }

  const scorecard = normalizeScorecardRisk(validated.data);

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
