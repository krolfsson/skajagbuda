import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scrapeBrokerListing } from "@/lib/broker-scrape";
import { checkRateLimit } from "@/lib/rateLimit";

const BodySchema = z.object({
  url: z.string().url("Ange en giltig http- eller https-länk."),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = checkRateLimit(`scrape:${ip}`, { limit: 10, windowSec: 60 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "För många förfrågningar. Vänta en stund." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ogiltigt JSON-format." }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ogiltig URL." },
      { status: 422 }
    );
  }

  try {
    const result = await scrapeBrokerListing(parsed.data.url);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[POST /api/scrape-listing]", err);
    return NextResponse.json(
      { error: "Kunde inte hämta mäklarsidan. Försök igen eller klistra in manuellt." },
      { status: 500 }
    );
  }
}
