/**
 * Fetches recently sold apartments near a given city/area using Booli's search.
 * Returns a text summary for the AI prompt, or null if unavailable.
 *
 * Booli's API v3 requires registration. We fall back to a best-effort HTML scrape
 * of their sold listing search page, which is publicly accessible.
 */

export interface ComparableSale {
  address: string;
  soldPrice: number;
  askingPrice: number | null;
  sqm: number | null;
  pricePerSqm: number | null;
  rooms: number | null;
  soldDate: string;
  floor: string | null;
}

export async function fetchComparables(
  city: string,
  area: string | null,
  sqm: number | null,
  rooms: number | null
): Promise<string | null> {
  const query = [area, city].filter(Boolean).join(" ").trim();
  if (!query) return null;

  try {
    // Booli sold search — public, no key required for basic search
    const searchUrl = `https://www.booli.se/sok/slutpriser?q=${encodeURIComponent(query)}&objectType=Lägenhet&rooms=${rooms ?? ""}&minLivingArea=${sqm ? Math.max(1, sqm - 20) : ""}&maxLivingArea=${sqm ? sqm + 20 : ""}`;

    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "sv-SE,sv;q=0.9",
        Referer: "https://www.booli.se/",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;
    const html = await res.text();

    // Extract __NEXT_DATA__ — Booli is a Next.js app
    const nextMatch = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!nextMatch) return buildFallbackComparableContext(query, city, sqm);

    const nextData = JSON.parse(nextMatch[1]);
    const listings: unknown[] =
      nextData?.props?.pageProps?.results?.sold ??
      nextData?.props?.pageProps?.soldListings ??
      nextData?.props?.pageProps?.listings ??
      [];

    if (!Array.isArray(listings) || listings.length === 0) {
      return buildFallbackComparableContext(query, city, sqm);
    }

    const sales = listings
      .slice(0, 20)
      .map((l: unknown) => parseBooliListing(l))
      .filter((s): s is ComparableSale => s !== null);

    if (sales.length === 0) return buildFallbackComparableContext(query, city, sqm);

    return formatComparables(sales, query);
  } catch {
    return buildFallbackComparableContext(query, city, sqm);
  }
}

function parseBooliListing(listing: unknown): ComparableSale | null {
  if (!listing || typeof listing !== "object") return null;
  const l = listing as Record<string, unknown>;

  const soldPrice =
    (l.soldPrice as number) ?? (l.price as number) ?? (l.finalPrice as number);
  if (!soldPrice) return null;

  const sqm =
    (l.livingArea as number) ??
    (l.sqm as number) ??
    (l.size as number) ??
    null;

  return {
    address: String(l.streetAddress ?? l.address ?? l.location ?? "–"),
    soldPrice,
    askingPrice: (l.listPrice as number) ?? (l.askingPrice as number) ?? null,
    sqm,
    pricePerSqm:
      sqm && sqm > 0 ? Math.round(soldPrice / sqm) : null,
    rooms: (l.rooms as number) ?? null,
    soldDate: String(l.soldDate ?? l.saleDate ?? l.date ?? "–"),
    floor: l.floor ? String(l.floor) : null,
  };
}

function formatComparables(sales: ComparableSale[], area: string): string {
  const lines = [`Sålda lägenheter i närheten (${area}):`];

  const withPpm = sales.filter((s) => s.pricePerSqm !== null);
  if (withPpm.length > 0) {
    const ppms = withPpm.map((s) => s.pricePerSqm!);
    const avg = Math.round(ppms.reduce((a, b) => a + b, 0) / ppms.length);
    const min = Math.min(...ppms);
    const max = Math.max(...ppms);
    lines.push(
      `Genomsnittligt pris/kvm: ${fmtSEK(avg)} (spann: ${fmtSEK(min)}–${fmtSEK(max)}) — baserat på ${withPpm.length} objekt`
    );
  }

  lines.push("");
  for (const s of sales.slice(0, 10)) {
    const parts = [
      s.address,
      s.rooms ? `${s.rooms} rok` : null,
      s.sqm ? `${s.sqm} kvm` : null,
      s.floor ? `vån ${s.floor}` : null,
      `Slutpris: ${fmtSEK(s.soldPrice)}`,
      s.pricePerSqm ? `(${fmtSEK(s.pricePerSqm)}/kvm)` : null,
      s.askingPrice ? `Utgångspris: ${fmtSEK(s.askingPrice)}` : null,
      s.soldDate !== "–" ? `Såld: ${s.soldDate}` : null,
    ].filter(Boolean);
    lines.push("- " + parts.join(" | "));
  }

  return lines.join("\n");
}

/** When scraping fails, return a context note so the AI knows to use its own knowledge */
function buildFallbackComparableContext(query: string, city: string, sqm: number | null): string {
  return (
    `Jämförprisdata: Extern hämtning misslyckades. ` +
    `Basera din pris/kvm-analys på din träningskunskap om typiska bostadspriser i ${city}${query !== city ? ` (${query})` : ""}.` +
    (sqm ? ` Objektet är ${sqm} kvm.` : "") +
    ` Ange om din marknadskunskap är begränsad eller osäker.`
  );
}

function fmtSEK(v: number): string {
  return new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(v) + " kr";
}
