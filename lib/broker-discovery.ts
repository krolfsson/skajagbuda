import type { MutableFields } from "@/lib/broker-scrape-parsers";

const BROKER_HOSTS = [
  "erikolsson.se",
  "lansfast.se",
  "bjurfors.se",
  "svenskfast.se",
  "fastighetsbyran.com",
  "notar.se",
  "husmanhagberg.se",
  "maklarhuset.se",
  "skandiamaklarna.se",
  "svenskamaklarhuset.se",
] as const;

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o");
}

function slugify(text: string): string {
  return normalizeText(text).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function streetParts(address: string): { street: string; number: string } | null {
  const m = address.trim().match(/^(.+?)\s+(\d+[a-z]?)$/i);
  if (!m) return null;
  return { street: m[1].trim(), number: m[2] };
}

function buildCandidateUrls(address: string, area: string | undefined, city: string | undefined) {
  const parts = streetParts(address);
  if (!parts) return [];

  const streetSlug = slugify(parts.street);
  const areaSlug = area ? slugify(area) : "";
  const citySlug = city ? slugify(city) : "stockholm";
  const cityPath = citySlug === "stockholm" ? "stockholm/stockholm" : `${citySlug}/${citySlug}`;

  const urls: string[] = [
    `https://www.lansfast.se/till-salu/bostadsratt/stockholm/${cityPath}/${areaSlug}/`,
    `https://www.bjurfors.se/sv/tillsalu/stockholm/stockholm/${areaSlug}/`,
    `https://www.svenskfast.se/bostadsratt/stockholm/${citySlug}/${areaSlug}/`,
    `https://www.lansfast.se/till-salu/bostadsratt/stockholm/${cityPath}/${areaSlug}/${streetSlug}-${parts.number}/`,
    `https://www.bjurfors.se/sv/tillsalu/stockholm/stockholm/${areaSlug}/${streetSlug}-${parts.number}/`,
    `https://www.svenskfast.se/bostadsratt/stockholm/${citySlug}/${areaSlug}/${streetSlug}-${parts.number}/`,
    `https://www.skandiamaklarna.se/hitta-hem/bostadsratt/stockholm/${areaSlug}/${streetSlug}-${parts.number}/`,
    `https://www.erikolsson.se/homes/Lagenhet-${streetSlug}-${parts.number}-${citySlug}`,
  ];

  for (let floor = 1; floor <= 6; floor++) {
    urls.push(
      `https://www.lansfast.se/till-salu/bostadsratt/stockholm/${cityPath}/${areaSlug}/${streetSlug}-${parts.number}-${floor}tr/`
    );
  }

  for (let rooms = 1; rooms <= 5; rooms++) {
    urls.push(
      `https://www.erikolsson.se/homes/Lagenhet-${rooms}rum-${streetSlug}-${parts.number}-Stockholm-Stockholm-kommun`
    );
  }

  return [...new Set(urls.filter(Boolean))];
}

function extractListingLinks(html: string, address: string): string[] {
  const parts = streetParts(address);
  if (!parts) return [];

  const streetSlug = slugify(parts.street);
  const needle = `${streetSlug}-${parts.number.toLowerCase()}`;
  const links = new Set<string>();

  for (const match of html.matchAll(/href="([^"]+)"/gi)) {
    const href = match[1];
    if (!href.includes(needle)) continue;
    if (/sok|search|bevakning/i.test(href)) continue;
    try {
      links.add(new URL(href, "https://www.lansfast.se").toString());
    } catch {
      // ignore invalid URLs
    }
  }

  return [...links];
}

function pageLooksLikeListing(html: string, address: string, candidateUrl: string): number {
  const parts = streetParts(address);
  if (!parts) return 0;
  if (/[?&]q=/.test(candidateUrl)) return 0;

  const streetNorm = normalizeText(parts.street);
  const number = parts.number.toLowerCase();
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? "";
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1] ?? "";
  const heading = normalizeText(`${title} ${h1}`);

  let score = 0;
  if (!(heading.includes(streetNorm) && heading.includes(number))) return 0;
  score += 8;

  if (/hittades inte|404|sökresultat|inga träffar/i.test(heading)) return 0;
  if (!/utgångspris|listprice|list price|månadsavgift|boarea/i.test(html)) return 0;

  const streetSlug = slugify(parts.street);
  if (!candidateUrl.toLowerCase().includes(`${streetSlug}-${number}`)) return 0;
  if (html.includes("__NEXT_DATA__") || html.includes("estateDetails")) score += 2;
  if (html.includes("application/ld+json")) score += 2;
  if (/utgångspris|listprice|list price|månadsavgift|boarea/i.test(html)) score += 3;

  return score;
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "sv-SE,sv;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function probeUrl(url: string, address: string) {
  const html = await fetchHtml(url);
  if (!html) return null;
  const score = pageLooksLikeListing(html, address, url);
  if (score < 8) return null;
  return { url, score };
}

export async function discoverBrokerUrl(
  fields: MutableFields
): Promise<{ url: string; score: number } | null> {
  const address = fields.address?.trim();
  if (!address) return null;

  const candidates = buildCandidateUrls(address, fields.area, fields.city);
  const areaPages = candidates.filter((url) => url.endsWith("/") && !url.includes(`${slugify(address)}`));

  for (const areaUrl of areaPages.slice(0, 3)) {
    const html = await fetchHtml(areaUrl);
    if (!html) continue;
    const links = extractListingLinks(html, address);
    candidates.push(...links);
  }

  const results = await Promise.all([...new Set(candidates)].map((url) => probeUrl(url, address)));
  const ranked = results
    .filter((r): r is { url: string; score: number } => r !== null)
    .sort((a, b) => b.score - a.score);

  return ranked[0] ?? null;
}

export function isKnownBrokerHost(hostname: string): boolean {
  const host = hostname.replace(/^www\./, "");
  return BROKER_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}
