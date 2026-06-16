import type { BrokerScrapeResponse } from "@/lib/broker-scrape-types";

export type ScrapeStepId =
  | "fetch_page"
  | "read_listing"
  | "find_docs"
  | "read_docs"
  | "prepare";

export type ScrapeStepStatus = "pending" | "active" | "done" | "skipped";

export type ScrapeStep = {
  id: ScrapeStepId;
  label: string;
  status: ScrapeStepStatus;
  note?: string;
};

export const SCRAPE_PROGRESS_STEPS: Array<{ id: ScrapeStepId; label: string }> = [
  { id: "fetch_page", label: "Hämtar mäklarsidan" },
  { id: "read_listing", label: "Läser annonsen" },
  { id: "find_docs", label: "Letar efter dokument" },
  { id: "read_docs", label: "Läser årsredovisning och underlag" },
  { id: "prepare", label: "Förbereder din analys" },
];

/** Time-based simulation while the API request is in flight. */
export const SCRAPE_SIM_TIMINGS = [
  { ms: 0, activeIndex: 0 },
  { ms: 1800, activeIndex: 1 },
  { ms: 4500, activeIndex: 2 },
  { ms: 7500, activeIndex: 3 },
  { ms: 11000, activeIndex: 4 },
];

export function simulateScrapeSteps(activeIndex: number): ScrapeStep[] {
  return SCRAPE_PROGRESS_STEPS.map((step, i) => ({
    ...step,
    status: i < activeIndex ? "done" : i === activeIndex ? "active" : "pending",
  }));
}

function logMatches(logs: string[], patterns: RegExp[]) {
  return logs.some((line) => patterns.some((p) => p.test(line)));
}

function warnMatches(warnings: string[], patterns: RegExp[]) {
  return warnings.some((line) => patterns.some((p) => p.test(line)));
}

function hasListingData(result: BrokerScrapeResponse) {
  if (result.fieldStatus.listingText === "found") return true;
  const keys = ["address", "askingPrice", "monthlyFee", "livingAreaSqm", "rooms"] as const;
  return keys.filter((k) => result.fieldStatus[k] === "found").length >= 2;
}

export function deriveScrapeSteps(
  logs: string[],
  warnings: string[],
  result: BrokerScrapeResponse | null
): ScrapeStep[] {
  const steps: ScrapeStep[] = SCRAPE_PROGRESS_STEPS.map((s) => ({
    ...s,
    status: "pending",
  }));

  if (!result) return steps;

  const pageFetchFailed = warnMatches(warnings, [
    /Kunde inte hämta sidan/i,
    /Endast http\/https/i,
    /Ogiltig URL/i,
  ]);
  const pageFetched =
    logMatches(logs, [
      /Hämtar mäklarsida/i,
      /Booli API/i,
      /Hemnet-annons/i,
      /Booli-annons/i,
      /Mäklarsökning/i,
      /Analyserar sidans data/i,
    ]) || !pageFetchFailed;

  if (pageFetched && !pageFetchFailed) {
    steps[0].status = "done";
  } else if (pageFetchFailed) {
    steps[0].status = "skipped";
  } else {
    steps[0].status = "done";
  }

  const listingFound =
    logMatches(logs, [/Hittade annonstext/i, /Analyserar sidans data/i]) ||
    hasListingData(result);

  if (listingFound) {
    steps[1].status = "done";
  } else if (steps[0].status === "done") {
    steps[1].status = "skipped";
  }

  const docsFound = logMatches(logs, [/dokumentlänk/i]);
  const noDocs = warnMatches(warnings, [/Inga PDF-dokument/i]);

  if (docsFound) {
    steps[2].status = "done";
  } else if (noDocs || result.documents.length === 0) {
    steps[2].status = "skipped";
    steps[2].note = "Inga dokument hittades";
  } else if (steps[1].status === "done") {
    steps[2].status = "skipped";
    steps[2].note = "Inga dokument hittades";
  }

  const annualRead = logMatches(logs, [/Årsredovisning\/ekonomiskt underlag inläst/i]);
  const anyDocRead = logMatches(logs, [/Läste \d/i]) || result.documents.some((d) => d.extracted);
  const hasAnnualDoc = result.documents.some(
    (d) => d.kind === "annual_report" && d.extracted
  );

  if (annualRead || hasAnnualDoc) {
    steps[3].status = "done";
  } else if (anyDocRead) {
    steps[3].status = "done";
  } else if (steps[2].status === "skipped" || noDocs) {
    steps[3].status = "skipped";
    steps[3].note = "Underlag kan läggas till manuellt";
  } else if (docsFound) {
    steps[3].status = "skipped";
    steps[3].note = "Underlag kan läggas till manuellt";
  }

  steps[4].status = "done";

  return steps;
}

