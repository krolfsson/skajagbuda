import type { ScrapeFieldKey } from "@/lib/broker-scrape-types";
import { sanitizeDbText } from "@/lib/sanitize-db-text";

export type MutableFields = Partial<Record<ScrapeFieldKey, string>>;
export type PdfCandidate = { url: string; label: string; score: number };

const ANNUAL_REPORT_RE =
  /årsredovis|arsredovis|bokslut|ekonomisk\s+plan|underhållsplan|underhallsplan|financial\s+statement/i;

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;|&#xA0;|&#160;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(parseInt(num, 10)));
}

export function parseSwedishInt(text: string): number | null {
  const cleaned = decodeHtmlEntities(text)
    .replace(/\s/g, "")
    .replace(/kr.*$/i, "")
    .replace(/(?:kvm|m²|m2).*$/i, "")
    .replace(",", ".");
  const direct = Number(cleaned);
  if (Number.isFinite(direct) && direct > 0) return Math.round(direct);
  const m = cleaned.match(/^(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

export function parseRooms(text: string): string | null {
  const m = decodeHtmlEntities(text).match(/(\d+(?:[.,]\d+)?)\s*(?:rok|rum)/i);
  if (!m) return null;
  return m[1].replace(",", ".");
}

const SINGLE_VALUE_FIELDS: ScrapeFieldKey[] = [
  "rooms",
  "floor",
  "totalFloors",
  "askingPrice",
  "monthlyFee",
  "livingAreaSqm",
];

export function isPlausibleField(key: ScrapeFieldKey, value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  if (!SINGLE_VALUE_FIELDS.includes(key) && v.length < 2) return false;

  switch (key) {
    case "askingPrice": {
      const n = Number(v);
      return Number.isFinite(n) && n >= 100_000 && n <= 100_000_000;
    }
    case "monthlyFee": {
      const n = Number(v);
      return Number.isFinite(n) && n >= 200 && n <= 50_000;
    }
    case "livingAreaSqm": {
      const n = Number(v);
      return Number.isFinite(n) && n >= 10 && n <= 500;
    }
    case "rooms": {
      const n = Number(v.replace(",", "."));
      return Number.isFinite(n) && n >= 1 && n <= 15;
    }
    case "floor":
    case "totalFloors": {
      const n = Number(v);
      return Number.isFinite(n) && n >= 0 && n <= 60;
    }
    case "address":
      return (
        v.length >= 5 &&
        v.length <= 90 &&
        /[A-ZÅÄÖa-zåäö]/.test(v) &&
        /\d/.test(v) &&
        !/^(er|med|närhet|strax|och|att|som|din|vår)\b/i.test(v)
      );
    case "associationName":
      return (
        v.length >= 3 &&
        v.length <= 120 &&
        !/^namn\s/i.test(v) &&
        (/brf|bostadsrätt|bostadsratts|förening|forening/i.test(v) ||
          /^[A-ZÅÄÖ]/.test(v))
      );
    case "area":
    case "city":
      return v.length >= 2 && v.length <= 60 && !/[<>{}]/.test(v);
    case "listingText":
      return v.length >= 80;
    case "annualReportText":
      return v.length >= 80;
    default:
      return true;
  }
}

export function setField(
  fields: MutableFields,
  key: ScrapeFieldKey,
  value: string | number | null | undefined,
  opts?: { overwrite?: boolean }
) {
  if (value == null || value === "") return;
  const str =
    typeof value === "number" ? String(value) : decodeHtmlEntities(String(value).trim());
  if (!str || (!opts?.overwrite && fields[key])) return;
  if (!isPlausibleField(key, str)) return;
  fields[key] = sanitizeDbText(str);
}

export function parseTitleForFields(title: string, fields: MutableFields) {
  const t = decodeHtmlEntities(title)
    .replace(/^Notar\s*[-–]\s*/i, "")
    .replace(/^Lägenhet\s+såld\s+på\s+/i, "")
    .replace(/\s+i\s+Stockholm.*$/i, "")
    .replace(/\s*[-–|]\s*Mäklarhuset.*$/i, "")
    .trim();

  const pipeParts = t.split(/\s*[-–|]\s*/);
  const head = pipeParts[0]?.trim();
  if (head && head.length >= 5) {
    const addr = head
      .replace(/\s*-\s*Lägenhet.*$/i, "")
      .replace(/\s*,\s*[^,]+$/, (m) => (/\d/.test(m) ? m : ""))
      .trim();
    if (addr && /\d/.test(addr)) setField(fields, "address", addr, { overwrite: true });
  }

  const roomsMatch = t.match(/(\d+(?:[.,]\d+)?)\s*rum/i);
  if (roomsMatch) setField(fields, "rooms", roomsMatch[1].replace(",", "."));

  const sqmMatch = t.match(/(\d+(?:[.,]\d+)?)\s*m²/i);
  if (sqmMatch) setField(fields, "livingAreaSqm", sqmMatch[1].replace(",", "."));

  parseFloorExpression(t, fields);

  const cityMatch = t.match(/,\s*([A-ZÅÄÖ][a-zåäö]+)\s*(?:[-–|]|$)/);
  if (cityMatch) setField(fields, "city", cityMatch[1]);
}

export function parseJsonLdProducts(node: unknown, fields: MutableFields) {
  const items = Array.isArray(node) ? node : [node];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;
    const type = obj["@type"];
    const types = Array.isArray(type) ? type : type ? [type] : [];
    if (!types.some((t) => /product|residence|apartment|house/i.test(String(t)))) continue;

    const name = typeof obj.name === "string" ? decodeHtmlEntities(obj.name) : "";
    if (name) setField(fields, "address", name.split(",")[0].trim());

    const location = typeof obj.location === "string" ? decodeHtmlEntities(obj.location) : "";
    if (location) setField(fields, "area", location);

    const desc = typeof obj.description === "string" ? decodeHtmlEntities(obj.description) : "";
    if (desc) {
      const roomsM = desc.match(/antal\s*rum[:\s]*(\d+(?:[.,]\d+)?)/i);
      const sqmM = desc.match(/boarea[:\s]*(\d+(?:[.,]\d+)?)/i);
      if (roomsM) setField(fields, "rooms", roomsM[1].replace(",", "."), { overwrite: true });
      if (sqmM) setField(fields, "livingAreaSqm", sqmM[1].replace(",", "."), { overwrite: true });
    }

    const d1 = typeof obj.description1 === "string" ? decodeHtmlEntities(obj.description1) : "";
    const d2 = typeof obj.description2 === "string" ? decodeHtmlEntities(obj.description2) : "";
    if (d1) {
      const rooms = parseRooms(d1);
      if (rooms) setField(fields, "rooms", rooms, { overwrite: true });
    }
    if (d2) {
      const sqm = parseSwedishInt(d2.replace(/m²|kvm/gi, ""));
      if (sqm) setField(fields, "livingAreaSqm", sqm);
    }

    const offers = obj.offers as Record<string, unknown> | undefined;
    if (offers && typeof offers.price === "string") {
      const price = parseSwedishInt(offers.price);
      if (price) setField(fields, "askingPrice", price);
    }
  }
}

export function parseMetaDescription(html: string, fields: MutableFields) {
  const sources = [
    html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1],
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1],
  ].filter(Boolean) as string[];

  for (const raw of sources) {
    const desc = decodeHtmlEntities(raw);
    const priceM =
      desc.match(/(\d[\d\s]{3,})\s*kr\s*utgångspris/i) ??
      desc.match(/utgångspris[.\s]*(\d[\d\s]{3,})\s*kr/i);
    if (priceM) setField(fields, "askingPrice", parseSwedishInt(priceM[1]), { overwrite: true });

    const sqmM = desc.match(/boarea\s*(\d+(?:[.,]\d+)?)\s*(?:kvm|m²)?/i);
    if (sqmM) setField(fields, "livingAreaSqm", sqmM[1].replace(",", "."), { overwrite: true });

    const roomsM =
      desc.match(/(\d+(?:[.,]\d+)?)\s*(?:rok|rum(?:\s*\+\s*kök)?)/i) ??
      desc.match(/antal\s*rum\s*(\d+(?:[.,]\d+)?)/i);
    if (roomsM) setField(fields, "rooms", roomsM[1].replace(",", "."), { overwrite: true });

    const locM = desc.match(/(?:lägenhet|bostad|villa)\s+i\s+([^,.]+)(?:,\s*([^,.]+))?/i);
    if (locM) {
      setField(fields, "area", locM[1].trim(), { overwrite: true });
      if (locM[2]) setField(fields, "city", locM[2].trim(), { overwrite: true });
    }
  }

  parseFastighetsbyranMeta(html, fields);
}

