import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { isAnalysisUnlocked } from "@/lib/paywall";
import { resolveScorecardForAnalysis } from "@/lib/risk-level";
import { AnalysisRunError, runPropertyAnalysis } from "@/lib/run-property-analysis";

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

  if (analysis.fullAnalysisStatus === "RUNNING") {
    return NextResponse.json({ error: "Analysen körs redan." }, { status: 409 });
  }

  if (analysis.fullAnalysisStatus === "COMPLETED" && analysis.aiRawJson != null) {
    const scorecard = resolveScorecardForAnalysis(analysis);
    if (scorecard) {
      return NextResponse.json({ analysis, scorecard, cached: true });
    }
  }

  const isInitialRun =
    analysis.fullAnalysisStatus === "LOCKED" || analysis.fullAnalysisStatus === "FAILED";
  const isPaidRun = isAnalysisUnlocked(analysis);

  if (!isInitialRun && !isPaidRun) {
    return NextResponse.json({ error: "Analysen kräver betalning för omkörning." }, { status: 402 });
  }

  try {
    const result = await runPropertyAnalysis(analysis);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AnalysisRunError) {
      const status = err.code === "VALIDATION_FAILED" ? 502 : 502;
      return NextResponse.json(
        { error: err.message, details: err.details },
        { status }
      );
    }
    console.error("[run]", err);
    return NextResponse.json({ error: "Internt serverfel." }, { status: 500 });
  }
}
