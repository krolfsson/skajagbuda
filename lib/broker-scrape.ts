import { extractTextFromBuffer } from "@/lib/parse-pdf-file";
import {
  isAggregatorUrl,
  resolveAggregatorListing,
  type AggregatorResolveResult,
} from "@/lib/aggregator-listing";
import type {
  BrokerScrapeResponse,
  FieldFillStatus,
  ScrapeFieldKey,
} from "@/lib/broker-scrape-types";
import { SCRAPE_FIELD_KEYS } from "@/lib/broker-scrape-types";
import {
  decodeHtmlEntities,
  extractInlineJsonFragments,
  findPdfUrlsInText,
  parseErikOlsson,
  parseHusmanNextData,
  parseJsonLdProducts,
  parseLabelValuePairs,
  parseMetaDescription,
  parseNotar,
  parseNestor,
  parseSwedishColonFacts,
  parseHeadingValuePairs,
  parseAreaFromUrl,
  parseSvenskfast,
  parseSkandiaMaklarna,
  parseSvenskaMaklarhuset,
  parseStadshem,
  sanitizePdfUrl,
  parseRooms,
  parseSwedishInt,
  parseTitleForFields,
  fetchNotarObject,
  setField,
  type MutableFields,
  type PdfCandidate,
} from "@/lib/broker-scrape-parsers";

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/pdf,*/*",
  "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.8",
};

const ANNUAL_REPORT_RE =
  /årsredovis|arsredovis|bokslut|ekonomisk\s+plan|underhållsplan|underhallsplan|financial\s+statement/i;

const FIELD_KEY_ALIASES: Record<ScrapeFieldKey, string[]> = {
  address: [
    "streetaddress",
    "street",
    "address",
    "gatuadress",
    "objectaddress",
    "locationname",
    "postallocation",
    "displayaddress",
    "objectaddressstreet",
  ],
  area: ["area", "district", "suburb", "stadsdel", "omrade", "neighbourhood", "municipalityname"],
  city: ["city", "municipality", "kommun", "postallocation"],
  askingPrice: [
    "askingprice",
    "listprice",
    "price",
    "utgangspris",
    "startingprice",
    "salesprice",
    "begartpris",
    "startingprice",
  ],
  monthlyFee: ["monthlyfee", "fee", "avgift", "monthlyrent", "manadsavgift", "monthlyfeeinfinformation"],
  livingAreaSqm: [
    "livingarea",
    "livingareasqm",
    "livingspacearea",
    "sqm",
    "boarea",
    "size",
    "area_sqm",
    "buildingarea",
  ],
  rooms: ["rooms", "numberofrooms", "roomcount", "antalrum", "numberrooms"],
  floor: ["floor", "vaning", "storey", "floornumber"],
  totalFloors: ["totalfloors", "floors", "numberoffloors", "maxfloor", "totalnumberfloors"],
  associationName: [
    "associationname",
    "housingcoop",
    "housingassociation",
    "housingcooperativename",
    "brf",
    "bostadsrattsforening",
    "forening",
    "coopname",
  ],
  listingText: [
    "description",
    "body",
    "listingtext",
    "objectdescription",
    "saljtext",
    "shortsellingdescription",
    "longsellingdescription",
    "shortdescription",
  ],
  annualReportText: [],
};

function emptyStatus(): Record<ScrapeFieldKey, FieldFillStatus> {
  return Object.fromEntries(SCRAPE_FIELD_KEYS.map((k) => [k, "missing"])) as Record<
    ScrapeFieldKey,
    FieldFillStatus
  >;
}

function resolveUrl(href: string, base: string): string | null {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function walkJsonForFields(node: unknown, fields: MutableFields, depth = 0) {
  if (depth > 12 || node == null) return;
  if (typeof node !== "object") return;

  if (Array.isArray(node)) {
    for (const item of node) walkJsonForFields(item, fields, depth + 1);
    return;
  }

  for (const [rawKey, val] of Object.entries(node as Record<string, unknown>)) {
    const nk = normalizeKey(rawKey);

    for (const [field, aliases] of Object.entries(FIELD_KEY_ALIASES) as [
      ScrapeFieldKey,
      string[],
    ][]) {
      if (!aliases.includes(nk)) continue;
      if (typeof val === "string" && val.length > 0 && val.length < 8000) {
        const decoded = decodeHtmlEntities(val);
        if (field === "askingPrice" || field === "monthlyFee") {
          const n = parseSwedishInt(decoded);
          if (n) setField(fields, field, n);
        } else if (field === "livingAreaSqm") {
          const n = parseSwedishInt(decoded.replace(/m²|kvm/gi, ""));
          if (n) setField(fields, field, n);
        } else if (field === "rooms") {
          setField(fields, field, parseRooms(decoded) ?? decoded);
        } else {
          setField(fields, field, decoded);
        }
      } else if (typeof val === "number" && Number.isFinite(val)) {
        if (field === "askingPrice" || field === "monthlyFee" || field === "livingAreaSqm") {
          setField(fields, field, val);
        } else if (field === "rooms") {
          setField(fields, field, val);
        } else if (field === "floor" || field === "totalFloors") {
          setField(fields, field, val);
        }
      }
    }

    if (typeof val === "object") walkJsonForFields(val, fields, depth + 1);
  }
}

function extractJsonBlobs(html: string): unknown[] {
  const blobs: unknown[] = [];

  const nextMatch = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
  if (nextMatch) {
    try {
      blobs.push(JSON.parse(nextMatch[1]));
    } catch {
      /* skip */
    }
  }

  const nuxtMatch = html.match(/window\.__NUXT__\s*=\s*(\{[\s\S]*?\});?\s*<\/script>/i);
  if (nuxtMatch) {
    try {
      blobs.push(JSON.parse(nuxtMatch[1]));
    } catch {
      /* skip */
    }
  }

  const ldRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let ld: RegExpExecArray | null;
  while ((ld = ldRegex.exec(html)) !== null) {
    try {
      blobs.push(JSON.parse(decodeHtmlEntities(ld[1])));
    } catch {
      /* skip */
    }
  }

  const jsonScripts = html.matchAll(
    /<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gi
  );
  for (const m of jsonScripts) {
    try {
      blobs.push(JSON.parse(m[1]));
    } catch {
      /* skip */
    }
  }

  return blobs;
}