export function parseFastighetsbyranMeta(html: string, fields: MutableFields) {
  const meta = (prop: string) =>
    html.match(new RegExp(`property=["']${prop}["'][^>]*content=["']([^"']+)["']`, "i"))?.[1] ??
    html.match(new RegExp(`content=["']([^"']+)["'][^>]*property=["']${prop}["']`, "i"))?.[1];

  const area = meta("fb:område") ?? meta("fb:omrade");
  if (area) {
    const parts = decodeHtmlEntities(area).split(",");
    setField(fields, "area", parts[0]?.trim(), { overwrite: true });
    if (parts[1]) setField(fields, "city", parts[1].trim(), { overwrite: true });
  }

  const kommun = meta("fb:kommun");
  if (kommun) setField(fields, "city", decodeHtmlEntities(kommun).replace(/\s*kommun$/i, "").trim(), { overwrite: true });

  const rooms = meta("fb:antalrum");
  if (rooms) setField(fields, "rooms", rooms, { overwrite: true });

  const price = meta("fb:pris");
  if (price) setField(fields, "askingPrice", Number(price), { overwrite: true });
}

export function parseFloorExpression(text: string, fields: MutableFields) {
  const t = decodeHtmlEntities(text).trim();
  const avM = t.match(/(\d+)\s*av\s*(\d+)/i);
  if (avM) {
    setField(fields, "floor", avM[1], { overwrite: true });
    setField(fields, "totalFloors", avM[2], { overwrite: true });
    return;
  }
  const trM = t.match(/(\d+(?:[.,]\d+)?)\s*tr\b/i);
  if (trM) setField(fields, "floor", trM[1].replace(",", "."), { overwrite: true });
  const vanM = t.match(/v[aå]n\s*(\d+)/i);
  if (vanM) setField(fields, "floor", vanM[1], { overwrite: true });
}

