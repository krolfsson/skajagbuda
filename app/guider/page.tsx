import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/brand";
import { GUIDES } from "@/lib/content/guides";
import { AnalyticsPageView } from "@/components/AnalyticsPageView";

export const metadata: Metadata = {
  title: "Guider inför budgivning och bostadsköp",
  description:
    "Guider om budstrategi, BRF-analys, maxbud, stambyte, tomträtt och röda flaggor – så du får bättre underlag innan du budar på bostadsrätt.",
  alternates: { canonical: "/guider" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/guider`,
    title: "Guider inför budgivning | skajagbuda.se",
    description: "Praktiska guider för bostadsköpare – budgivning, förening och risk.",
  },
};

export default function GuiderIndexPage() {
  return (
    <div className="content-index">
      <AnalyticsPageView event="view_guide" payload={{ page: "guider_index" }} />
      <p className="guide-eyebrow">Guider</p>
      <h1 className="guide-h1">Guider inför budgivning och bostadsköp</h1>
      <p className="guide-lead">
        Praktiska guider om budstrategi, föreningsrisk, maxbud och saker att kontrollera innan du
        lägger första budet. Varje guide leder vidare till en konkret analys när du hittat ett objekt.
      </p>
      <ul className="content-index-grid">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link href={`/guider/${g.slug}`} className="content-index-card">
              <span className="content-index-card-title">{g.title}</span>
              <span className="content-index-card-desc">{g.metaDescription}</span>
              <svg className="content-index-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
      <div className="guide-cta">
        <h2>Redan hittat ett objekt?</h2>
        <p>Klistra in annons och årsredovisning – få en preliminär risknivå gratis.</p>
        <div className="guide-cta-actions">
          <Link href="/new" className="guide-cta-primary">Starta analys</Link>
          <Link href="/verktyg" className="guide-cta-secondary">Gratisverktyg</Link>
        </div>
      </div>
    </div>
  );
}
