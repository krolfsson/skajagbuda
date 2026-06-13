import Link from "next/link";
import { PRODUCT_DOMAIN, SITE_URL } from "@/lib/brand";
import { getGuidesBySlugs } from "@/lib/content/guides";
import type { Area } from "@/lib/content/types";
import { GuideCtaButton } from "@/components/GuideCtaButton";

export function AreaLayout({ area }: { area: Area }) {
  const url = `${SITE_URL}/omraden/${area.slug}`;
  const related = getGuidesBySlugs(area.relatedGuideSlugs);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: area.metaTitle,
      description: area.metaDescription,
      inLanguage: "sv-SE",
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: PRODUCT_DOMAIN },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Områden", item: `${SITE_URL}/omraden` },
        { "@type": "ListItem", position: 3, name: area.name, item: url },
      ],
    },
  ];

  return (
    <div className="guide-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="guide-breadcrumb" aria-label="Brödsmulor">
        <Link href="/">Start</Link><span>/</span>
        <Link href="/omraden">Områden</Link><span>/</span>
        <span>{area.name}</span>
      </nav>

      <p className="guide-eyebrow">Område</p>
      <h1 className="guide-h1">Ska du buda på bostad i {area.name}?</h1>
      <p className="guide-lead">{area.intro}</p>

      <section className="guide-section">
        <h2 className="guide-h2">Saker att tänka på</h2>
        <ul className="guide-list">
          {area.considerations.map((c) => <li key={c}>{c}</li>)}
        </ul>
        <div className="guide-callout">
          <p>
            Prisnivåer, föreningarnas ekonomi och objektens skick kan variera kraftigt även inom
            samma område. Bedöm alltid det specifika objektet – inte bara adressen.
          </p>
        </div>
      </section>

      <section className="guide-section">
        <h2 className="guide-h2">Vanliga risker att ha koll på</h2>
        <ul className="guide-list">
          {area.risks.map((r) => <li key={r}>{r}</li>)}
        </ul>
      </section>

      <div className="guide-cta guide-cta--inline">
        <h2>Vill du kontrollera ett konkret objekt i {area.name}?</h2>
        <p>Klistra in annons och årsredovisning – få en preliminär risknivå gratis.</p>
        <GuideCtaButton href="/new" event="guide_cta_click" label="Starta analys" primary />
      </div>

      <section className="guide-section">
        <h2 className="guide-h2">Frågor att ställa</h2>
        <ul className="guide-list">
          {area.questions.map((q) => <li key={q}>{q}</li>)}
        </ul>
      </section>

      {related.length > 0 && (
        <section className="guide-related">
          <h2 className="guide-h2">Relaterade guider</h2>
          <ul className="guide-related-list">
            {related.map((g) => (
              <li key={g.slug}>
                <Link href={`/guider/${g.slug}`} className="guide-toc-link">
                  <span><strong>{g.title}</strong></span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="guide-cta">
        <h2>Osäker inför nästa bud?</h2>
        <GuideCtaButton href="/new" event="guide_cta_click" label="Få preliminär risknivå gratis" primary />
      </div>
    </div>
  );
}
