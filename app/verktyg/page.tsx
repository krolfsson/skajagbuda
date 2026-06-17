import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, CTA_START_ANALYSIS_ARROW } from "@/lib/brand";
import { TOOLS } from "@/lib/content/tools";
import { AnalyticsPageView } from "@/components/AnalyticsPageView";
import { ToolIcon } from "@/components/tools/ToolIcon";

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
    <div className="content-index content-index--tools">
      <AnalyticsPageView event="view_tool" payload={{ page: "verktyg_index" }} />
      <p className="guide-eyebrow">Verktyg</p>
      <h1 className="guide-h1">Gratisverktyg inför budgivning</h1>
      <p className="guide-lead">
        Snabba kalkyler som ger bättre underlag innan du budar. Komplettera med en full analys när
        du hittat ett konkret objekt.
      </p>

      <ul className="tools-grid">
        {TOOLS.map((t) => (
          <li key={t.slug}>
            <Link href={`/verktyg/${t.slug}`} className="tool-card">
              <div className="tool-card-top">
                <ToolIcon name={t.icon} />
                <div className="card-top-meta">
                  <span className="tool-card-badge">{t.badge}</span>
                  <svg className="tool-card-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <h2 className="tool-card-title">{t.shortTitle}</h2>
              <p className="tool-card-desc">{t.indexDescription}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="tools-content-block">
        <h2 className="tools-content-block-title">Bra kalkyl först. Bättre beslut med analys.</h2>
        <p className="tools-content-block-text">
          Boendekostnad, maxbud och BRF-skuld säger mycket — men inte allt. En full analys väger
          även föreningens ekonomi, planerat underhåll, röda flaggor och budstrategi.
        </p>
      </section>

      <div className="guide-cta guide-cta--tools">
        <h2>Nästa steg: analysera objektet</h2>
        <p>Klistra in objektlänken och få en preliminär risknivå gratis.</p>
        <Link href="/new" className="guide-cta-primary">{CTA_START_ANALYSIS_ARROW}</Link>
      </div>
    </div>
  );
}
