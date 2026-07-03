import type { Metadata } from "next";
import { Suspense } from "react";
import NewAnalysisFlow from "@/components/NewAnalysisFlow";
import { CTA_START_ANALYSIS, PRODUCT_DOMAIN } from "@/lib/brand";
import { buildPageMetadata, NOINDEX_FOLLOW_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: "/new",
  title: CTA_START_ANALYSIS,
  description: `Klistra in objektlänk till mäklarens annons. Få analys av pris, förening, risk och budintervall — gratis under beta på ${PRODUCT_DOMAIN}.`,
  robots: NOINDEX_FOLLOW_ROBOTS,
});

function NewAnalysisFallback() {
  return (
    <div className="analysis-page" style={{ background: "var(--bg)", padding: "32px 16px 80px" }}>
      <div style={{ maxWidth: "620px", margin: "0 auto" }}>
        <p style={{ fontSize: "14px", color: "var(--muted)" }}>Laddar analysflöde…</p>
      </div>
    </div>
  );
}

export default function NewAnalysisPage() {
  return (
    <Suspense fallback={<NewAnalysisFallback />}>
      <NewAnalysisFlow />
    </Suspense>
  );
}
