import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllGlossarySlugs, getGlossaryBySlug } from "@/lib/content/glossary";
import { GlossaryLayout } from "@/components/GlossaryLayout";
import { AnalyticsPageView } from "@/components/AnalyticsPageView";
import { SITE_URL } from "@/lib/brand";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllGlossarySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryBySlug(slug);
  if (!term) return {};
  return {
    title: term.metaTitle.replace(" | skajagbuda.se", ""),
    description: term.metaDescription,
    alternates: { canonical: `/ordlista/${slug}` },
    openGraph: { url: `${SITE_URL}/ordlista/${slug}`, title: term.metaTitle, description: term.metaDescription },
  };
}

export default async function GlossaryPage({ params }: Props) {
  const { slug } = await params;
  const term = getGlossaryBySlug(slug);
  if (!term) notFound();
  return (
    <>
      <AnalyticsPageView event="view_guide" payload={{ slug, type: "glossary" }} />
      <GlossaryLayout term={term} />
    </>
  );
}