function extractHtmlTextFacts(html: string, fields: MutableFields) {
  const text = decodeHtmlEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
  );

  const patterns: Array<[ScrapeFieldKey, RegExp]> = [
    ["askingPrice", /(?:utgångspris|utgangspris|begärt pris|slutpris|pris\s*\(utgångspris\)|\bpris)\s*[:\s]+([0-9\s]{4,})\s*kr/i],
    ["monthlyFee", /(?:månadsavgift|manadsavgift|avgift)[:\s]*([0-9\s]{2,})\s*kr/i],
    ["livingAreaSqm", /(?:boarea|boyta|bo\s*area)[:\s]*([0-9]+(?:[.,][0-9]+)?)\s*(?:m²|kvm)?/i],
    ["rooms", /(?:antal rum|antal\s*rum)[:\s]*([0-9]+(?:[.,][0-9]+)?)\s*(?:rok|rum)?/i],
    [
      "associationName",
      /(?:bostadsrättsförening|bostadsrattsforening|brf)\s+([A-ZÅÄÖ][^\n|.]{2,80})/i,
    ],
  ];

  for (const [key, re] of patterns) {
    const m = text.match(re);
    if (!m?.[1]) continue;
    if (key === "askingPrice" || key === "monthlyFee") {
      const n = parseSwedishInt(m[1]);
      if (n) setField(fields, key, n);
    } else if (key === "livingAreaSqm") {
      const n = parseSwedishInt(m[1]);
      if (n) setField(fields, key, n);
    } else if (key === "rooms") {
      setField(fields, key, parseRooms(m[1]) ?? m[1].trim());
    } else {
      setField(fields, key, m[1].trim());
    }
  }
}