export type ScrapeSummary = {
  headline: string;
  intro: string;
  summaryLine: string;
  cta: string;
  partial: boolean;
};

export function buildScrapeSummary(result: BrokerScrapeResponse): ScrapeSummary {
  const hasListing = hasListingData(result);
  const docCount = result.documents.length;
  const extractedCount = result.documents.filter((d) => d.extracted).length;
  const hasAnnual = result.documents.some(
    (d) => d.kind === "annual_report" && d.extracted
  );
  const pageFailed = warnMatches(result.warnings, [/Kunde inte hämta sidan/i]);

  if (pageFailed && !hasListing) {
    return {
      headline: "Vi hittade delar av underlaget",
      intro:
        "Vi försökte läsa annonsen och hitta dokument som årsredovisning. Du kan kontrollera och komplettera allt i nästa steg.",
      summaryLine:
        "Vi kunde inte läsa sidan automatiskt. Du kan klistra in annonsen manuellt i nästa steg.",
      cta: "Komplettera uppgifter",
      partial: true,
    };
  }

  if (hasListing && hasAnnual) {
    const docPart =
      docCount > 1 ? ` och ${docCount} dokument` : docCount === 1 ? " och 1 dokument" : "";
    return {
      headline: "Underlag hämtat",
      intro:
        "Vi försökte läsa annonsen och hitta dokument som årsredovisning. Du kan kontrollera och komplettera allt i nästa steg.",
      summaryLine: `Hittade annonsdata${docPart}. Årsredovisning verkar finnas.`,
      cta: "Kontrollera uppgifter",
      partial: false,
    };
  }

  if (hasListing && extractedCount > 0 && !hasAnnual) {
    return {
      headline: "Underlag hämtat",
      intro:
        "Vi försökte läsa annonsen och hitta dokument som årsredovisning. Du kan kontrollera och komplettera allt i nästa steg.",
      summaryLine: `Hittade annonsdata och ${extractedCount} dokument. Ingen årsredovisning hittades automatiskt — du kan lägga till den manuellt i nästa steg.`,
      cta: "Kontrollera uppgifter",
      partial: true,
    };
  }

  if (hasListing && docCount === 0) {
    return {
      headline: "Vi hittade delar av underlaget",
      intro:
        "Vi försökte läsa annonsen och hitta dokument som årsredovisning. Du kan kontrollera och komplettera allt i nästa steg.",
      summaryLine:
        "Vi hittade annonsdata, men inga dokumentlänkar. Du kan komplettera manuellt.",
      cta: "Komplettera uppgifter",
      partial: true,
    };
  }

  if (hasListing) {
    return {
      headline: "Underlag hämtat",
      intro:
        "Vi försökte läsa annonsen och hitta dokument som årsredovisning. Du kan kontrollera och komplettera allt i nästa steg.",
      summaryLine: "Hittade annonsdata och ekonomiskt underlag.",
      cta: "Kontrollera uppgifter",
      partial: false,
    };
  }

  return {
    headline: "Vi hittade delar av underlaget",
    intro:
      "Vi försökte läsa annonsen och hitta dokument som årsredovisning. Du kan kontrollera och komplettera allt i nästa steg.",
    summaryLine:
      "Vi kunde läsa annonsen, men allt fanns inte tillgängligt. Du kan komplettera det som saknas i nästa steg.",
    cta: "Komplettera uppgifter",
    partial: true,
  };
}

/** Human-readable detail lines for the collapsible section. */
export function formatScrapeDetailLogs(
  logs: string[],
  warnings: string[],
  documents: BrokerScrapeResponse["documents"]
): string[] {
  const details: string[] = [];

  const docLinkLog = logs.find((l) => /dokumentlänk/i.test(l));
  if (docLinkLog) {
    const match = docLinkLog.match(/(\d+) dokument/);
    if (match) details.push(`Hittade ${match[1]} dokument`);
  }

  if (logs.some((l) => /Hittade annonstext/i.test(l))) {
    details.push("Hittade annonstext");
  }

  if (logs.some((l) => /Analyserar sidans data/i.test(l))) {
    details.push("Analyserade sidans data");
  }

  for (const doc of documents) {
    if (doc.extracted) {
      details.push(`Läste ${doc.label}`);
    }
  }

  if (warnMatches(warnings, [/Inga PDF-dokument/i])) {
    details.push("Inga dokumentlänkar hittades");
  }

  for (const w of warnings) {
    if (/Kunde inte läsa PDF/i.test(w)) {
      details.push(w.replace(/^Kunde inte läsa PDF /, "Kunde inte läsa "));
    }
  }

  if (logs.some((l) => /Årsredovisning\/ekonomiskt underlag inläst/i.test(l))) {
    if (!details.some((d) => /årsredovisning/i.test(d))) {
      details.push("Läste årsredovisning");
    }
  }

  return details;
}
