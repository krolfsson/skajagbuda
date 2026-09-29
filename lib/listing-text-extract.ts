/**
 * Extracts listing facts from plain text the user pasted (copied from Hemnet, Booli,
 * a broker page or a prospectus PDF). Label-based only — values are never guessed.
 */
import type { ScrapeFieldKey } from "@/lib/broker-scrape-types";
import { setField, type MutableFields } from "@/lib/broker-scrape-parsers";

export type TextExtractResult = {
  fields: MutableFields;
  /** true/false only when the text states it explicitly; undefined = unknown. */
  hasBalcony?: boolean;
  hasElevator?: boolean;
  found: ScrapeFieldKey[];
};

/** Municipality names that end in "s" in their base form (no genitive s to strip). */
const NATIVE_S_RE = /(ås|as|näs|nas|fors|hus)$/i;

/** "Stockholms" → "Stockholm", "Västerås" → "Västerås". */
export function municipalityFromGenitive(name: string): string {
  const trimmed = name.trim();
  if (trimmed.endsWith("s") && !NATIVE_S_RE.test(trimmed)) return trimmed.slice(0, -1);
  return trimmed;
}

/** Parses Swedish money text: "4 950 000 kr", "4,95 milj", "4.950.000". */
export function parseSwedishMoney(raw: string): number | null {
  const text = raw.replace(/ | /g, " ").toLowerCase();
  const millions = text.match(/(\d+(?:[.,]\d+)?)\s*(?:milj|mkr|miljoner)/);
  if (millions) return Math.round(Number(millions[1].replace(",", ".")) * 1_000_000);
  const m = text.match(/\d{1,3}(?:[ .]\d{3})+|\d+/);
  if (!m) return null;
  const n = Number(m[0].replace(/[ .]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Parses "54,5 m²" / "54.5" → "54.5". */
function parseDecimal(raw: string): string | null {
  const m = raw.replace(/ /g, " ").match(/(\d+(?:[.,]\d+)?)/);
  if (!m) return null;
  const n = Number(m[1].replace(",", "."));
  return Number.isFinite(n) && n > 0 ? String(n) : null;
}

function parseFloor(raw: string, fields: MutableFields) {
  const v = raw.toLowerCase();
  const av = v.match(/(\d+(?:[.,]\d+)?)\s*(?:av|\/)\s*(\d+)/);
  if (av) {
    setField(fields, "floor", av[1].replace(",", "."));
    setField(fields, "totalFloors", av[2]);
    return;
  }
  if (/bottenvåning|bottenplan|\bbv\b|markplan/.test(v)) {
    setField(fields, "floor", "0");
    return;
  }
  const n = v.match(/(\d+(?:[.,]\d+)?)/);
  if (n) setField(fields, "floor", n[1].replace(",", "."));
}

function yesNo(raw: string): boolean | undefined {
  const v = raw.trim().toLowerCase();
  if (/^(ja|finns|yes)\b/.test(v)) return true;
  if (/^(nej|saknas|finns ej|ingen|no)\b/.test(v)) return false;
  return undefined;
}

type LabelRule = {
  label: RegExp;
  apply: (value: string, out: TextExtractResult) => void;
};

const RULES: LabelRule[] = [
  {
    // "Pris/m²" and "Pris per kvm" must not be read as the asking price.
    label: /^(utgångspris|utropspris|begärt pris|acceptpris|pris)(?!\s*(?:\/|per)\s*(?:m²|m2|kvm|kvadrat))\b/i,
    apply: (v, out) => setField(out.fields, "askingPrice", parseSwedishMoney(v)),
  },
  {
    label: /^(månadsavgift|avgift)\b/i,
    apply: (v, out) => {
      if (/\/\s*år|per år/i.test(v)) return;
      setField(out.fields, "monthlyFee", parseSwedishMoney(v));
    },
  },
  {
    label: /^(boarea|boyta|bostadsyta|storlek)\b/i,
    apply: (v, out) => setField(out.fields, "livingAreaSqm", parseDecimal(v)),
  },
  {
    label: /^(antal rum|rum)\b/i,
    apply: (v, out) => setField(out.fields, "rooms", parseDecimal(v)),
  },
  {
    label: /^(våning|våningsplan)\b/i,
    apply: (v, out) => {
      parseFloor(v, out.fields);
      if (/hiss finns|med hiss/i.test(v)) out.hasElevator = true;
      if (/hiss saknas|ej hiss|utan hiss/i.test(v)) out.hasElevator = false;
    },
  },
  {
    label: /^(förening|bostadsrättsförening|brf-namn)\b/i,
    apply: (v, out) => setField(out.fields, "associationName", v.replace(/\s{2,}.*/, "").trim()),
  },
  {
    label: /^(adress|gatuadress)\b/i,
    apply: (v, out) => setField(out.fields, "address", v.split(",")[0]),
  },
  {
    label: /^(område|stadsdel)\b/i,
    apply: (v, out) => setField(out.fields, "area", v.split(",")[0]),
  },
  {
    label: /^(kommun)\b/i,
    apply: (v, out) =>
      setField(out.fields, "city", municipalityFromGenitive(v.replace(/\s*(kommun|stad)$/i, ""))),
  },
  {
    label: /^balkong\b/i,
    apply: (v, out) => {
      const b = yesNo(v);
      if (b !== undefined) out.hasBalcony = b;
    },
  },
  {
    label: /^hiss\b/i,
    apply: (v, out) => {
      const b = yesNo(v);
      if (b !== undefined) out.hasElevator = b;
    },
  },
];

const ADDRESS_LINE_RE = /^[A-ZÅÄÖ][A-Za-zÅÄÖåäöéü.]+(?:[ -][A-Za-zÅÄÖåäöéü.]+){0,3}\s+\d+[A-Za-z]?(?:\s*[-–]\s*\d+)?(?:,.*)?$/;
const KOMMUN_RE = /([A-ZÅÄÖ][a-zåäöé]+(?:[ -][A-ZÅÄÖ][a-zåäöé]+)?)\s+(?:kommun|stad)\b/;

export function extractFieldsFromText(input: string): TextExtractResult {
  const out: TextExtractResult = { fields: {}, found: [] };
  const lines = input
    .replace(/\r/g, "")
    .replace(/ | /g, " ")
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const rule of RULES) {
      const m = line.match(rule.label);
      if (!m) continue;
      // Value on the same line ("Avgift: 3 200 kr/mån") or on the next line (Hemnet/Booli copy-paste).
      let value = line.slice(m[0].length).replace(/^\s*[:\-–]\s*/, "").trim();
      if (!value && i + 1 < lines.length) value = lines[i + 1];
      if (value) rule.apply(value, out);
      break;
    }
  }

  // Heading address ("Kungsklippan 12") within the first lines, followed by "Område, X kommun".
  if (!out.fields.address) {
    const idx = lines.slice(0, 20).findIndex((l) => ADDRESS_LINE_RE.test(l) && l.length <= 60);
    if (idx >= 0) {
      setField(out.fields, "address", lines[idx].split(",")[0]);
      const next = [lines[idx].split(",").slice(1).join(","), lines[idx + 1] ?? ""].join(" ");
      const areaM = next.match(/^\s*([A-ZÅÄÖ][^,]{1,40}),\s*[A-ZÅÄÖ][^,]*\b(?:kommun|stad)\b/);
      if (areaM) setField(out.fields, "area", areaM[1].trim());
    }
  }

  if (!out.fields.city) {
    const km = input.match(KOMMUN_RE);
    if (km) setField(out.fields, "city", municipalityFromGenitive(km[1]));
  }

  if (!out.fields.associationName) {
    const brf = input.match(/\b(Brf|BRF|Bostadsrättsföreningen)\s+([A-ZÅÄÖ0-9][\wÅÄÖåäöé.-]*(?:\s+(?:nr\s*)?\d+|\s+[A-ZÅÄÖ][\wåäöé.-]*){0,3})/);
    if (brf) setField(out.fields, "associationName", `${brf[1] === "Bostadsrättsföreningen" ? "Bostadsrättsföreningen" : "Brf"} ${brf[2]}`.trim());
  }

  out.found = (Object.keys(out.fields) as ScrapeFieldKey[]).filter((k) => out.fields[k]);
  return out;
}
