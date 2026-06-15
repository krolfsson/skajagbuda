import { createHash, randomBytes } from "crypto";

const BOOLI_API_BASE = "https://api.booli.se";

export type BooliCredentials = {
  callerId: string;
  apiKey: string;
};

export function getBooliCredentials(): BooliCredentials | null {
  const callerId = process.env.BOOLI_CALLER_ID?.trim();
  const apiKey =
    process.env.BOOLI_API_KEY?.trim() ?? process.env.BOOLI_PRIVATE_KEY?.trim();
  if (!callerId || !apiKey) return null;
  return { callerId, apiKey };
}

function buildAuthParams(creds: BooliCredentials) {
  const time = Math.floor(Date.now() / 1000).toString();
  const unique = randomBytes(8).toString("hex");
  const hash = createHash("sha1")
    .update(`${creds.callerId}${time}${creds.apiKey}${unique}`)
    .digest("hex");
  return { callerId: creds.callerId, time, unique, hash };
}

async function booliFetch(path: string, query: Record<string, string> = {}) {
  const creds = getBooliCredentials();
  if (!creds) return null;

  const params = new URLSearchParams({ ...buildAuthParams(creds), ...query });
  const url = `${BOOLI_API_BASE}${path}?${params}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.booli-v2+json",
        "User-Agent": "Bidder/1.0",
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function fetchBooliListing(listingId: string) {
  const byPath = await booliFetch(`/listings/${listingId}`);
  if (byPath) {
    const listings = byPath.listings as unknown[] | undefined;
    if (Array.isArray(listings) && listings.length > 0) {
      return listings[0] as Record<string, unknown>;
    }
    if (byPath.booliId != null || byPath.listPrice != null) {
      return byPath as Record<string, unknown>;
    }
  }

  const byQuery = await booliFetch("/listings", { booliId: listingId, limit: "1" });
  if (!byQuery) return null;
  const listings = byQuery.listings as unknown[] | undefined;
  return (listings?.[0] as Record<string, unknown>) ?? null;
}

export async function searchBooliListings(query: string, limit = 5) {
  const data = await booliFetch("/listings", { q: query, limit: String(limit) });
  if (!data) return [];
  const listings = data.listings as unknown[] | undefined;
  return Array.isArray(listings) ? listings : [];
}

export async function searchBooliSold(query: string, limit = 8) {
  const data = await booliFetch("/sold", { q: query, limit: String(limit) });
  if (!data) return [];
  const sold = (data.sold as unknown[]) ?? (data.listings as unknown[]);
  return Array.isArray(sold) ? sold : [];
}

export function mapBooliListingToFields(
  listing: Record<string, unknown>
): Record<string, string> {
  const fields: Record<string, string> = {};

  const location = listing.location as Record<string, unknown> | undefined;
  const addressObj = location?.address as Record<string, unknown> | undefined;
  const street =
    (addressObj?.streetAddress as string | undefined) ??
    (listing.streetAddress as string | undefined);
  if (street) fields.address = street;

  const namedAreas = location?.namedAreas as string[] | undefined;
  const area =
    (namedAreas?.[0] as string | undefined) ??
    (listing.descriptiveAreaName as string | undefined) ??
    (listing.area as string | undefined);
  if (area) fields.area = String(area);

  const region = location?.region as Record<string, unknown> | undefined;
  const city =
    (region?.municipalityName as string | undefined) ?? (listing.city as string | undefined);
  if (city) fields.city = city;

  const price = (listing.listPrice ?? listing.soldPrice ?? listing.price) as number | undefined;
  if (price) fields.askingPrice = String(price);

  const fee = (listing.rent ?? listing.monthlyFee) as number | undefined;
  if (fee) fields.monthlyFee = String(fee);

  const sqm = (listing.livingArea ?? listing.size) as number | undefined;
  if (sqm) fields.livingAreaSqm = String(sqm);

  const rooms = listing.rooms as number | undefined;
  if (rooms) fields.rooms = String(rooms);

  const floor = listing.floor as number | undefined;
  if (floor != null) fields.floor = String(floor);

  const desc = listing.description as string | undefined;
  if (desc) fields.listingText = desc;

  const source = listing.source as Record<string, unknown> | undefined;
  const sourceName = source?.name as string | undefined;
  if (sourceName && /brf|bostadsrätt/i.test(sourceName)) fields.associationName = sourceName;

  const assoc = (listing.tenure ?? listing.cooperativeName) as string | undefined;
  if (assoc && /brf|bostadsrätt/i.test(assoc)) fields.associationName = assoc;

  return fields;
}

export function getBooliBrokerUrl(listing: Record<string, unknown>): string | null {
  const source = listing.source as Record<string, unknown> | undefined;
  const sourceUrl = source?.url as string | undefined;
  if (sourceUrl && /^https?:\/\//i.test(sourceUrl) && !/booli\.se/i.test(sourceUrl)) {
    return sourceUrl;
  }

  const url = listing.url as string | undefined;
  if (url && /^https?:\/\//i.test(url) && !/booli\.se/i.test(url)) return url;
  return null;
}
