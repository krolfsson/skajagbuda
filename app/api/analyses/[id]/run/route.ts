import { NextRequest, NextResponse } from "next/server";
import type { Scorecard } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { isAnalysisUnlocked } from "@/lib/paywall";
import { resolveScorecardForAnalysis } from "@/lib/risk-level";
import { AnalysisRunError, isStaleRun, runPropertyAnalysis } from "@/lib/run-property-analysis";

// AI call (+ one retry) plus enrichment can exceed the platform default.
export const maxDuration = 300;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL saknas i miljövariabler." }, { status: 500 });
  }
  if (!process.env.AI_API_KEY) {
    return NextResponse.json({ error: "AI_API_KEY saknas i miljövariabler." }, { status: 500 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = checkRateLimit(`run:${ip}`, { limit: 5, windowSec: 60 });
  if (!rl.success) {
    return NextResponse.json({ error: "För många AI-förfrågningar. Vänta en minut." }, { status: 429 });
  }

  const { id } = await params;

  const analysis = await prisma.propertyAnalysis.findUnique({ where: { id } });
  if (!analysis) {
    return NextResponse.json({ error: "Analysen hittades inte." }, { status: 404 });
  }

  const stale = isStaleRun(analysis);

  if (analysis.fullAnalysisStatus === "RUNNING" && !stale) {
    return NextResponse.json({ error: "Analysen körs redan." }, { status: 409 });
  }

  const unlocked = isAnalysisUnlocked(analysis);

  if (analysis.fullAnalysisStatus === "COMPLETED" && analysis.aiRawJson != null) {
    const scorecard = resolveScorecardForAnalysis(analysis);
    if (scorecard) {
      return NextResponse.json(runResponse(analysis.id, scorecard, unlocked, true));
    }
  }

  const isInitialRun =
    analysis.fullAnalysisStatus === "LOCKED" ||
    analysis.fullAnalysisStatus === "FAILED" ||
    stale;
  if (!isInitialRun && !unlocked) {
    return NextResponse.json({ error: "Analysen kräver betalning för omkörning." }, { status: 402 });
  }

  try {
    const result = await runPropertyAnalysis(analysis);
    return NextResponse.json(runResponse(analysis.id, result.scorecard, unlocked, false));
  } catch (err) {
    if (err instanceof AnalysisRunError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    console.error("[run]", err);
    return NextResponse.json({ error: "Internt serverfel." }, { status: 500 });
  }
}

/** The client only needs to know the run finished; the report itself is rendered server-side behind the paywall. */
function runResponse(
  id: string,
  scorecard: Scorecard,
  unlocked: boolean,
  cached: boolean
) {
  return unlocked
    ? { id, status: "COMPLETED", cached, scorecard }
    : { id, status: "COMPLETED", cached, riskLevel: scorecard.riskLevel };
}