function extractListingNarrative(html: string): string {
  const parts: string[] = [];
  const ogDesc = html.match(
    /<meta[^>]*(?:property|name)=["']og:description["'][^>]*content=["']([^"']+)["']/i
  );
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (title?.[1]) parts.push(`Rubrik: ${decodeHtmlEntities(title[1].trim())}`);
  if (ogDesc?.[1]) parts.push(`Beskrivning: ${decodeHtmlEntities(ogDesc[1].trim())}`);

  const body = decodeHtmlEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );

  if (body.length > 200) {
    parts.push(body.slice(0, 12000));
  }

  return parts.join("\n\n");
}

function findPdfCandidates(html: string, baseUrl: string): PdfCandidate[] {
  const found = new Map<string, PdfCandidate>();

  const add = (url: string, label: string, score: number) => {
    const cleanUrl = sanitizePdfUrl(url.trim());
    if (!cleanUrl) return;
    const existing = found.get(cleanUrl);
    if (!existing || score > existing.score) found.set(cleanUrl, { url: cleanUrl, label, score });
  };

  const hrefRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = hrefRegex.exec(html)) !== null) {
    const href = decodeHtmlEntities(m[1]);
    const label = decodeHtmlEntities(m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    const abs = resolveUrl(href, baseUrl);
    if (!abs) continue;

    const lower = abs.toLowerCase();
    const isPdf =
      lower.includes(".pdf") ||
      /getfile|\/file\/|crm\.fasad\.eu\/api\/document|mspecsfiles|connect\.maklare\.vitec\.net/i.test(lower) ||
      /\/resurs\/dokument\//i.test(lower) ||
      ANNUAL_REPORT_RE.test(lower) ||
      ANNUAL_REPORT_RE.test(label);
    if (!isPdf) continue;

    let score = 0;
    if (lower.endsWith(".pdf")) score += 2;
    if (/getfile|\/file\//i.test(lower)) score += 1;
    if (ANNUAL_REPORT_RE.test(abs)) score += 5;
    if (ANNUAL_REPORT_RE.test(label)) score += 5;
    if (/underhåll|underhall/i.test(abs + label)) score += 2;

    add(abs, label || abs.split("/").pop() || "dokument", score);
  }

  for (const cand of findPdfUrlsInText(html, baseUrl)) {
    add(cand.url, cand.label, cand.score);
  }

  return [...found.values()].sort((a, b) => b.score - a.score);
}

function mergePdfCandidates(...lists: PdfCandidate[][]): PdfCandidate[] {
  const map = new Map<string, PdfCandidate>();
  for (const list of lists) {
    for (const c of list) {
      const existing = map.get(c.url);
      if (!existing || c.score > existing.score) map.set(c.url, c);
    }
  }
  return [...map.values()].sort((a, b) => b.score - a.score);
}

async function downloadBinary(url: string, referer?: string): Promise<Buffer | null> {
  try {
    const cleanUrl = url.trim();
    const headers: Record<string, string> = { ...FETCH_HEADERS };
    if (referer) headers.Referer = referer;
    else if (/crm\.fasad\.eu/i.test(cleanUrl)) {
      headers.Referer = "https://nestorfastighetsmakleri.se/";
    } else if (/connect\.maklare\.vitec\.net|vitec\.net/i.test(cleanUrl)) {
      headers.Referer = referer ?? "https://www.erikolsson.se/";
    } else if (/api\.stadshem\.se/i.test(cleanUrl)) {
      headers.Referer = referer ?? "https://stadshem.se/";
    }
    const res = await fetch(cleanUrl, {
      headers,
      signal: AbortSignal.timeout(15000),
      redirect: "follow",
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 10 * 1024 * 1024) return null;
    return buf;
  } catch {
    return null;
  }
}

function prioritizePdfCandidates(candidates: PdfCandidate[]): PdfCandidate[] {
  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  const annual = sorted.filter((c) => ANNUAL_REPORT_RE.test(c.label + c.url));
  const rest = sorted.filter((c) => !ANNUAL_REPORT_RE.test(c.label + c.url));
  return [...annual, ...rest];
}

async function extractPdfTexts(
  candidates: PdfCandidate[],
  logs: string[],
  warnings: string[],
  referer?: string
) {
  const documents: BrokerScrapeResponse["documents"] = [];
  const texts: string[] = [];
  const maxDocs = 4;

  for (const cand of prioritizePdfCandidates(candidates).slice(0, maxDocs)) {
    logs.push(`Hämtar dokument: ${cand.label}`);
    const buf = await downloadBinary(cand.url, referer);
    if (!buf) {
      warnings.push(`Kunde inte ladda ner: ${cand.label}`);
      documents.push({
        url: cand.url,
        label: cand.label,
        kind: ANNUAL_REPORT_RE.test(cand.url + cand.label) ? "annual_report" : "other",
        extracted: false,
        charCount: 0,
      });
      continue;
    }

    try {
      const { text } = await extractTextFromBuffer(buf, `${cand.label}.pdf`);
      const kind = ANNUAL_REPORT_RE.test(cand.url + cand.label + text.slice(0, 500))
        ? "annual_report"
        : "other";
      if (text.length > 50) {
        texts.push(`### ${cand.label}\n${text.slice(0, 40000)}`);
      }
      documents.push({
        url: cand.url,
        label: cand.label,
        kind,
        extracted: text.length > 50,
        charCount: text.length,
      });
      if (text.length > 50) {
        logs.push(`Läste ${text.length.toLocaleString("sv-SE")} tecken från ${cand.label}`);
      }
    } catch (err) {
      warnings.push(
        `Kunde inte läsa PDF ${cand.label}: ${err instanceof Error ? err.message : "okänt fel"}`
      );
      documents.push({
        url: cand.url,
        label: cand.label,
        kind: "annual_report",
        extracted: false,
        charCount: 0,
      });
    }
  }

  return { combinedText: texts.join("\n\n"), documents };
}

function buildFieldStatus(form: MutableFields): Record<ScrapeFieldKey, FieldFillStatus> {
  const status = emptyStatus();
  for (const key of SCRAPE_FIELD_KEYS) {
    status[key] = form[key]?.trim() ? "found" : "missing";
  }
  return status;
}

function hostMatches(hostname: string, domain: string) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

async function applyBrokerSpecificParsers(
  hostname: string,
  html: string,
  url: string,
  fields: MutableFields
): Promise<PdfCandidate[]> {
  const extraPdfs: PdfCandidate[] = [];

  if (hostMatches(hostname, "erikolsson.se")) {
    extraPdfs.push(...parseErikOlsson(html, fields));
  }

  if (hostMatches(hostname, "fastighetsbyran.com")) {
    parseSwedishColonFacts(html, fields);
    parseHeadingValuePairs(html, fields);
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
    if (title) parseTitleForFields(title, fields);
  }

  if (hostMatches(hostname, "husmanhagberg.se")) {
    extraPdfs.push(...parseHusmanNextData(html, fields));
    parseSwedishColonFacts(html, fields);
  }

  if (hostMatches(hostname, "maklarhuset.se")) {
    parseLabelValuePairs(html, fields);
    parseSwedishColonFacts(html, fields);
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
    if (title) parseTitleForFields(title, fields);
    const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1];
    if (h1) setField(fields, "address", decodeHtmlEntities(h1).trim(), { overwrite: true });
    if (!fields.city && /stockholm/i.test(title ?? "")) {
      setField(fields, "city", "Stockholm", { overwrite: true });
    }
  }

  if (hostMatches(hostname, "notar.se")) {
    const objectId = url.match(/objekt\/([^/?#]+)/i)?.[1];
    parseNotar(html, fields, objectId);
    if (objectId) {
      const apiPdfs = await fetchNotarObject(objectId, fields);
      if (apiPdfs?.length) extraPdfs.push(...apiPdfs);
    }
  }

  if (
    hostMatches(hostname, "nestorfastighetsmakleri.se") ||
    hostMatches(hostname, "nestor.se")
  ) {
    extraPdfs.push(...parseNestor(html, fields));
  }

  if (hostMatches(hostname, "lansfast.se")) {
    parseSwedishColonFacts(html, fields);
    parseAreaFromUrl(url, fields);
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
    if (title) parseTitleForFields(title, fields);
    if (!fields.city) setField(fields, "city", "Stockholm", { overwrite: false });
  }

  if (hostMatches(hostname, "bjurfors.se")) {
    parseSwedishColonFacts(html, fields);
    parseAreaFromUrl(url, fields);
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
    if (title) parseTitleForFields(title, fields);
    if (!fields.city) setField(fields, "city", "Stockholm", { overwrite: false });
  }

  if (hostMatches(hostname, "svenskfast.se")) {
    extraPdfs.push(...parseSvenskfast(html, url, fields));
    parseSwedishColonFacts(html, fields);
  }

  if (hostMatches(hostname, "skandiamaklarna.se")) {
    extraPdfs.push(...parseSkandiaMaklarna(html, url, fields));
  }

  if (hostMatches(hostname, "svenskamaklarhuset.se")) {
    extraPdfs.push(...parseSvenskaMaklarhuset(html, url, fields));
  }

  if (hostMatches(hostname, "stadshem.se")) {
    extraPdfs.push(...parseStadshem(html, url, fields));
  }

  return extraPdfs;
}

function pageHasUsefulContent(html: string): boolean {
  return (
    html.includes("__NEXT_DATA__") ||
    html.includes("estateDetails") ||
    html.includes('"home":{') ||
    html.includes('\\"home\\":{') ||
    html.includes("application/ld+json") ||
    html.length > 40_000
  );
}

function mergeScrapeResults(
  originalUrl: string,
  agg: AggregatorResolveResult,
  broker: BrokerScrapeResponse
): BrokerScrapeResponse {
  const form: MutableFields = { ...broker.form };
  for (const [key, value] of Object.entries(agg.fields)) {
    if (value && !form[key as keyof MutableFields]) {
      form[key as keyof MutableFields] = value;
    }
  }

  const fieldStatus = buildFieldStatus(form);
  const foundCount = SCRAPE_FIELD_KEYS.filter((k) => fieldStatus[k] === "found").length;
  const ok =
    foundCount >= 2 || !!form.listingText || !!form.annualReportText || broker.ok;

  return {
    ...broker,
    ok,
    url: originalUrl,
    form,
    fieldStatus,
    logs: [...agg.logs, ...broker.logs],
    warnings: [...agg.warnings, ...broker.warnings],
  };
}

function buildAggregatorOnlyResponse(
  agg: AggregatorResolveResult
): BrokerScrapeResponse {
  const fields = { ...agg.fields };
  if (!fields.listingText && fields.address) {
    fields.listingText = `Aggregerad annons (${agg.source}). Adress: ${fields.address}${fields.area ? `, ${fields.area}` : ""}.`;
  }

  const fieldStatus = buildFieldStatus(fields);
  const foundCount = SCRAPE_FIELD_KEYS.filter((k) => fieldStatus[k] === "found").length;

  return {
    ok: foundCount >= 2 || !!fields.listingText,
    url: agg.originalUrl,
    form: fields,
    fieldStatus,
    logs: agg.logs,
    warnings: agg.warnings,
    documents: [],
  };
}

export async function scrapeBrokerListing(url: string): Promise<BrokerScrapeResponse> {
  if (isAggregatorUrl(url)) {
    const agg = await resolveAggregatorListing(url);
    if (agg.brokerUrl && !isAggregatorUrl(agg.brokerUrl)) {
      const brokerResult = await scrapeBrokerListing(agg.brokerUrl);
      return mergeScrapeResults(url, agg, brokerResult);
    }
    return buildAggregatorOnlyResponse(agg);
  }

  const logs: string[] = [];
  const warnings: string[] = [];
  const fields: MutableFields = {};

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return {
      ok: false,
      url,
      form: {},
      fieldStatus: emptyStatus(),
      logs,
      warnings: ["Ogiltig URL."],
      documents: [],
    };
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return {
      ok: false,
      url,
      form: {},
      fieldStatus: emptyStatus(),
      logs,
      warnings: ["Endast http/https-länkar stöds."],
      documents: [],
    };
  }

  logs.push("Hämtar mäklarsida…");

  let html: string;
  let httpStatus = 0;
  try {
    const res = await fetch(parsedUrl.toString(), {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(12000),
      redirect: "follow",
    });
    httpStatus = res.status;
    html = await res.text();

    if (!res.ok && !(httpStatus === 404 && pageHasUsefulContent(html))) {
      warnings.push(`Sidan svarade med status ${res.status}.`);
      return {
        ok: false,
        url: parsedUrl.toString(),
        form: {},
        fieldStatus: emptyStatus(),
        logs,
        warnings,
        documents: [],
      };
    }

    if (httpStatus === 404) {
      warnings.push("Objektet kan vara borttaget — försöker läsa kvarvarande data på sidan.");
    }
  } catch (err) {
    warnings.push(
      `Kunde inte hämta sidan: ${err instanceof Error ? err.message : "nätverksfel"}. Klistra in annonsen manuellt.`
    );
    return {
      ok: false,
      url: parsedUrl.toString(),
      form: {},
      fieldStatus: emptyStatus(),
      logs,
      warnings,
      documents: [],
    };
  }

  logs.push("Analyserar sidans data…");

  const blobs = extractJsonBlobs(html);
  for (const blob of blobs) {
    walkJsonForFields(blob, fields);
    parseJsonLdProducts(blob, fields);
  }

  extractHtmlTextFacts(html, fields);
  extractInlineJsonFragments(html, fields);
  parseMetaDescription(html, fields);
  parseLabelValuePairs(html, fields);
  parseSwedishColonFacts(html, fields);
  parseHeadingValuePairs(html, fields);
  parseAreaFromUrl(parsedUrl.toString(), fields);

  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
  if (title) parseTitleForFields(title, fields);

  const brokerPdfs = await applyBrokerSpecificParsers(
    parsedUrl.hostname,
    html,
    parsedUrl.toString(),
    fields
  );

  const listingText = extractListingNarrative(html);
  if (listingText.length > 100) {
    setField(fields, "listingText", listingText, { overwrite: false });
    logs.push("Hittade annonstext på sidan.");
  }

  const pdfCandidates = mergePdfCandidates(findPdfCandidates(html, parsedUrl.toString()), brokerPdfs);
  if (pdfCandidates.length > 0) {
    logs.push(`Hittade ${pdfCandidates.length} dokumentlänk(ar).`);
  } else {
    warnings.push("Inga PDF-dokument hittades på sidan.");
  }

  const { combinedText, documents } = await extractPdfTexts(
    pdfCandidates,
    logs,
    warnings,
    parsedUrl.toString()
  );
  if (combinedText) {
    setField(fields, "annualReportText", combinedText.slice(0, 80000));
    const annualDocs = documents.filter((d) => d.kind === "annual_report" && d.extracted);
    if (annualDocs.length > 0) {
      logs.push(`Årsredovisning/ekonomiskt underlag inläst (${annualDocs.length} dokument).`);
    }
  }

  if (!fields.city) {
    const cityMatch = decodeHtmlEntities(html).match(/,\s*([A-ZÅÄÖ][a-zåäö]+)\s*(?:\||<|–|-)/);
    if (cityMatch?.[1]) setField(fields, "city", cityMatch[1]);
  }

  if (fields.associationName) {
    const brfClean = fields.associationName.match(/(Brf\s+\S+(?:\s+\d+)?)/i);
    if (brfClean) fields.associationName = brfClean[1].trim();
  }

  const fieldStatus = buildFieldStatus(fields);
  const foundCount = SCRAPE_FIELD_KEYS.filter((k) => fieldStatus[k] === "found").length;
  const ok = foundCount >= 2 || !!fields.listingText || !!fields.annualReportText;

  if (!ok) {
    warnings.push(
      "Få uppgifter kunde extraheras automatiskt. Komplettera manuellt i nästa steg."
    );
  }

  return {
    ok,
    url: parsedUrl.toString(),
    form: fields,
    fieldStatus,
    logs,
    warnings,
    documents,
  };
}