function scopedListingHtml(html: string): string {
  const h1 = html.search(/<h1[^>]*>/i);
  if (h1 < 0) return html.slice(0, 90_000);
  return html.slice(h1, h1 + 90_000);
}

export function parseSwedishColonFacts(html: string, fields: MutableFields) {
  const chunk = decodeHtmlEntities(
    scopedListingHtml(html)
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
  );

  const rules: Array<{
    re: RegExp;
    apply: (value: string) => void;
  }> = [
    {
      re: /Antal\s*rum\s*:?\s*([^:]+?)(?=\s*(?:Boarea|Avgift|Våning|Pris|Slutpris|Månadsavgift|$))/gi,
      apply: (v) => {
        const rooms = parseRooms(v) ?? parseSwedishInt(v.replace(/\+.*$/, ""));
        if (rooms != null) setField(fields, "rooms", rooms, { overwrite: true });
      },
    },
    {
      re: /Boarea[^:]{0,12}\s*:?\s*([^:]+?)(?=\s*(?:Antal|Avgift|Våning|Pris|Slutpris|$))/gi,
      apply: (v) => {
        const sqm = parseSwedishInt(v);
        if (sqm) setField(fields, "livingAreaSqm", sqm, { overwrite: true });
      },
    },
    {
      re: /(?:Utgångspris|Pris)\s*:?\s*([^:]+?)(?=\s*(?:Antal|Boarea|Avgift|Våning|$))/gi,
      apply: (v) => {
        const price = parseSwedishInt(v);
        if (price) setField(fields, "askingPrice", price, { overwrite: true });
      },
    },
    {
      re: /Slutpris\s*:?\s*([^:]+?)(?=\s*(?:Antal|Boarea|Avgift|Våning|Pris|$))/gi,
      apply: (v) => {
        if (!fields.askingPrice) {
          const price = parseSwedishInt(v);
          if (price) setField(fields, "askingPrice", price, { overwrite: true });
        }
      },
    },
    {
      re: /(?:Månadsavgift|Avgift)\s*:?\s*([^:]+?)(?=\s*(?:Antal|Boarea|Våning|Pris|Slutpris|$))/gi,
      apply: (v) => {
        const fee = parseSwedishInt(v);
        if (fee) setField(fields, "monthlyFee", fee, { overwrite: true });
      },
    },
    {
      re: /(?:Våningsplan|Våning)\s*:?\s*([^:]+?)(?=\s*(?:Antal|Boarea|Avgift|Pris|Slutpris|Namn|$))/gi,
      apply: (v) => parseFloorExpression(v, fields),
    },
    {
      re: /Namn\s*:?\s*(Brf\s+[^:]+?)(?=\s*(?:Äkta|Allmänt|Månadsavgift|$))/gi,
      apply: (v) => setField(fields, "associationName", v.trim(), { overwrite: true }),
    },
  ];

  for (const { re, apply } of rules) {
    const m = chunk.match(re);
    if (m?.[1]) apply(m[1]);
  }

  const brfM =
    chunk.match(/\b(Brf\s+[A-ZÅÄÖa-zåäö][^\n,.]{2,50}?)(?:\s+(?:Organisationsnummer|Org\.|äger|är ))/i) ??
    chunk.match(/\b(Brf\s+[A-ZÅÄÖa-zåäö][A-ZÅÄÖa-zåäö0-9\s\-&]{2,40})/);
  if (brfM) setField(fields, "associationName", brfM[1].trim(), { overwrite: true });
}

export function parseHeadingValuePairs(html: string, fields: MutableFields) {
  const decoded = decodeHtmlEntities(html);
  const pairs = [
    ...decoded.matchAll(
      /<h[2-6][^>]*>\s*([^<]{2,30})\s*<\/h[2-6]>\s*<(?:span|p|div)[^>]*>\s*([^<]{1,80})/gi
    ),
  ];
  for (const [, label, value] of pairs) {
    const l = label.trim().toLowerCase();
    const v = value.trim();
    if (l === "antal rum") {
      setField(fields, "rooms", parseRooms(v) ?? parseSwedishInt(v.replace(/\+.*$/, "")), { overwrite: true });
    }
    if (l === "boarea" || l.startsWith("boarea")) {
      setField(fields, "livingAreaSqm", parseSwedishInt(v), { overwrite: true });
    }
    if (l === "pris" || l === "utgångspris" || l === "slutpris") {
      setField(fields, "askingPrice", parseSwedishInt(v), { overwrite: true });
    }
    if (l === "avgift" || l === "månadsavgift") {
      setField(fields, "monthlyFee", parseSwedishInt(v), { overwrite: true });
    }
    if (l === "våning" || l === "våningsplan") {
      parseFloorExpression(v, fields);
    }
  }
}

