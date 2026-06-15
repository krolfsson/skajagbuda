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

export function parseHemnetUrl(url: string): { hemnetId?: string; fields: MutableFields } {
  const fields: MutableFields = {};

  try {
    const pathname = new URL(url).pathname;
    const m = pathname.match(/\/bostad\/(.+)-(\d+)\/?$/i);
    if (!m) return { fields };

    const slug = m[1];
    const hemnetId = m[2];
    const parts = slug.split("-").filter(Boolean);
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
  logs: string[],
  warnings: string[]
): Promise<string | undefined> {
  if (!getBooliCredentials()) {
    warnings.push(
      "Booli API-nycklar saknas (BOOLI_CALLER_ID, BOOLI_API_KEY) — begränsad data från Booli."
    );
    return undefined;
  }

  const listing = await fetchBooliListing(booliId);
  if (!listing) {
    warnings.push("Kunde inte hämta Booli-annons via API.");
    return undefined;
  }

  const brokerUrl = await applyBooliListing(listing, fields);
  if (brokerUrl) logs.push(`Booli API: hittade mäklarlänk → ${brokerUrl}`);
  else logs.push("Booli API: annonsdata hämtad.");
  return brokerUrl;
}

async function resolveHemnetViaBooliSearch(
  fields: MutableFields,
  logs: string[],
  warnings: string[]
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

export async function resolveAggregatorListing(url: string): Promise<AggregatorResolveResult> {
  const host = new URL(url).hostname.replace(/^www\./, "");
  const logs: string[] = [];
  const warnings: string[] = [];
  const fields: MutableFields = {};

  if (host === "hemnet.se") {
    const { hemnetId, fields: hemnetFields } = parseHemnetUrl(url);
    Object.assign(fields, hemnetFields);
    logs.push(`Hemnet-annons ${hemnetId ?? ""} — grunddata från URL.`.trim());
    logs.push("Hemnet skyddas av Cloudflare — kompletterar via Booli API om nycklar finns.");

    const brokerUrl = await resolveHemnetViaBooliSearch(fields, logs, warnings);
    let resolvedBrokerUrl = brokerUrl;

    if (!resolvedBrokerUrl && fields.address) {
      const discovered = await discoverBrokerUrl(fields);
      if (discovered) {
        resolvedBrokerUrl = discovered.url;
        logs.push(`Mäklarsökning: hittade sannolik länk → ${discovered.url}`);
      }
    }

    if (!resolvedBrokerUrl && !getBooliCredentials()) {
      warnings.push(
        "För bästa Hemnet-data: lägg till BOOLI_CALLER_ID och BOOLI_API_KEY i .env, eller klistra in mäklarens direktlänk."
      );
    }

    return {
      source: "hemnet",
      originalUrl: url,
      brokerUrl: resolvedBrokerUrl,
      hemnetId,
      fields,
      logs,
      warnings,
    };
  }

  if (host === "booli.se") {
    const booliId = parseBooliUrl(url);
    if (!booliId) {
      warnings.push("Kunde inte läsa Booli-annons-ID från URL.");
      return { source: "booli", originalUrl: url, fields, logs, warnings };
    }

    logs.push(`Booli-annons ${booliId}.`);
    const brokerUrl = await resolveViaBooliApi(booliId, fields, logs, warnings);

    if (!brokerUrl && fields.address) {
      const discovered = await discoverBrokerUrl(fields);
      if (discovered) {
        logs.push(`Mäklarsökning: hittade sannolik länk → ${discovered.url}`);
        return {
          source: "booli",
          originalUrl: url,
          brokerUrl: discovered.url,
          booliId,
          fields,
          logs,
          warnings,
        };
      }
    }

    if (!brokerUrl && Object.keys(fields).length === 0) {
      warnings.push(
        "Booli skyddas av Cloudflare. Lägg till BOOLI_CALLER_ID och BOOLI_API_KEY i .env för full funktion."
      );
    }

    return { source: "booli", originalUrl: url, brokerUrl, booliId, fields, logs, warnings };
  }

  return { source: "hemnet", originalUrl: url, fields, logs, warnings };
}
