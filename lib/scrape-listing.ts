/**
 * Fetches a listing URL (Hemnet, Booli, broker site) and extracts useful text.
 */
import {
  isAggregatorUrl,
  resolveAggregatorListing,
} from "@/lib/aggregator-listing";

export async function scrapeListingUrl(url: string): Promise<string | null> {
  try {
    if (isAggregatorUrl(url)) {
      const agg = await resolveAggregatorListing(url);
      const parts: string[] = [`Källa: ${url}`, "", ...agg.logs];
      if (agg.warnings.length) parts.push("", ...agg.warnings.map((w) => `Varning: ${w}`));

      for (const [key, value] of Object.entries(agg.fields)) {
        if (value) parts.push(`${key}: ${value}`);
      }

      if (agg.brokerUrl) {
        const brokerText = await scrapeListingUrl(agg.brokerUrl);
        if (brokerText) parts.push("", brokerText);
      }

      return parts.length > 2 ? parts.join("\n") : null;
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.8",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;
    const html = await res.text();
    return extractTextFromHtml(html, url);
  } catch {
    return null;
  }
}

function extractTextFromHtml(html: string, url: string): string | null {
  const parts: string[] = [];

  // 1. Try Next.js __NEXT_DATA__ (Hemnet, Booli use this)
  const nextData = extractNextData(html);
  if (nextData) parts.push(`[Annonsdata]\n${nextData}`);

  // 2. Try schema.org JSON-LD blocks
  const jsonLd = extractJsonLd(html);
  if (jsonLd) parts.push(`[Strukturerad annonsdata]\n${jsonLd}`);

  // 3. Meta description and title
  const title = extractMeta(html, "og:title") ?? extractTag(html, "title");
  const description = extractMeta(html, "og:description") ?? extractMeta(html, "description");
  if (title) parts.push(`Rubrik: ${title}`);
  if (description) parts.push(`Beskrivning: ${description}`);

  // 4. Key property detail patterns (Swedish real estate sites)
  const facts = extractPropertyFacts(html);
  if (facts) parts.push(`[Objektfakta från sidan]\n${facts}`);

  if (parts.length === 0) return null;

  return `Källa: ${url}\n\n${parts.join("\n\n")}`;
}

function extractNextData(html: string): string | null {
  const match = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) return null;
  try {
    const json = JSON.parse(match[1]);
    // Flatten key property fields from Next.js page props
    const props = json?.props?.pageProps;
    if (!props) return null;
    return summarizeObject(props, 0, 4);
  } catch {
    return null;
  }
}

function extractJsonLd(html: string): string | null {
  const results: string[] = [];
  const regex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      const type = data["@type"] ?? "";
      if (
        ["RealEstateListing", "Residence", "Apartment", "House", "Product"].some((t) =>
          type.includes(t)
        )
      ) {
        results.push(summarizeObject(data, 0, 3));
      }
    } catch {
      // skip
    }
  }
  return results.length ? results.join("\n") : null;
}

function extractMeta(html: string, name: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*(?:name|property)=["']${name}["']`, "i"),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

function extractTag(html: string, tag: string): string | null {
  const m = html.match(new RegExp(`<${tag}[^>]*>([^<]+)<\/${tag}>`, "i"));
  return m?.[1]?.trim() ?? null;
}

function extractPropertyFacts(html: string): string | null {
  // Swedish real-estate site patterns
  const patterns: Array<[string, RegExp]> = [
    ["Pris", /(?:Pris|Utgångspris|Begärt pris)[:\s]*([0-9\s]+(?:kr|SEK|mkr)?)/i],
    ["Avgift", /(?:Månadsavgift|Avgift)[:\s]*([0-9\s]+\s*kr)/i],
    ["Boarea", /(?:Boarea|Boyta)[:\s]*([0-9,]+\s*m²?)/i],
    ["Rum", /(?:Antal rum|Rum)[:\s]*([0-9,]+\s*(?:rum|rok)?)/i],
    ["Våning", /Våning[:\s]*([0-9]+\s*(?:av\s*[0-9]+)?)/i],
    ["Förening", /(?:Förening|BRF|Bostadsrättsförening)[:\s]*([^\n<]{3,60})/i],
    ["Driftkostnad", /(?:Driftkostnad|Drift)[:\s]*([0-9\s]+\s*kr)/i],
  ];

  const found: string[] = [];
  for (const [label, re] of patterns) {
    const m = html.match(re);
    if (m?.[1]) found.push(`${label}: ${m[1].trim()}`);
  }
  return found.length > 0 ? found.join("\n") : null;
}

// Flattens a JSON object to readable key: value text, up to maxDepth
function summarizeObject(obj: unknown, depth: number, maxDepth: number): string {
  if (depth > maxDepth || obj === null || obj === undefined) return "";
  if (typeof obj !== "object") return String(obj);

  const lines: string[] = [];
  for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
    if (key.startsWith("_") || key === "@context") continue;
    if (typeof val === "string" && val.length > 0 && val.length < 300) {
      lines.push(`${key}: ${val}`);
    } else if (typeof val === "number") {
      lines.push(`${key}: ${val}`);
    } else if (typeof val === "boolean") {
      lines.push(`${key}: ${val}`);
    } else if (typeof val === "object" && val !== null && depth < maxDepth) {
      const nested = summarizeObject(val, depth + 1, maxDepth);
      if (nested) lines.push(`${key}:\n  ${nested.replace(/\n/g, "\n  ")}`);
    }
  }
  return lines.slice(0, 60).join("\n");
}