const URL_AREA_SKIP = new Set([
  "sv", "sverige", "till-salu", "tillsalu", "bostadsratt", "bostad", "bostader",
  "objekt", "homes", "hitta-hem", "stockholm", "stockholms-lan", "kommun",
  "lagenhet", "villa", "radhus", "fritidshus", "nyproduktion", "sodermalm",
  "tyreso", "jarfalla-kommun", "kopa", "salu", "buy-residence",
]);

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace(/\bOch\b/g, "och");
}

export function parseAreaFromUrl(url: string, fields: MutableFields) {
  try {
    const segments = new URL(url).pathname.split("/").filter(Boolean);
    const candidates = segments.filter((s) => {
      const lower = s.toLowerCase();
      if (URL_AREA_SKIP.has(lower)) return false;
      if (/^\d+$/.test(s) || /^obj/i.test(s) || /^[a-z0-9]{16,}$/i.test(s)) return false;
      if (s.length < 3 || s.length > 40) return false;
      return /^[a-zåäö0-9-]+$/i.test(s);
    });
    const areaSlug = candidates.at(-1) ?? candidates.at(-2);
    if (areaSlug && !fields.area) {
      setField(fields, "area", humanizeSlug(areaSlug), { overwrite: true });
    }
  } catch {
    /* ignore */
  }
}

export function parseSvenskfast(html: string, url: string, fields: MutableFields): PdfCandidate[] {
  const pdfs: PdfCandidate[] = [];
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
  if (title) {
    const t = decodeHtmlEntities(title);
    const floorM = t.match(/v[aå]n\s*(\d+)/i);
    if (floorM) setField(fields, "floor", floorM[1], { overwrite: true });
    const cityM = t.match(/,\s*v[aå]n\s*\d+,\s*([^|]+)/i);
    if (cityM) setField(fields, "city", cityM[1].trim(), { overwrite: true });
  }

  parseAreaFromUrl(url, fields);

  for (const m of html.matchAll(/href="(\/resurs\/dokument\/[^"]+)"/gi)) {
    const path = decodeHtmlEntities(m[1]);
    const abs = new URL(path, "https://www.svenskfast.se").toString();
    const label = path.split("/").pop() ?? "dokument";
    let score = 4;
    if (ANNUAL_REPORT_RE.test(path)) score += 5;
    pdfs.push({ url: abs, label, score });
  }

  return pdfs;
}

