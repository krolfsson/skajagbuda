import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateAnalysisSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const rl = checkRateLimit(`create:${ip}`, { limit: 20, windowSec: 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "För många förfrågningar. Försök igen om en stund." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Ogiltigt JSON-format." }, { status: 400 });
    }

    const parsed = CreateAnalysisSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Valideringsfel.", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const d = parsed.data;

    const analysis = await prisma.propertyAnalysis.create({
      data: {
        title: d.title,
        address: d.address,
        area: d.area,
        city: d.city,
        askingPrice: d.askingPrice,
        currentBid: d.currentBid,
        monthlyFee: d.monthlyFee,
        livingAreaSqm: d.livingAreaSqm,
        rooms: d.rooms,
        floor: d.floor,
        totalFloors: d.totalFloors,
        hasBalcony: d.hasBalcony ?? false,
        balconyDirection: d.balconyDirection,
        hasElevator: d.hasElevator ?? false,
        hasFireplace: d.hasFireplace ?? false,
        associationName: d.associationName,
        associationDebtPerSqm: d.associationDebtPerSqm,
        associationCash: d.associationCash,
        associationAnnualFeeChangePercent: d.associationAnnualFeeChangePercent,
        ownershipShare: d.ownershipShare,
        plannedRenovations: d.plannedRenovations,
        upcomingPipeReplacement: d.upcomingPipeReplacement ?? false,
        pipeReplacementDetails: d.pipeReplacementDetails,
        userMaxBudget: d.userMaxBudget,
        userDownPayment: d.userDownPayment,
        userMonthlyComfortLimit: d.userMonthlyComfortLimit,
        userNotes: d.userNotes,
        listingUrl: d.listingUrl || undefined,
        listingText: d.listingText,
        annualReportText: d.annualReportText,
        biddingText: d.biddingText,
        agentInfoText: d.agentInfoText,
      },
    });

    return NextResponse.json({ id: analysis.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/analyses]", err);
    const msg = err instanceof Error ? err.message : "Internt serverfel.";
    const isDatabaseError =
      msg.includes("DATABASE_URL") ||
      msg.includes("connect") ||
      msg.includes("prisma");
    return NextResponse.json(
      {
        error: isDatabaseError
          ? "Databasen är inte konfigurerad. Kontrollera DATABASE_URL i .env."
          : "Internt serverfel. Försök igen.",
      },
      { status: 500 }
    );
  }
}
