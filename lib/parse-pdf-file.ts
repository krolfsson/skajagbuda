import path from "node:path";
import { pathToFileURL } from "node:url";
import { sanitizeDbText } from "@/lib/sanitize-db-text";

// Polyfills DOMMatrix etc. required by pdfjs-dist in serverless Node.
import "pdf-parse/worker";

let workerConfigured = false;

async function getPdfParser() {
  const { PDFParse } = await import("pdf-parse");
  const { CanvasFactory } = await import("pdf-parse/worker");

  if (!workerConfigured && PDFParse.isNodeJS) {
    const workerPath = path.join(
      process.cwd(),
      "node_modules/pdf-parse/dist/pdf-parse/esm/pdf.worker.mjs"
    );
    PDFParse.setWorker(pathToFileURL(workerPath).href);
    workerConfigured = true;
  }

  return { PDFParse, CanvasFactory };
}

export async function extractTextFromUpload(
  file: File
): Promise<{ text: string; kind: "pdf" | "text" }> {
  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error("Filen är för stor. Max 10 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
    return { text: sanitizeDbText(buffer.toString("utf-8")), kind: "text" };
  }

  if (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  ) {
    const { PDFParse, CanvasFactory } = await getPdfParser();
    const parser = new PDFParse({ data: buffer, CanvasFactory });
    try {
      const result = await parser.getText();
      const text = sanitizeDbText(result.text?.trim() ?? "");
      if (!text) {
        throw new Error(
          "PDF-filen verkar vara tom eller innehåller bara bilder. Klistra in texten manuellt."
        );
      }
      return { text, kind: "pdf" };
    } finally {
      await parser.destroy();
    }
  }

  throw new Error("Ogiltig filtyp. Ladda upp PDF eller .txt.");
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  filename: string
): Promise<{ text: string; kind: "pdf" | "text" }> {
  const maxBytes = 10 * 1024 * 1024;
  if (buffer.length > maxBytes) {
    throw new Error("Filen är för stor. Max 10 MB.");
  }

  const lower = filename.toLowerCase();
  if (lower.endsWith(".txt")) {
    return { text: sanitizeDbText(buffer.toString("utf-8")), kind: "text" };
  }

  const { PDFParse, CanvasFactory } = await getPdfParser();
  const parser = new PDFParse({ data: buffer, CanvasFactory });
  try {
    const result = await parser.getText();
    const text = sanitizeDbText(result.text?.trim() ?? "");
    if (!text) {
      throw new Error("PDF verkar tom eller innehåller bara bilder.");
    }
    return { text, kind: "pdf" };
  } finally {
    await parser.destroy();
  }
}