export function parseSkandiaMaklarna(html: string, url: string, fields: MutableFields): PdfCandidate[] {
  parseSwedishColonFacts(html, fields);
  parseAreaFromUrl(url, fields);

  const pdfs: PdfCandidate[] = [];
  for (const m of html.matchAll(/href="(https?:\/\/mspecsfiles[^"']+\.pdf)"/gi)) {
    const pdfUrl = m[1];
    let score = 4;
    if (ANNUAL_REPORT_RE.test(pdfUrl)) score += 5;
    pdfs.push({ url: pdfUrl, label: pdfUrl.split("/").pop() ?? "dokument.pdf", score });
  }
  return pdfs;
}

export function parseSvenskaMaklarhuset(html: string, url: string, fields: MutableFields): PdfCandidate[] {
  parseSwedishColonFacts(html, fields);
  parseAreaFromUrl(url, fields);

  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
  if (title) parseTitleForFields(title, fields);

  const pdfs: PdfCandidate[] = [];
  for (const m of html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = decodeHtmlEntities(m[1]).trim();
    const label = decodeHtmlEntities(m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    if (!/\.pdf|getfile|document|file\//i.test(href) && !ANNUAL_REPORT_RE.test(label)) continue;
    const abs = href.startsWith("http") ? href : new URL(href, url).toString();
    let score = 3;
    if (ANNUAL_REPORT_RE.test(label + abs)) score += 5;
    pdfs.push({ url: abs, label: label || "dokument", score });
  }
  return pdfs;
}

export function parseLabelValuePairs(html: string, fields: MutableFields) {
  const decoded = decodeHtmlEntities(html);

  const maklarPairs = [
    ...decoded.matchAll(
      /<h6[^>]*uk-width-1-2[^>]*uk-margin-remove[^>]*uk-h7[^>]*>\s*([^<]+?)\s*<\/h6>\s*<h6[^>]*uk-text-break[^>]*>\s*([^<]+?)\s*<\/h6>/gi
    ),
  ];
  for (const [, label, value] of maklarPairs) {
    const l = label.trim().toLowerCase();
    const v = value.trim();
    if (l === "boarea") setField(fields, "livingAreaSqm", parseSwedishInt(v.replace(/kvm/i, "")));
    if (l === "avgift") setField(fields, "monthlyFee", parseSwedishInt(v));
    if (l === "rum") setField(fields, "rooms", parseRooms(v) ?? parseSwedishInt(v));
    if (l === "våning" || l === "vaning") {
      const floorM = v.match(/(\d+)/);
      if (floorM) setField(fields, "floor", floorM[1]);
      const totalM = v.match(/(\d+)\s*$/);
      if (totalM) setField(fields, "totalFloors", totalM[1]);
    }
    if (/utgångspris|pris/i.test(l)) setField(fields, "askingPrice", parseSwedishInt(v));
  }

  const notarPairs = [
    ...decoded.matchAll(
      /<span class="label"[^>]*>([^<]+)<\/span>[\s\S]{0,120}?<span class="value"[^>]*>([^<]+)<\/span>/gi
    ),
  ];
  for (const [, label, value] of notarPairs) {
    const l = label.trim().toLowerCase();
    const v = value.trim();
    if (/slutpris|utgångspris|utgangspris/.test(l) && !/kvm/.test(l)) {
      setField(fields, "askingPrice", parseSwedishInt(v), { overwrite: true });
    }
    if (l === "boarea") setField(fields, "livingAreaSqm", parseSwedishInt(v), { overwrite: true });
    if (/antal rum/.test(l)) setField(fields, "rooms", parseRooms(v) ?? parseSwedishInt(v), { overwrite: true });
    if (l === "avgift") setField(fields, "monthlyFee", parseSwedishInt(v), { overwrite: true });
  }
}

export function parseHusmanNextData(html: string, fields: MutableFields): PdfCandidate[] {
  const pdfs: PdfCandidate[] = [];
  const match = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
  if (!match) return pdfs;

  let data: { props?: { pageProps?: { estateDetails?: Record<string, unknown> } } };
  try {
    data = JSON.parse(match[1]);
  } catch {
    return pdfs;
  }

  const estateDetails = data.props?.pageProps?.estateDetails as
    | Record<string, unknown>
    | undefined;
  if (!estateDetails) return pdfs;

  const estate = estateDetails.estate as Record<string, unknown> | undefined;
  const base = estate?.baseInformation as Record<string, unknown> | undefined;
  const details = estate?.details as Record<string, unknown> | undefined;
  const base2 = details?.baseInformation as Record<string, unknown> | undefined;
  const addr =
    (base?.address as Record<string, unknown> | undefined) ??
    (base2?.objectAddress as Record<string, unknown> | undefined);

  if (addr) {
    setField(fields, "address", addr.streetAddress as string);
    setField(fields, "city", addr.city as string);
    setField(fields, "area", addr.area as string);
  }

  setField(fields, "askingPrice", base?.startingPrice as number);
  setField(fields, "monthlyFee", (base?.monthlyFee ?? base2?.monthlyFee) as number);
  setField(fields, "rooms", (base?.numberOfRooms ?? (details?.interior as Record<string, unknown>)?.numberOfRooms) as number);

  const buildingArea = (base2?.buildningArea ?? base?.buildningArea) as
    | Record<string, unknown>
    | undefined;
  if (buildingArea?.area) setField(fields, "livingAreaSqm", buildingArea.area as number);

  const association = details?.association as Record<string, unknown> | undefined;
  const assocName =
    (association?.name as string | undefined) ??
    (association?.associationName as string | undefined);
  if (assocName) {
    setField(fields, "associationName", assocName, { overwrite: true });
  } else if (association?.generalAboutAssociation) {
    const about = String(association.generalAboutAssociation);
    const brfM = about.match(/(?:BRF|Brf|bostadsrättsföreningen)\s+([A-ZÅÄÖa-zåäö0-9\s-]{3,60})/i);
    if (brfM) setField(fields, "associationName", brfM[0].trim(), { overwrite: true });
  }

  const desc =
    (base?.shortDescription as string | undefined) ??
    ((details?.description as Record<string, unknown> | undefined)?.shortSellingDescription as
      | string
      | undefined);
  if (desc) setField(fields, "listingText", desc);

  const floorInfo = details?.floorAndElevator as Record<string, unknown> | undefined;
  if (floorInfo?.floor != null) setField(fields, "floor", floorInfo.floor as number);
  if (floorInfo?.totalNumberFloors != null) {
    setField(fields, "totalFloors", floorInfo.totalNumberFloors as number);
  }

  const docs = (details?.advertiseOn as Record<string, unknown> | undefined)?.documents as
    | Array<{ name?: string; url?: string; extension?: string }>
    | undefined;
  if (docs) {
    for (const doc of docs) {
      if (!doc.url) continue;
      let score = 1;
      const label = decodeHtmlEntities(doc.name ?? "dokument");
      if (doc.extension?.toLowerCase() === ".pdf" || /\.pdf/i.test(doc.url)) score += 2;
      if (ANNUAL_REPORT_RE.test(label + doc.url)) score += 5;
      pdfs.push({ url: doc.url, label, score });
    }
  }

  return pdfs;
}

export function parseErikOlsson(html: string, fields: MutableFields): PdfCandidate[] {
  const pdfs: PdfCandidate[] = [];
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];

  const ogDesc = html.match(
    /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
  )?.[1];
  if (ogDesc) setField(fields, "listingText", decodeHtmlEntities(ogDesc));

  const idx = html.indexOf('\\"home\\":{');
  if (idx >= 0) {
    const chunk = html
      .slice(idx, idx + 40_000)
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\")
      .replace(/\\u0026/g, "&");

    const finalPriceM = chunk.match(/"finalPrice":(\d{5,})/);
    const startingPriceM = chunk.match(/"startingPrice":(\d{5,})/);
    const priceM = chunk.match(/"price":(\d{5,})/);
    const price = finalPriceM?.[1] ?? startingPriceM?.[1] ?? priceM?.[1];
    if (price) setField(fields, "askingPrice", Number(price), { overwrite: true });

    const feeM = chunk.match(/"monthlyFee":(\d+)/) ?? chunk.match(/"monthly_fee":(\d+)/);
    if (feeM) setField(fields, "monthlyFee", Number(feeM[1]), { overwrite: true });

    const sqmM = chunk.match(/"living_area":(\d+)/) ?? chunk.match(/"size":(\d+)/);
    if (sqmM) setField(fields, "livingAreaSqm", Number(sqmM[1]), { overwrite: true });

    const roomsM = chunk.match(/"number_of_rooms":(\d+(?:\.\d+)?)/);
    if (roomsM) setField(fields, "rooms", roomsM[1], { overwrite: true });

    const cityM = chunk.match(/"city":"([^"]+)"/);
    if (cityM) setField(fields, "city", cityM[1], { overwrite: true });

    const areaM = chunk.match(/"area":"([^"]+)"/);
    if (areaM) setField(fields, "area", areaM[1], { overwrite: true });

    const brfM =
      chunk.match(/"name":"(Brf [^"]+)"/i) ??
      chunk.match(/"display_name":"([^"]*Brf[^"]*)"/i);
    if (brfM) setField(fields, "associationName", brfM[1], { overwrite: true });

    const floorM = chunk.match(/"floor":(\d+(?:\.\d+)?)/);
    if (floorM) setField(fields, "floor", floorM[1], { overwrite: true });

    const totalFloorsM = chunk.match(/"totalNumberOfFloors":(\d+)/);
    if (totalFloorsM && Number(totalFloorsM[1]) > 0) {
      setField(fields, "totalFloors", Number(totalFloorsM[1]), { overwrite: true });
    }

    for (const doc of chunk.matchAll(/"name":"([^"]+)"[^}]*"url":"([^"]+)"/gi)) {
      const label = doc[1];
      const url = doc[2];
      if (!/\.pdf|GetFile|file/i.test(url) && !ANNUAL_REPORT_RE.test(label)) continue;
      let score = 3;
      if (ANNUAL_REPORT_RE.test(label)) score += 5;
      pdfs.push({ url, label, score });
    }

    for (const pdf of chunk.matchAll(/https?:\/\/[^"'\s]+\.pdf/gi)) {
      const url = pdf[0];
      let score = 3;
      if (ANNUAL_REPORT_RE.test(url)) score += 5;
      pdfs.push({ url, label: url.split("/").pop() ?? "dokument.pdf", score });
    }
  }

  const interiorM = html.match(/\\"numberOfRooms\\":(\d+(?:\.\d+)?)/);
  if (interiorM) setField(fields, "rooms", interiorM[1], { overwrite: true });

  if (title) {
    const t = decodeHtmlEntities(title);
    const roomsMatch = t.match(/(\d+(?:[.,]\d+)?)\s*rum/i);
    if (roomsMatch) setField(fields, "rooms", roomsMatch[1].replace(",", "."), { overwrite: true });
    parseTitleForFields(title, fields);
  }

  return pdfs;
}

function extractNotarDataTestValue(html: string, testId: string): string | null {
  const re = new RegExp(
    `data-test="${testId}"[\\s\\S]{0,400}?<span class="value[^"]*"[^>]*>([^<]+)`,
    "i"
  );
  return html.match(re)?.[1]?.trim() ?? null;
}

function parseNotarNuxtPayload(html: string, objectId: string, fields: MutableFields) {
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => m[1])
    .filter((body) => body.includes(objectId));
  if (scripts.length === 0) return;

  const payload = scripts.find((body) => /"SEK"|monthlyFee|startingPrice/i.test(body)) ?? scripts[0];
  const idIdx = payload.indexOf(objectId);
  if (idIdx < 0) return;

  const chunk = payload.slice(Math.max(0, idIdx - 600), idIdx + 200);

  const feeM = chunk.match(/,\s*(\d{3,5})\s*,\s*"Bostadsrätt"/i);
  if (feeM) setField(fields, "monthlyFee", Number(feeM[1]), { overwrite: true });

  const priceM = chunk.match(/\b(\d{6,8})\b,\d+,"SEK"/);
  if (priceM) setField(fields, "askingPrice", Number(priceM[1]), { overwrite: true });
}

