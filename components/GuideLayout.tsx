import Link from "next/link";
import { PRODUCT_DOMAIN, SITE_URL, CTA_START_ANALYSIS } from "@/lib/brand";
import { getGuidesBySlugs } from "@/lib/content/guides";
import { getToolBySlug } from "@/lib/content/tools";
import type { GuideWithMeta } from "@/lib/content/types";
import { GuideCtaButton } from "@/components/GuideCtaButton";
import { GuideCalloutBox } from "@/components/guides/GuideCalloutBox";
import { GuideInlineCta } from "@/components/guides/GuideInlineCta";

function sectionId(index: number, id: string) {
  return id || `section-${index}`;
}

export function GuideLayout({ guide }: { guide: GuideWithMeta }) {
  const url = `${SITE_URL}/guider/${guide.slug}`;
  const relatedGuides = getGuidesBySlugs(guide.relatedSlugs);
  const relatedTools = (guide.relatedToolSlugs ?? [])
    .map((s) => getToolBySlug(s))
    .filter(Boolean);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.metaTitle,
    description: guide.metaDescription,
    inLanguage: "sv-SE",
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: PRODUCT_DOMAIN },
    publisher: { "@type": "Organization", name: PRODUCT_DOMAIN },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Start", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guider", item: `${SITE_URL}/guider` },
      { "@type": "ListItem", position: 3, name: guide.title, item: url },
    ],
  };

  const schemas: object[] = [articleJsonLd, breadcrumbJsonLd];
  if (guide.faq?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return (
    <div className="guide-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <nav className="guide-breadcrumb" aria-label="Brödsmulor">
        <Link href="/">Start</Link>
        <span aria-hidden="true">/</span>
        <Link href="/guider">Guider</Link>
        <span aria-hidden="true">/</span>
        <span>{guide.title}</span>
      </nav>

      <div className="guide-article-header">
        <div className="guide-article-meta">
          <p className="guide-eyebrow">Guide</p>
          <span className="guide-article-category">{guide.category}</span>
          {guide.popular && (
            <span className="guide-card-badge guide-card-badge--popular">Populär</span>
          )}
        </div>
        <h1 className="guide-h1">{guide.title}</h1>
        <p className="guide-lead">{guide.intro}</p>
      </div>

      <GuideInlineCta compact />

      {guide.sections.length > 1 && (
        <nav className="guide-toc" aria-label="Innehåll">
          <p className="guide-toc-title">På denna sida</p>
          <ul className="guide-toc-list">
            {guide.sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${sectionId(i, s.id)}`} className="guide-toc-link">
                  <span className="guide-toc-index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="guide-toc-text">{s.heading}</span>
                  <svg className="guide-toc-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {guide.sections.map((section, index) => (
        <section key={section.id} id={sectionId(index, section.id)} className="guide-section">
          <h2 className="guide-h2">{section.heading}</h2>
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          {section.bullets && (
            <ul className="guide-list">
              {section.bullets.map((b) => (
                <li key={b.slice(0, 50)}>{b}</li>
              ))}
            </ul>
          )}
          {section.callout && <GuideCalloutBox callout={section.callout} />}
        </section>
      ))}

      {guide.faq && guide.faq.length > 0 && (
        <section id="faq" className="guide-section">
          <h2 className="guide-h2">Vanliga frågor</h2>
          {guide.faq.map((item) => (
            <div key={item.q} className="guide-faq-item">
              <p className="guide-faq-q">{item.q}</p>
              <p className="guide-faq-a">{item.a}</p>
            </div>
          ))}
        </section>
      )}

      {(relatedGuides.length > 0 || relatedTools.length > 0) && (
        <section className="guide-related">
          <h2 className="guide-h2">Relaterat</h2>
          <ul className="guide-related-list">
            {relatedGuides.map((g) => (
              <li key={g.slug}>
                <Link href={`/guider/${g.slug}`} className="guide-related-link">
                  <span>
                    <strong>{g.title}</strong>
                    <span className="guide-related-desc">{g.category}</span>
                  </span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            ))}
            {relatedTools.map((t) => t && (
              <li key={t.slug}>
                <Link href={`/verktyg/${t.slug}`} className="guide-related-link">
                  <span>
                    <strong>{t.shortTitle}</strong>
                    <span className="guide-related-desc">Gratisverktyg</span>
                  </span>
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
        <p>Få ett nyktert beslutsunderlag innan du går vidare i budgivningen.</p>
        <div className="guide-cta-actions">
          <GuideCtaButton href="/new" event="guide_cta_click" label={CTA_START_ANALYSIS} primary />
          <GuideCtaButton href="/exempel" event="guide_cta_click" label="Se exempelanalys" />
        </div>
      </div>

      <p className="guide-disclaimer">
        Detta är beslutsstöd, inte finansiell rådgivning. Kontrollera alltid uppgifter med mäklare,
        förening och bank.
      </p>
    </div>
  );
}
