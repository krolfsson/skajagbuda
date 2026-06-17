import type { Metadata } from "next";
import { CTA_START_ANALYSIS, PRODUCT_DOMAIN } from "@/lib/brand";
import { buildPageMetadata, NOINDEX_FOLLOW_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: "/new",
  title: CTA_START_ANALYSIS,
  description: `Klistra in objektlänk eller fyll i uppgifter manuellt. Få en preliminär risknivå gratis innan du låser upp full analys på ${PRODUCT_DOMAIN}.`,
  robots: NOINDEX_FOLLOW_ROBOTS,
});

export { default } from "@/components/NewAnalysisFlow";
