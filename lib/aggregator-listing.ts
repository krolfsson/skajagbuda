import type { MutableFields } from "@/lib/broker-scrape-parsers";
import {
  fetchBooliListing,
  getBooliBrokerUrl,
  getBooliCredentials,
  mapBooliListingToFields,
  searchBooliListings,
} from "@/lib/booli-api";
import { setField } from "@/lib/broker-scrape-parsers";
import { discoverBrokerUrl } from "@/lib/broker-discovery";

export type AggregatorResolveResult = {
  source: "hemnet" | "booli";
  originalUrl: string;
  brokerUrl?: string;
  hemnetId?: string;
  booliId?: string;
  fields: MutableFields;
  logs: string[];
  warnings: string[];
};

function capitalizeWords(text: string): string {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function isAggregatorUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host === "hemnet.se" || host === "booli.se";
  } catch {
    return false;
  }
}

/** ASCII slug (diacritics stripped by Hemnet) → display name for common municipalities. */
const MUNICIPALITY_NAMES: Record<string, string> = {
  goteborg: "Göteborg",
  malmo: "Malmö",
  linkoping: "Linköping",
  norrkoping: "Norrköping",
  jonkoping: "Jönköping",
  orebro: "Örebro",
  vasteras: "Västerås",
  umea: "Umeå",
  lulea: "Luleå",
  gavle: "Gävle",
  vaxjo: "Växjö",
  boras: "Borås",
  sodertalje: "Södertälje",
  taby: "Täby",
  jarfalla: "Järfälla",
  lidingo: "Lidingö",
  varmdo: "Värmdö",
  tyreso: "Tyresö",
  ekero: "Ekerö",
  osteraker: "Österåker",
  nynashamn: "Nynäshamn",
  norrtalje: "Norrtälje",
  molndal: "Mölndal",
  upplands_vasby: "Upplands Väsby",
  upplands_bro: "Upplands-Bro",
};

/** First word of two-word municipality names ("upplands-vasby-kommun"). */
const MUNICIPALITY_PREFIXES = new Set(["upplands", "lilla", "dals", "ostra", "norra", "sodra", "vastra"]);

const HEMNET_TYPES = /^(lagenhet|villa|radhus|fritidshus|parhus|kedjehus|tomt|gard|vinterbonat|andelsboende|agarlagenhet)$/i;

function municipalityFromSlug(tokens: string[]): string {
  // Hemnet uses the genitive ("stockholms-kommun"); keep native s-endings ("boras").
  const last = tokens[tokens.length - 1];
  const base = last.endsWith("s") && !/(as|nas|fors)$/.test(last) ? last.slice(0, -1) : last;
  const key = [...tokens.slice(0, -1), base].join("_");
  return MUNICIPALITY_NAMES[key] ?? capitalizeWords([...tokens.slice(0, -1), base].join(" "));
}

/**
 * Current Hemnet slug: {typ}-{rum}rum-{område...}-{kommun}-kommun-{gata...}-{nr}-{id}.
 * Hemnet strips å/ä/ö from slugs, so names may need a spelling check by the user.
 */
function parseHemnetSlugWithKommun(parts: string[], fields: MutableFields): boolean {
  const kommunIdx = parts.lastIndexOf("kommun");
  if (kommunIdx < 2) return false;

  let i = 0;
  if (HEMNET_TYPES.test(parts[i])) i++;
  const roomsM = parts[i]?.match(/^(\d+(?:[.,]\d+)?)rum$/i);
  if (roomsM) {
    setField(fields, "rooms", roomsM[1].replace(",", "."), { overwrite: true });
    i++;
  }

  let muniStart = kommunIdx - 1;
  if (muniStart - 1 >= i && MUNICIPALITY_PREFIXES.has(parts[muniStart - 1])) muniStart--;
  const muniTokens = parts.slice(muniStart, kommunIdx);
  const areaTokens = parts.slice(i, muniStart);
  if (muniTokens.length) setField(fields, "city", municipalityFromSlug(muniTokens), { overwrite: true });
  if (areaTokens.length) setField(fields, "area", capitalizeWords(areaTokens.join(" ")), { overwrite: true });

  const streetTokens = parts.slice(kommunIdx + 1);
  if (streetTokens.length >= 2 && /^\d+[a-z]?$/i.test(streetTokens[streetTokens.length - 1])) {
    const number = streetTokens.pop()!;
    setField(fields, "address", `${capitalizeWords(streetTokens.join(" "))} ${number}`, { overwrite: true });
  }
  return true;
}

