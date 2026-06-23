import type { Metadata } from "next";
import Link from "next/link";
import { CTA_START_ANALYSIS_ARROW } from "@/lib/brand";
import { getAllGuides } from "@/lib/content/guides";
import { sortGuidesForIndex } from "@/lib/content/guide-seo";
import type { GuideCategory } from "@/lib/content/types";
import { AnalyticsPageView } from "@/components/AnalyticsPageView";
import { GuideCard } from "@/components/guides/GuideCard";
import { GuideVerktygCard } from "@/components/guides/GuideVerktygCard";
import { GuideIndexCta } from "@/components/guides/GuideInlineCta";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: "/guider",
  title: "Guider inför budgivning och bostadsköp",
  description:
    "Guider om budgivning, rimligt maxbud, BRF-analys, stambyte, tomträtt och frågor till mäklaren — så du får bättre underlag innan du budar på bostadsrätt.",
});

const CATEGORY_ORDER: GuideCategory[] = [
  "Budgivning",
  "Pris",
  "BRF",
  "Risk",
  "Checklista",
];

export default function GuiderIndexPage() {
  const guides = sortGuidesForIndex(getAllGuides());
  const priorityGuides = guides.slice(0, 10);
  const otherGuides = guides.slice(10);
  const midIndex = 3;

  return (
    <div className="content-index content-index--guides">
      <AnalyticsPageView event="view_guide" payload={{ page: "guider_index" }} />
      <p className="guide-eyebrow">Guider</p>
      <h1 className="guide-h1">Guider inför budgivning och bostadsköp</h1>
      <p className="guide-lead">
        Praktiska guider om budgivning, rimligt maxbud, föreningsrisk och checklistor innan du lägger
        första budet. Börja med guiderna nedan — eller starta en analys när du hittat ett objekt.
      </p>

      <p className="guides-pillar-link">
        Vill du ha allt samlat? Läs vår{" "}
        <Link href="/att-tanka-pa">kompletta guide: att tänka på vid budgivning</Link>.
      </p>

      <div className="guides-category-legend" aria-hidden="true">
        {CATEGORY_ORDER.map((cat) => (
          <span key={cat} className="guides-category-pill">
            {cat}
          </span>
        ))}
      </div>

      <h2 className="guides-section-heading">Populära guider</h2>
      <ul className="guides-grid">
        {priorityGuides.slice(0, midIndex).map((g) => (
          <li key={g.slug}>
            <GuideCard guide={g} />
          </li>
        ))}
        <li>
          <GuideVerktygCard />
        </li>
      </ul>

      <GuideIndexCta />

      <ul className="guides-grid guides-grid--after-cta">
        {priorityGuides.slice(midIndex).map((g) => (
          <li key={g.slug}>
            <GuideCard guide={g} />
          </li>
        ))}
      </ul>

      {otherGuides.length > 0 && (
        <>
          <h2 className="guides-section-heading">Fler guider</h2>
          <ul className="guides-grid guides-grid--after-cta">
            {otherGuides.map((g) => (
              <li key={g.slug}>
                <GuideCard guide={g} />
              </li>
            ))}
          </ul>
        </>
      )}

      <section className="guides-content-block">
        <h2 className="guides-content-block-title">Bra kalkyl först. Bättre beslut med analys.</h2>
        <p className="guides-content-block-text">
          Boendekostnad, maxbud och BRF-skuld säger mycket — men inte allt. En full analys väger
          även förenings ekonomi, planerat underhåll, röda flaggor och budstrategi.
        </p>
      </section>

      <div className="guide-cta guide-cta--tools">
        <h2>Nästa steg: analysera objektet</h2>
        <p>
          Guiderna hjälper dig förstå riskerna. När du har ett konkret objekt kan du få en
          preliminär risknivå gratis.
        </p>
        <Link href="/new" className="guide-cta-primary">
          {CTA_START_ANALYSIS_ARROW}
        </Link>
      </div>
    </div>
  );
}
