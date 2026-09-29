import { NextRequest, NextResponse } from "next/server";
import { extractTextFromUpload } from "@/lib/parse-pdf-file";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = checkRateLimit(`pdf:${ip}`, { limit: 10, windowSec: 60 });
  if (!rl.success) {
    return NextResponse.json({ error: "För många uppladdningar. Vänta en stund." }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Kunde inte läsa formulärdata." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Ingen fil angiven." }, { status: 400 });
  }

  try {
    const { text } = await extractTextFromUpload(file);
    return NextResponse.json({ text });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Kunde inte tolka filen.";
    console.error("[parse-pdf]", err);
    const status = message.includes("för stor") ? 413 : 422;
    return NextResponse.json({ error: message }, { status });
  }
}