export function parseHemnetUrl(url: string): { hemnetId?: string; fields: MutableFields } {
  const fields: MutableFields = {};

  try {
    const pathname = new URL(url).pathname;
    const m = pathname.match(/\/bostad\/(.+)-(\d+)\/?$/i);
    if (!m) return { fields };

    const slug = m[1];
    const hemnetId = m[2];
    const parts = slug.split("-").filter(Boolean);
    if (parseHemnetSlugWithKommun(parts, fields)) return { hemnetId, fields };

    // Older slug format without "-kommun-".
    const rest: string[] = [];

    for (const part of parts) {
      if (/^lagenhet$|^villa$|^radhus$|^fritidshus$/i.test(part)) continue;
      const roomsM = part.match(/^(\d+(?:[.,]\d+)?)rum$/i);
      if (roomsM) {
        setField(fields, "rooms", roomsM[1].replace(",", "."), { overwrite: true });
        continue;
      }
      if (/^(stockholm|goteborg|göteborg|malmo|malmö|uppsala|linkoping|linköping)$/i.test(part)) {
        const city = part
          .replace(/^stockholm$/i, "Stockholm")
          .replace(/^goteborg$/i, "Göteborg")
          .replace(/^malmo$/i, "Malmö")
          .replace(/^linkoping$/i, "Linköping");
        setField(fields, "city", city, { overwrite: true });
        continue;
      }
      rest.push(part);
    }

    if (rest.length >= 2 && /^\d+[a-z]?$/i.test(rest[rest.length - 1])) {
      const streetNo = rest.pop()!;
      const streetName = rest.pop()!;
      const area = rest.length > 0 ? capitalizeWords(rest.join(" ")) : undefined;
      setField(fields, "address", `${capitalizeWords(streetName)} ${streetNo}`, { overwrite: true });
      if (area) setField(fields, "area", area, { overwrite: true });
    }

    return { hemnetId, fields };
  } catch {
    return { fields };
  }
}

export function parseBooliUrl(url: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const m =
      pathname.match(/\/(?:bostad|annons|bud)\/(\d+)\/?$/i) ??
      pathname.match(/\/(\d+)\/?$/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

async function applyBooliListing(
  listing: Record<string, unknown>,
  fields: MutableFields
): Promise<string | undefined> {
  for (const [key, value] of Object.entries(mapBooliListingToFields(listing))) {
    setField(fields, key as keyof MutableFields, value, { overwrite: true });
  }
  return getBooliBrokerUrl(listing) ?? undefined;
}

async function resolveViaBooliApi(
  booliId: string,
  fields: MutableFields,
  logs: string[]
): Promise<string | undefined> {
  if (!getBooliCredentials()) {
    console.info("[aggregator] Booli API credentials not configured — skipping API lookup.");
    return undefined;
  }

  const listing = await fetchBooliListing(booliId);
  if (!listing) {
    console.warn("[aggregator] Booli API returned no listing", { booliId });
    return undefined;
  }

  const brokerUrl = await applyBooliListing(listing, fields);
  if (brokerUrl) logs.push(`Booli API: hittade mäklarlänk → ${brokerUrl}`);
  else logs.push("Booli API: annonsdata hämtad.");
  return brokerUrl;
}

async function resolveHemnetViaBooliSearch(
  fields: MutableFields,
  logs: string[]
): Promise<string | undefined> {
  if (!getBooliCredentials()) return undefined;
  const q = [fields.address, fields.area, fields.city].filter(Boolean).join(" ");
  if (!q || q.length < 5) return undefined;

  const listings = await searchBooliListings(q, 5);
  const addr = String(fields.address ?? "").toLowerCase();
  const match = listings.find((l) => {
    const item = l as Record<string, unknown>;
    const location = item.location as Record<string, unknown> | undefined;
    const addressObj = location?.address as Record<string, unknown> | undefined;
    const street = String(
      addressObj?.streetAddress ?? item.streetAddress ?? ""
    ).toLowerCase();
    return street && addr && street.includes(addr.split(" ")[0]);
  }) as Record<string, unknown> | undefined;

  if (!match) return undefined;

  const brokerUrl = await applyBooliListing(match, fields);
  if (brokerUrl) logs.push(`Booli-sökning: matchade mäklarlänk → ${brokerUrl}`);
  return brokerUrl;
}

/**
 * Resolves what we legitimately can for a Hemnet/Booli link: data encoded in the URL,
 * the Booli API when credentials are configured, and a likely broker page. The listing
 * pages themselves are fetched separately (see scrapeBrokerListing) and are usually
 * behind a bot challenge that we do not try to get around.
 */
export async function resolveAggregatorListing(url: string): Promise<AggregatorResolveResult> {
  const host = new URL(url).hostname.replace(/^www\./, "");
  const logs: string[] = [];
  const warnings: string[] = [];
  const fields: MutableFields = {};

  if (host === "hemnet.se") {
    const { hemnetId, fields: hemnetFields } = parseHemnetUrl(url);
    Object.assign(fields, hemnetFields);
    if (Object.keys(hemnetFields).length > 0) {
      logs.push("Hemnet: adress, område och rum lästa från länken.");
    }

    let brokerUrl = await resolveHemnetViaBooliSearch(fields, logs);
    if (!brokerUrl && fields.address) {
      const discovered = await discoverBrokerUrl(fields);
      if (discovered) {
        brokerUrl = discovered.url;
        logs.push(`Mäklarsökning: hittade sannolik länk → ${discovered.url}`);
      }
    }

    return { source: "hemnet", originalUrl: url, brokerUrl, hemnetId, fields, logs, warnings };
  }

  if (host === "booli.se") {
    const booliId = parseBooliUrl(url) ?? undefined;
    if (!booliId) {
      return { source: "booli", originalUrl: url, fields, logs, warnings };
    }

    logs.push(`Booli-annons ${booliId}.`);
    let brokerUrl = await resolveViaBooliApi(booliId, fields, logs);
    if (!brokerUrl && fields.address) {
      const discovered = await discoverBrokerUrl(fields);
      if (discovered) {
        brokerUrl = discovered.url;
        logs.push(`Mäklarsökning: hittade sannolik länk → ${discovered.url}`);
      }
    }

    return { source: "booli", originalUrl: url, brokerUrl, booliId, fields, logs, warnings };
  }

  return { source: "hemnet", originalUrl: url, fields, logs, warnings };
}
