import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe är inte konfigurerat." }, { status: 500 });
  }

  const { id } = await params;
  let body: { sessionId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig request." }, { status: 400 });
  }

  const sessionId = body.sessionId;
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId saknas." }, { status: 400 });
  }

  const analysis = await prisma.propertyAnalysis.findUnique({ where: { id } });
  if (!analysis) {
    return NextResponse.json({ error: "Analysen hittades inte." }, { status: 404 });
  }

  if (analysis.paymentStatus === "PAID" && analysis.analysisUnlocked) {
    return NextResponse.json({ unlocked: true });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.metadata?.analysisId !== id) {
    return NextResponse.json({ error: "Session matchar inte analysen." }, { status: 400 });
  }

  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Betalningen är inte slutförd." }, { status: 402 });
  }

  await prisma.propertyAnalysis.update({
    where: { id },
    data: {
      paymentStatus: "PAID",
      analysisUnlocked: true,
      fullAnalysisStatus: analysis.fullAnalysisStatus === "COMPLETED" ? "COMPLETED" : "LOCKED",
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
    },
  });

  return NextResponse.json({ unlocked: true });
}
