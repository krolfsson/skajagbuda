"use client";

import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { extractFieldsFromText, type TextExtractResult } from "@/lib/listing-text-extract";

/** Vercel rejects request bodies above ~4.5 MB, so larger PDFs never reach the parser. */
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const ANNUAL_REPORT_RE = /årsredovisning|förvaltningsberättelse|resultaträkning|balansräkning/i;

const FIELD_LABELS: Record<string, string> = {
  address: "adress",
  area: "område",
  city: "stad",
  askingPrice: "utgångspris",
  monthlyFee: "avgift",
  livingAreaSqm: "boarea",
  rooms: "rum",
  floor: "våning",
  totalFloors: "antal våningar",
  associationName: "förening",
};

export type ImportedText = {
  extract: TextExtractResult;
  text: string;
  kind: "listing" | "annual_report";
};

export function ImportFallback({
  headline,
  message,
  onImport,
}: {
  headline: string;
  message: string;
  /** Returns the field keys that were actually filled (empty fields only). */
  onImport: (imported: ImportedText) => string[];
}) {
  const [pasted, setPasted] = useState("");
  const [status, setStatus] = useState<{ tone: "ok" | "warn" | "error"; text: string } | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function report(filled: string[], source: string) {
    if (filled.length > 0) {
      setStatus({
        tone: "ok",
        text: `${source}: fyllde i ${filled.map((k) => FIELD_LABELS[k] ?? k).join(", ")}. Kontrollera värdena nedan.`,
      });
    } else {
      setStatus({
        tone: "warn",
        text: `${source} är sparad som underlag till analysen, men vi hittade inga nya uppgifter att fylla i automatiskt. Fyll i utgångspris och boarea nedan.`,
      });
    }
  }

  function handlePaste() {
    const text = pasted.trim();
    if (text.length < 20) {
      setStatus({ tone: "error", text: "Klistra in hela annonstexten (minst ett par rader)." });
      return;
    }
    const filled = onImport({ extract: extractFieldsFromText(text), text, kind: "listing" });
    trackEvent("import_fallback_used", { method: "paste", filled: filled.length });
    report(filled, "Annonstexten");
    setPasted("");
  }

  async function handleFile(file: File) {
    setStatus(null);
    if (file.size > MAX_UPLOAD_BYTES) {
      setStatus({
        tone: "error",
        text: "Filen är större än 4 MB. Öppna PDF:en, markera texten och klistra in den i rutan ovan i stället.",
      });
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/parse-pdf", { method: "POST", body });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.text) {
        throw new Error(data?.error ?? "Kunde inte läsa filen.");
      }
      const text = String(data.text);
      const kind = ANNUAL_REPORT_RE.test(text.slice(0, 20_000)) ? "annual_report" : "listing";
      const filled = onImport({ extract: extractFieldsFromText(text), text, kind });
      trackEvent("import_fallback_used", { method: "pdf", filled: filled.length });
      report(filled, kind === "annual_report" ? "Årsredovisningen" : "Dokumentet");
    } catch (err) {
      setStatus({
        tone: "error",
        text: `${err instanceof Error ? err.message : "Kunde inte läsa filen."} Du kan klistra in texten i stället.`,
      });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="import-fallback" role="region" aria-label="Komplettera underlag">
      <p className="import-fallback__title">{headline}</p>
      <p className="import-fallback__text">{message}</p>

      <label className="import-fallback__label" htmlFor="import-fallback-paste">
        1. Klistra in annonstexten
      </label>
      <p className="analysis-hint" style={{ marginTop: 0, marginBottom: "6px" }}>
        Öppna annonsen, markera allt (Ctrl/Cmd + A), kopiera och klistra in här. Vi läser av pris,
        avgift, boarea, rum, våning och förening.
      </p>
      <textarea
        id="import-fallback-paste"
        className="import-fallback__textarea"
        value={pasted}
        onChange={(e) => setPasted(e.target.value)}
        placeholder="Klistra in annonstexten här…"
      />
      <button type="button" className="btn-secondary-sm btn-secondary-sm--brand" onClick={handlePaste}>
        Läs av texten
      </button>

      {status && (
        <p className={`import-fallback__status import-fallback__status--${status.tone}`} role="status">
          {status.text}
        </p>
      )}

      <p className="import-fallback__label" style={{ marginTop: "14px" }}>
        2. Eller ladda upp prospekt / årsredovisning (PDF)
      </p>
      <label className={`btn-secondary-sm import-fallback__file-button${uploading ? " is-busy" : ""}`}>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf,.pdf,text/plain,.txt"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFileName(file.name);
              void handleFile(file);
            }
          }}
          className="import-fallback__file"
        />
        {uploading ? "Läser dokumentet…" : "Välj PDF-fil"}
      </label>
      {fileName && !uploading && <p className="analysis-hint">{fileName}</p>}
      <p className="analysis-hint">Max 4 MB. Är filen större — kopiera texten och klistra in ovan.</p>

      <p className="import-fallback__label" style={{ marginTop: "14px", marginBottom: 0 }}>
        3. Eller fyll i uppgifterna direkt nedan
      </p>
    </div>
  );
}