export function parseNotar(html: string, fields: MutableFields, objectId?: string) {
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1];
  if (h1) setField(fields, "address", decodeHtmlEntities(h1).trim(), { overwrite: true });

  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
  if (title) {
    const t = decodeHtmlEntities(title).replace(/^Notar\s*[-–]\s*/i, "").trim();
    const parts = t.split(",");
    const addr = parts[0]?.trim();
    if (addr) setField(fields, "address", addr, { overwrite: true });
    const area = parts[1]?.replace(/<\/title>.*/i, "").trim();
    if (area && !/notar/i.test(area)) {
      setField(fields, "area", area, { overwrite: true });
      setField(fields, "city", area, { overwrite: false });
    }
  }

  const livingSpace = extractNotarDataTestValue(html, "livingSpace");
  if (livingSpace) {
    setField(fields, "livingAreaSqm", parseSwedishInt(livingSpace), { overwrite: true });
  }

  const numberOfRooms = extractNotarDataTestValue(html, "numberOfRooms");
  if (numberOfRooms) {
    setField(
      fields,
      "rooms",
      parseRooms(numberOfRooms) ?? parseSwedishInt(numberOfRooms),
      { overwrite: true }
    );
  }

  const slutprisM = html.match(
    /Slutpris[\s\S]{0,250}?<span class="value[^"]*"[^>]*>([^<]+)/i
  );
  if (slutprisM) {
    setField(fields, "askingPrice", parseSwedishInt(slutprisM[1]), { overwrite: true });
  }

  const avgiftM =
    html.match(/data-test="other"[\s\S]{0,300}?Avgift[\s\S]{0,200}?<span class="value"[^>]*>([^<]+)/i) ??
    html.match(/>\s*Avgift\s*<[\s\S]{0,250}?<span class="value"[^>]*>([^<]+)/i);
  if (avgiftM) setField(fields, "monthlyFee", parseSwedishInt(avgiftM[1]), { overwrite: true });

  if (objectId) parseNotarNuxtPayload(html, objectId, fields);

  const priceM = html.match(/\b(\d{6,8})\b,\d+,"SEK"/);
  if (priceM) setField(fields, "askingPrice", Number(priceM[1]), { overwrite: true });

  const ogDesc = html.match(
    /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
  )?.[1];
  if (ogDesc) setField(fields, "listingText", decodeHtmlEntities(ogDesc));
}

