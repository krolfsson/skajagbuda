import { absoluteUrl, getAllIndexablePaths, PILLAR_LINKS } from "@/lib/seo";
import { PRODUCT_DOMAIN, PRODUCT_TAGLINE, SITE_URL } from "@/lib/brand";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const paths = getAllIndexablePaths().filter((p) => p !== "/");

  const body = `# ${PRODUCT_DOMAIN}

> ${PRODUCT_TAGLINE}

Canonical site: ${SITE_URL}

## Primary pages
- ${absoluteUrl("/")} — Start analysis flow and product overview
- ${absoluteUrl(PILLAR_LINKS.attTankaPa.href)} — Comprehensive pillar guide before bidding
- ${absoluteUrl(PILLAR_LINKS.guider.href)} — Guide index (bud strategy, BRF, risk)
- ${absoluteUrl(PILLAR_LINKS.verktyg.href)} — Free calculators (housing cost, max bid, BRF debt)
- ${absoluteUrl(PILLAR_LINKS.ordlista.href)} — Glossary of BRF and bidding terms
- ${absoluteUrl(PILLAR_LINKS.exempel.href)} — Example analysis report

## Discovery
- Sitemap: ${absoluteUrl("/sitemap.xml")}
- RSS (guides): ${absoluteUrl("/feed.xml")}

## All indexable URLs
${paths.map((p) => `- ${absoluteUrl(p)}`).join("\n")}

## Not for indexing
- /new — analysis input flow
- /result/* — private user reports
- /api/* — API routes
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
