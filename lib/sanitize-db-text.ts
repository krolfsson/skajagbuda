import type { CreateAnalysisInput } from "@/lib/schemas";

/** PostgreSQL UTF-8 text columns reject NUL (0x00) bytes. */
export function sanitizeDbText(value: string): string {
  return value.replace(/\0/g, "");
}

const ANALYSIS_TEXT_FIELDS: (keyof CreateAnalysisInput)[] = [
  "title",
  "address",
  "area",
  "city",
  "balconyDirection",
  "associationName",
  "plannedRenovations",
  "pipeReplacementDetails",
  "userNotes",
  "listingUrl",
  "listingText",
  "annualReportText",
  "biddingText",
  "agentInfoText",
];

export function sanitizeAnalysisInput(data: CreateAnalysisInput): CreateAnalysisInput {
  const out = { ...data };
  for (const key of ANALYSIS_TEXT_FIELDS) {
    const value = out[key];
    if (typeof value === "string") {
      (out as Record<string, unknown>)[key] = sanitizeDbText(value);
    }
  }
  return out;
}
