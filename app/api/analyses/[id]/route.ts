import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAnalysisUnlocked } from "@/lib/paywall";

const PAID_FIELDS = ["aiRawJson", "aiSummary", "aiMaxBidSuggestion", "aiScore", "aiRecommendation"] as const;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const analysis = await prisma.propertyAnalysis.findUnique({
    where: { id },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Analysen hittades inte." }, { status: 404 });
  }

  if (isAnalysisUnlocked(analysis)) {
    return NextResponse.json(analysis);
  }

  // Locked: the paid report must not be readable through the API.
  const locked: Record<string, unknown> = { ...analysis };
  for (const key of PAID_FIELDS) delete locked[key];
  return NextResponse.json(locked);
}
