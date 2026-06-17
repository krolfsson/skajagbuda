import Link from "next/link";
import { PRODUCT_DOMAIN, SITE_URL, CTA_START_ANALYSIS_ARROW } from "@/lib/brand";
import { SEO_GUIDE_PAGES } from "@/lib/seo-guide-links";

export type GuideFaqItem = { q: string; a: string };
export type GuideTocItem = { id: string; label: string };

export function SeoGuideLayout({
  slug,
  breadcrumbLabel,
  eyebrow,
  title,
  description,
  h1,
  lead,
  toc,
  faq,
  children,
}: {
  slug: string;
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  toc?: GuideTocItem[];
  faq: GuideFaqItem[];
  children: React.ReactNode;
}) {
  const url = `${SITE_URL}/${slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: "sv-SE",
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: PRODUCT_DOMAIN },
    publisher: { "@type": "Organization", name: PRODUCT_DOMAIN },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Start", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: breadcrumbLabel, item: url },
    ],
  };

  const related = SEO_GUIDE_PAGES.filter((page) => page.slug !== slug);

  return (
    <div className="guide-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleJsonLd, faqJsonLd, breadcrumbJsonLd]),
        }}
      />

      <p className="guide-eyebrow">{eyebrow}</p>
      <h1 className="guide-h1">{h1}</h1>
      <p className="guide-lead">{lead}</p>

      {toc && toc.length > 0 && (
        <nav className="guide-toc" aria-label="Innehåll">
          <p className="guide-toc-title">På denna sida</p>
          <ul className="guide-toc-list">
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="guide-toc-link">
                  <span>{item.label}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M4 2l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {children}

      <section id="faq" className="guide-section">
        <h2 className="guide-h2">Vanliga frågor</h2>
        {faq.map((item) => (
          <div key={item.q} className="guide-faq-item">
            <p className="guide-faq-q">{item.q}</p>
            <p className="guide-faq-a">{item.a}</p>
          </div>
        ))}
      </section>

      <section className="guide-related">
        <h2 className="guide-h2">Läs också</h2>
        <ul className="guide-related-list">
          {related.map((page) => (
            <li key={page.slug}>
              <Link href={`/${page.slug}`} className="guide-toc-link">
                <span>
                  <strong>{page.label}</strong>
                  <span className="guide-related-desc">{page.desc}</span>
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M4 2l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/att-tanka-pa" className="guide-toc-link">
              <span>
                <strong>Att tänka på</strong>
                <span className="guide-related-desc">Komplett guide inför bostadsköp.</span>
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M4 2l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
        </ul>
      </section>

      <div className="guide-cta">
        <h2>Få en konkret budstrategi för din bostad</h2>
        <p>
          Klistra in annons, budhistorik och årsredovisning så får du en preliminär risknivå gratis —
          och en full analys med rekommenderat maxbud, budstrategi och röda flaggor.
        </p>
        <div className="guide-cta-actions">
          <Link href="/new" className="guide-cta-primary">
            {CTA_START_ANALYSIS_ARROW}
          </Link>
          <Link href="/exempel" className="guide-cta-secondary">
            Se exempelanalys
          </Link>
        </div>
      </div>
    </div>
  );
}
