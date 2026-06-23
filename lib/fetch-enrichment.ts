import type { PropertyAnalysis } from "@/app/generated/prisma/client";
import type { EnrichmentData } from "@/lib/prompt";
import { scrapeListingUrl } from "@/lib/scrape-listing";
import { fetchComparables } from "@/lib/fetch-comparables";
import { fetchScbPriceIndex } from "@/lib/fetch-scb";

export async function fetchEnrichmentForAnalysis(
  analysis: PropertyAnalysis
): Promise<EnrichmentData> {
  const [listingHtml, comparables, scbData] = await Promise.allSettled([
    analysis.listingUrl ? scrapeListingUrl(analysis.listingUrl) : Promise.resolve(null),
    fetchComparables(
      analysis.city ?? "",
      analysis.area,
      analysis.livingAreaSqm ? Number(analysis.livingAreaSqm) : null,
      analysis.rooms ? Number(analysis.rooms) : null,
      analysis.address
    ),
    analysis.city ? fetchScbPriceIndex(analysis.city) : Promise.resolve(null),
  ]);

  const comparablesResult = comparables.status === "fulfilled" ? comparables.value : null;

  return {
    listingHtml: listingHtml.status === "fulfilled" ? listingHtml.value : null,
    comparables: comparablesResult?.text ?? null,
    comparablesStructured: comparablesResult?.structuredJson ?? null,
    scbNote:
      scbData.status === "fulfilled" && scbData.value ? scbData.value.note : null,
  };
}
