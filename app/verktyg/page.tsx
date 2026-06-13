import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, CTA_START_ANALYSIS } from "@/lib/brand";
import { TOOLS } from "@/lib/content/tools";
import { AnalyticsPageView } from "@/components/AnalyticsPageView";

export const metadata: Metadata = {
  title: "Gratisverktyg för bostadsköpare",
  description:
    "Gratis kalkylatorer för boendekostnad, BRF skuld per kvm och maxbud – förenklad hjälp inför budgivning på bostadsrätt.",
  alternates: { canonical: "/verktyg" },
  openGraph: {
    url: `${SITE_URL}/verktyg`,
    title: "Gratisverktyg | skajagbuda.se",
    description: "Kalkylatorer för boendekostnad, skuld/kvm och maxbud.",
  },
};

export default function VerktygIndexPage() {
  return (
    <div className="content-index">
      <AnalyticsPageView event="view_tool" payload={{ page: "verktyg_index" }} />
      <p className="guide-eyebrow">Verktyg</p>
      <h1 className="guide-h1">Gratisverktyg inför budgivning</h1>
      <p className="guide-lead">
        Förenklade kalkylatorer som ger dig bättre underlag innan du budar. Komplettera med en full
        analys när du hittat ett konkret objekt.
      </p>
      <ul className="content-index-grid">
        {TOOLS.map((t) => (
          <li key={t.slug}>
            <Link href={`/verktyg/${t.slug}`} className="content-index-card">
              <span className="content-index-card-title">{t.title}</span>
              <span className="content-index-card-desc">{t.description}</span>
              <svg className="content-index-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
      <div className="guide-cta">
        <h2>Nästa steg: analysera objektet</h2>
        <Link href="/new" className="guide-cta-primary">{CTA_START_ANALYSIS}</Link>
      </div>
    </div>
  );
}
