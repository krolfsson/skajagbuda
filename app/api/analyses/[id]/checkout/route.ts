import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAppUrl, getStripe, FULL_ANALYSIS_PRICE_ORE, FULL_ANALYSIS_PRICE_SEK } from "@/lib/stripe";
import { STRIPE_PRODUCT_NAME } from "@/lib/brand";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe är inte konfigurerat. Lägg till STRIPE_SECRET_KEY i .env." },
      { status: 500 }
    );
  }

  const { id } = await params;
  const analysis = await prisma.propertyAnalysis.findUnique({ where: { id } });
  if (!analysis) {
    return NextResponse.json({ error: "Analysen hittades inte." }, { status: 404 });
  }

  if (analysis.freeAnalysisStatus !== "COMPLETED") {
    return NextResponse.json(
      { error: "Preliminär risknivå måste vara klar innan upplåsning." },
      { status: 400 }
    );
  }

  if (analysis.paymentStatus === "PAID" && analysis.analysisUnlocked) {
    return NextResponse.json({ error: "Analysen är redan upplåst." }, { status: 409 });
  }

  const appUrl = getAppUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "sek",
          unit_amount: FULL_ANALYSIS_PRICE_ORE,
          product_data: {
            name: STRIPE_PRODUCT_NAME,
            description: "Komplett scorecard med maxbud, budstrategi, föreningsrisk och röda flaggor.",
          },
        },
      },
    ],
    metadata: { analysisId: id },
    success_url: `${appUrl}/result/${id}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/result/${id}`,
  });

  await prisma.propertyAnalysis.update({
    where: { id },
    data: {
      paymentStatus: "PENDING",
      stripeCheckoutSessionId: session.id,
    },
  });

  return NextResponse.json({
    url: session.url,
    amount: FULL_ANALYSIS_PRICE_SEK,
  });
}
