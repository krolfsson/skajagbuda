import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllAreaSlugs, getAreaBySlug } from "@/lib/content/areas";
import { AreaLayout } from "@/components/AreaLayout";
import { AnalyticsPageView } from "@/components/AnalyticsPageView";
import { SITE_URL } from "@/lib/brand";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllAreaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) return {};
  return {
    title: area.metaTitle.replace(" | skajagbuda.se", ""),
    description: area.metaDescription,
    alternates: { canonical: `/omraden/${slug}` },
    openGraph: { url: `${SITE_URL}/omraden/${slug}`, title: area.metaTitle, description: area.metaDescription },
  };
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) notFound();
  return (
    <>
      <AnalyticsPageView event="view_guide" payload={{ slug, type: "area" }} />
      <AreaLayout area={area} />
    </>
  );
}
