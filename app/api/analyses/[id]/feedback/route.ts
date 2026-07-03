import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { resolveScorecardForAnalysis } from "@/lib/risk-level";

const FeedbackSchema = z.object({
  value: z.enum(["yes", "partial", "no"]),
  comment: z.string().max(2000).optional(),
});

const VALUE_MAP = {
  yes: "YES",
  partial: "PARTIAL",
  no: "NO",
} as const;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig JSON." }, { status: 400 });
  }

  const parsed = FeedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ogiltig feedback." }, { status: 422 });
  }

  const analysis = await prisma.propertyAnalysis.findUnique({
    where: { id },
    select: {
      id: true,
      address: true,
      title: true,
      aiRawJson: true,
      aiScore: true,
      aiRiskLevel: true,
    },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Analysen hittades inte." }, { status: 404 });
  }

  const scorecard = resolveScorecardForAnalysis(analysis);

  const feedback = await prisma.analysisFeedback.create({
    data: {
      analysisId: id,
      value: VALUE_MAP[parsed.data.value],
      comment: parsed.data.comment?.trim() || null,
      objectAddress: analysis.address ?? analysis.title,
      score: scorecard?.score ?? analysis.aiScore,
      riskLevel: scorecard?.riskLevel ?? analysis.aiRiskLevel,
      uncertaintyLevel: scorecard?.uncertaintyLevel ?? null,
    },
  });

  return NextResponse.json({ ok: true, id: feedback.id });
}
