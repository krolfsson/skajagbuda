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

/**
 * Minimum data for a meaningful bid analysis: without asking price and living area
 * there is no price/kvm and no anchor for bid levels.
 */
export const ESSENTIAL_FIELD_KEYS = ["askingPrice", "livingAreaSqm"] as const satisfies readonly ScrapeFieldKey[];
/** Strongly recommended — needed for fee/kvm and monthly cost. */
export const RECOMMENDED_FIELD_KEYS = ["monthlyFee"] as const satisfies readonly ScrapeFieldKey[];

export type ListingSource = "hemnet" | "booli" | "broker";

export type BrokerScrapeResponse = {
  ok: boolean;
  url: string;
  /** Where the link points. */
  source?: ListingSource;
  /** The site answered with a bot challenge / access block — we do not try to get around it. */
  blocked?: boolean;
  /** Essential fields the import could not find. */
  missingEssentials?: ScrapeFieldKey[];
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