const NESTOR_H2_SKIP_RE = /planlösning|planlosning|cookie|webbplats/i;

function looksLikeNestorStreet(text: string): boolean {
  return /\d/.test(text) && /gatan|vägen|vagen|gata|gränd|grand|plan|torg|torget|backen|stigen|stig|väg|vag/i.test(text);
}

export function parseNestor(html: string, fields: MutableFields): PdfCandidate[] {
  const pdfs: PdfCandidate[] = [];
  const decoded = decodeHtmlEntities(html);

  for (const [, rawLabel, rawValue] of html.matchAll(
    /fasad-info-item-label[^>]*>([\s\S]{0,80}?)<\/span>[\s\S]{0,120}?fasad-info-item-value[^>]*>([^<]+)/gi
  )) {
    const label = decodeHtmlEntities(rawLabel.replace(/<[^>]+>/g, "").trim()).toLowerCase();
    const value = decodeHtmlEntities(rawValue.trim());
    if (/^pris/.test(label)) setField(fields, "askingPrice", parseSwedishInt(value), { overwrite: true });
    if (/^avgift/.test(label)) setField(fields, "monthlyFee", parseSwedishInt(value), { overwrite: true });
    if (/antal rum/.test(label)) {
      setField(fields, "rooms", parseRooms(value) ?? parseSwedishInt(value), { overwrite: true });
    }
    if (/^storlek/.test(label)) {
      setField(fields, "livingAreaSqm", parseSwedishInt(value.replace(/m²|m2|m\b/gi, "")), {
        overwrite: true,
      });
    }
  }

  for (const h2 of html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi)) {
    const text = decodeHtmlEntities(h2[1].trim());
    if (!text || NESTOR_H2_SKIP_RE.test(text)) continue;
    if (looksLikeNestorStreet(text)) {
      setField(fields, "address", text, { overwrite: true });
    } else if (!fields.area) {
      setField(fields, "area", text, { overwrite: true });
      setField(fields, "city", "Stockholm", { overwrite: false });
    }
  }

  for (const [, label, value] of decoded.matchAll(
    />\s*([^<:]{2,30}):\s*<\/[^>]+>[\s\S]{0,120}?>\s*([^<]+?)\s*</gi
  )) {
    const l = label.trim().toLowerCase();
    const v = value.trim();
    if (l === "boarea") {
      setField(fields, "livingAreaSqm", parseSwedishInt(v.replace(/kvm|m²|m2/gi, "")), {
        overwrite: true,
      });
    }
    if (l === "rum") setField(fields, "rooms", parseRooms(v) ?? parseSwedishInt(v), { overwrite: true });
    if (l === "avgift") setField(fields, "monthlyFee", parseSwedishInt(v), { overwrite: true });
    if (l === "våningsplan" || l === "vaningsplan") {
      const floorM = v.match(/(\d+)/);
      if (floorM) setField(fields, "floor", floorM[1], { overwrite: true });
    }
  }

  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
  if (title) {
    const t = decodeHtmlEntities(title);
    const addrM = t.match(/Nestor Fastighetsmäkleri\s*-\s*([^-|–]+)/i);
    if (addrM?.[1]) setField(fields, "address", addrM[1].trim(), { overwrite: true });
  }

  const brfM = decoded.match(/\b(Brf\s+[A-ZÅÄÖa-zåäö0-9][A-ZÅÄÖa-zåäö0-9\s\-]*\d+)\b/i);
  if (brfM) setField(fields, "associationName", brfM[1].trim(), { overwrite: true });

  for (const m of html.matchAll(
    /<a[^>]+href=["']([^"']*crm\.fasad\.eu[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  )) {
    const url = decodeHtmlEntities(m[1]).trim();
    const label = decodeHtmlEntities(m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    let score = 4;
    if (ANNUAL_REPORT_RE.test(label)) score += 5;
    pdfs.push({ url, label: label || "dokument", score });
  }

  return pdfs;
}

export async function fetchNotarObject(objectId: string, fields: MutableFields) {
  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      Accept: "application/json",
      Referer: "https://www.notar.se/",
      Origin: "https://www.notar.se",
    };

    let data: Record<string, unknown> | undefined;
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetch(
        `https://data.notar.se/objects/${objectId}?locale=sv`,
        {
          headers,
          signal: AbortSignal.timeout(8000),
        }
      );
      if (res.ok) {
        data = (await res.json()) as Record<string, unknown>;
        break;
      }
      if (res.status >= 500 && attempt < 2) {
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
        continue;
      }
      return;
    }
    if (!data) return;

    setField(fields, "askingPrice", data.startingPrice as number, { overwrite: true });
    setField(fields, "monthlyFee", data.monthlyFee as number, { overwrite: true });
    setField(fields, "rooms", data.numberOfRooms as number, { overwrite: true });
    setField(fields, "livingAreaSqm", data.livingSpaceArea as number, { overwrite: true });

    const addr = data.address as Record<string, unknown> | undefined;
    if (addr) {
      setField(fields, "address", addr.streetAddress as string, { overwrite: true });
      setField(fields, "city", (addr.city ?? data.municipality) as string, { overwrite: true });
      setField(fields, "area", data.municipality as string, { overwrite: true });
    }

    const assoc = data.association as Record<string, unknown> | undefined;
    if (assoc?.name) setField(fields, "associationName", assoc.name as string);

    const descriptions = data.descriptions as Record<string, unknown> | undefined;
    const longDesc = descriptions?.longSellingDescription ?? descriptions?.shortSellingDescription;
    if (typeof longDesc === "string") setField(fields, "listingText", longDesc);

    const links = data.links as Array<{ url?: string; name?: string; category?: string }> | undefined;
    return links
      ?.filter((l) => l.url && (l.url.includes(".pdf") || ANNUAL_REPORT_RE.test((l.name ?? "") + l.url)))
      .map((l) => ({
        url: l.url!,
        label: l.name ?? "dokument",
        score: ANNUAL_REPORT_RE.test((l.name ?? "") + l.url) ? 7 : 3,
      }));
  } catch {
    return undefined;
  }
}

