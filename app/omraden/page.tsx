import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/brand";
import { AREAS } from "@/lib/content/areas";
import { AnalyticsPageView } from "@/components/AnalyticsPageView";

export const metadata: Metadata = {
  title: "Bostadsköp per område – guider och tips",
  description:
    "Guider för bostadsköp i Stockholm och Göteborg – Södermalm, Vasastan, Kungsholmen, Solna med flera. Vad du bör kontrollera före bud.",
  alternates: { canonical: "/omraden" },
  openGraph: { url: `${SITE_URL}/omraden`, title: "Områden | skajagbuda.se" },
};

export default function OmradenIndexPage() {
  return (
    <div className="content-index">
      <AnalyticsPageView event="view_guide" payload={{ page: "omraden_index" }} />
      <p className="guide-eyebrow">Områden</p>
      <h1 className="guide-h1">Bostadsköp per område</h1>
      <p className="guide-lead">
        Vad du bör tänka på före bud – område för område. Generella råd utan påhittad
        marknadsdata: bedöm alltid det specifika objektet och föreningen.
      </p>
      <ul className="content-index-grid">
        {AREAS.map((a) => (
          <li key={a.slug}>
            <Link href={`/omraden/${a.slug}`} className="content-index-card">
              <span className="content-index-card-title">{a.name}</span>
              <span className="content-index-card-desc">{a.metaDescription}</span>
              <svg className="content-index-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
