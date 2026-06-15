/** Fields we try to extract from a broker listing page. */
export const SCRAPE_FIELD_KEYS = [
  "address",
  "area",
  "city",
  "askingPrice",
  "monthlyFee",
  "livingAreaSqm",
  "rooms",
  "floor",
  "totalFloors",
  "associationName",
  "listingText",
  "annualReportText",
] as const;

export type ScrapeFieldKey = (typeof SCRAPE_FIELD_KEYS)[number];
export type FieldFillStatus = "found" | "missing";

export type BrokerScrapeResponse = {
  ok: boolean;
  url: string;
  form: Partial<Record<ScrapeFieldKey, string>>;
  fieldStatus: Record<ScrapeFieldKey, FieldFillStatus>;
  logs: string[];
  warnings: string[];
  documents: Array<{
    url: string;
    label: string;
    kind: "annual_report" | "other";
    extracted: boolean;
    charCount: number;
  }>;
};
