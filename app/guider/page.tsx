import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, CTA_START_ANALYSIS } from "@/lib/brand";
import { getAllGuides } from "@/lib/content/guides";
import { AnalyticsPageView } from "@/components/AnalyticsPageView";
import { GuideCard } from "@/components/guides/GuideCard";
import { GuideIndexCta } from "@/components/guides/GuideInlineCta";

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
  const guides = getAllGuides();
  const midIndex = 6;

  return (
    <div className="content-index content-index--guides">
      <AnalyticsPageView event="view_guide" payload={{ page: "guider_index" }} />
      <p className="guide-eyebrow">Guider</p>
      <h1 className="guide-h1">Guider inför budgivning och bostadsköp</h1>
      <p className="guide-lead">
        Praktiska guider om budstrategi, föreningsrisk, maxbud och saker att kontrollera innan du
        lägger första budet. Varje guide leder vidare till analys när du hittat ett objekt.
      </p>

      <ul className="guides-grid">
        {guides.slice(0, midIndex).map((g) => (
          <li key={g.slug}>
            <GuideCard guide={g} />
          </li>
        ))}
      </ul>

      <GuideIndexCta />

      <ul className="guides-grid guides-grid--after-cta">
        {guides.slice(midIndex).map((g) => (
          <li key={g.slug}>
            <GuideCard guide={g} />
          </li>
        ))}
      </ul>

      <section className="guides-content-block">
        <h2 className="guides-content-block-title">Bra kalkyl först. Bättre beslut med analys.</h2>
        <p className="guides-content-block-text">
          Boendekostnad, maxbud och BRF-skuld säger mycket — men inte allt. En full analys väger
          även föreningens ekonomi, planerat underhåll, röda flaggor och budstrategi.
        </p>
      </section>

      <div className="guide-cta guide-cta--tools">
        <h2>Nästa steg: analysera objektet</h2>
        <p>Klistra in objektlänken och få en preliminär risknivå gratis.</p>
        <Link href="/new" className="guide-cta-primary">{CTA_START_ANALYSIS}</Link>
      </div>
    </div>
  );
}