export function extractInlineJsonFragments(html: string, fields: MutableFields) {
  const patterns: Array<[ScrapeFieldKey, RegExp, (m: RegExpMatchArray) => string | number | null]> = [
    [
      "askingPrice",
      /"(?:askingPrice|startingPrice|listPrice|price|utgångspris)":(\d{5,})/gi,
      (m) => Number(m[1]),
    ],
    [
      "monthlyFee",
      /"(?:monthlyFee|monthly_fee|monthlyRent|fee)":(\d{2,5})/gi,
      (m) => Number(m[1]),
    ],
    [
      "livingAreaSqm",
      /"(?:livingArea|livingAreaSqm|livingSpaceArea|boarea|size)":(\d{1,3}(?:\.\d+)?)/gi,
      (m) => Number(m[1]),
    ],
    [
      "rooms",
      /"(?:numberOfRooms|number_of_rooms|rooms)":(\d{1,2}(?:\.\d+)?)/gi,
      (m) => m[1],
    ],
    [
      "address",
      /"(?:streetAddress|street_address|displayAddress)":"([^"]{5,90})"/gi,
      (m) => m[1],
    ],
    [
      "associationName",
      /"(?:associationName|housingCooperativeName|cooperativeName|brfName)":"([^"]{3,120})"/gi,
      (m) => m[1],
    ],
  ];

  for (const [key, re, map] of patterns) {
    const matches = [...html.matchAll(re)];
    for (const m of matches) {
      const val = map(m);
      if (val != null) setField(fields, key, val);
      if (fields[key]) break;
    }
  }
}

export function findPdfUrlsInText(text: string, baseUrl: string): PdfCandidate[] {
  const found = new Map<string, PdfCandidate>();
  const add = (raw: string, label?: string) => {
    const abs = raw.startsWith("http") ? raw : new URL(raw, baseUrl).toString();
    let score = abs.toLowerCase().includes(".pdf") ? 2 : 1;
    const lbl = decodeHtmlEntities(label ?? abs.split("/").pop() ?? "dokument");
    if (ANNUAL_REPORT_RE.test(abs + lbl)) score += 5;
    const existing = found.get(abs);
    if (!existing || score > existing.score) found.set(abs, { url: abs, label: lbl, score });
  };

  for (const m of text.matchAll(/https?:\/\/[^"'\s<>]+\.pdf[^"'\s<>]*/gi)) add(m[0]);
  for (const m of text.matchAll(/"(?:url|href|fileUrl|documentUrl)"\s*:\s*"([^"]+)"/gi)) {
    const url = decodeHtmlEntities(m[1]);
    if (/\.pdf|file|getfile|document/i.test(url)) add(url);
  }

  return [...found.values()];
}
