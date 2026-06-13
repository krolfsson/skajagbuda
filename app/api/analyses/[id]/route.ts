import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  return NextResponse.json(analysis);
}
