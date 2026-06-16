import type { ComponentType } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL, PRODUCT_DOMAIN } from "@/lib/brand";
import { getToolBySlug, getAllToolSlugs } from "@/lib/content/tools";
import { getGuidesBySlugs } from "@/lib/content/guides";
import { BoendekostnadCalculator } from "@/components/calculators/BoendekostnadCalculator";
import { BrfSkuldCalculator } from "@/components/calculators/BrfSkuldCalculator";
import { MaxbudCalculator } from "@/components/calculators/MaxbudCalculator";
import { AnalyticsPageView } from "@/components/AnalyticsPageView";

const CALCULATORS: Record<string, ComponentType> = {
  boendekostnad: BoendekostnadCalculator,
  "brf-skuld-per-kvm": BrfSkuldCalculator,
  maxbud: MaxbudCalculator,
};

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: tool.metaTitle.replace(" | skajagbuda.se", ""),
    description: tool.metaDescription,
    alternates: { canonical: `/verktyg/${slug}` },
    openGraph: { url: `${SITE_URL}/verktyg/${slug}`, title: tool.metaTitle, description: tool.metaDescription },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const Calc = CALCULATORS[slug];
  const related = getGuidesBySlugs(tool.relatedGuideSlugs);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.title,
      description: tool.description,
      url: `${SITE_URL}/verktyg/${slug}`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "SEK" },
      provider: { "@type": "Organization", name: PRODUCT_DOMAIN },
    },
  ];

  return (
    <div className="guide-page guide-page--tool">
      <AnalyticsPageView event="view_tool" payload={{ slug }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="guide-breadcrumb" aria-label="Brödsmulor">
        <Link href="/">Start</Link><span>/</span>
        <Link href="/verktyg">Verktyg</Link><span>/</span>
        <span>{tool.title}</span>
      </nav>

      <p className="guide-eyebrow">Verktyg</p>
      <h1 className="guide-h1">{tool.title}</h1>
      <p className="guide-lead">{tool.description}</p>

      {Calc && <Calc />}

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
    </div>
  );
}
