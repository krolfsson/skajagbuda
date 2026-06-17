import { absoluteUrl, getGuideFeedItems } from "@/lib/seo";
import { PRODUCT_DOMAIN } from "@/lib/brand";

export const dynamic = "force-static";
export const revalidate = 86400;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const items = getGuideFeedItems();
  const updated = new Date().toUTCString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(PRODUCT_DOMAIN)} – guider inför budgivning</title>
    <link>${escapeXml(absoluteUrl("/guider"))}</link>
    <description>Praktiska guider om budstrategi, BRF-analys och risk inför bostadsköp.</description>
    <language>sv-se</language>
    <lastBuildDate>${updated}</lastBuildDate>
    <atom:link href="${escapeXml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml"/>
    ${items
      .map(
        (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <description>${escapeXml(item.description)}</description>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(body.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
