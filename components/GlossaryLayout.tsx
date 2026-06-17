import Link from "next/link";
import { PRODUCT_DOMAIN, SITE_URL } from "@/lib/brand";
import { getGuidesBySlugs } from "@/lib/content/guides";
import { getToolBySlug } from "@/lib/content/tools";
import type { GlossaryTerm } from "@/lib/content/types";
import { CTA_START_ANALYSIS } from "@/lib/brand";
import { GuideCtaButton } from "@/components/GuideCtaButton";

export function GlossaryLayout({ term }: { term: GlossaryTerm }) {
  const url = `${SITE_URL}/ordlista/${term.slug}`;
  const relatedGuides = getGuidesBySlugs(term.relatedGuideSlugs ?? []);
  const relatedTools = (term.relatedToolSlugs ?? []).map((s) => getToolBySlug(s)).filter(Boolean);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: term.term,
      description: term.definition,
      inDefinedTermSet: `${SITE_URL}/ordlista`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Ordlista", item: `${SITE_URL}/ordlista` },
        { "@type": "ListItem", position: 3, name: term.term, item: url },
      ],
    },
  ];

  return (
    <div className="guide-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="guide-breadcrumb" aria-label="Brödsmulor">
        <Link href="/">Start</Link><span>/</span>
        <Link href="/ordlista">Ordlista</Link><span>/</span>
        <span>{term.term}</span>
      </nav>

      <p className="guide-eyebrow">Ordlista</p>
      <h1 className="guide-h1">{term.term}</h1>

      <section className="guide-section">
        <h2 className="guide-h2">Definition</h2>
        <p>{term.definition}</p>
      </section>

      <section className="guide-section">
        <h2 className="guide-h2">Varför det spelar roll vid budgivning</h2>
        <p>{term.whyItMatters}</p>
      </section>

      <section className="guide-section">
        <h2 className="guide-h2">Vad du bör kontrollera</h2>
        <ul className="guide-list">
          {term.checkPoints.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </section>

      <div className="guide-cta guide-cta--inline">
        <h2>Vill du se hur det påverkar ett konkret objekt?</h2>
        <GuideCtaButton href="/new" event="guide_cta_click" label={CTA_START_ANALYSIS} primary />
      </div>

      {(relatedGuides.length > 0 || relatedTools.length > 0) && (
        <section className="guide-related">
          <h2 className="guide-h2">Läs mer</h2>
          <ul className="guide-related-list">
            {relatedGuides.map((g) => (
              <li key={g.slug}>
                <Link href={`/guider/${g.slug}`} className="guide-toc-link">
                  <span><strong>{g.title}</strong></span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            ))}
            {relatedTools.map((t) => t && (
              <li key={t.slug}>
                <Link href={`/verktyg/${t.slug}`} className="guide-toc-link">
                  <span><strong>{t.shortTitle}</strong></span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="guide-disclaimer">
        Förklaringen är förenklad. Kontrollera alltid i årsredovisning, stadgar och mot mäklare.
      </p>
    </div>
  );
}
