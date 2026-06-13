import { NextRequest, NextResponse } from "next/server";
import { extractTextFromUpload } from "@/lib/parse-pdf-file";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
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
