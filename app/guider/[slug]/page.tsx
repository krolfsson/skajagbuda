import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllGuideSlugs, getGuideBySlug } from "@/lib/content/guides";
import { GuideLayout } from "@/components/GuideLayout";
import { AnalyticsPageView } from "@/components/AnalyticsPageView";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return buildPageMetadata({
    path: `/guider/${slug}`,
    title: guide.metaTitle.replace(" | skajagbuda.se", ""),
    description: guide.metaDescription,
    type: "article",
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <>
      <AnalyticsPageView event="view_guide" payload={{ slug }} />
      <GuideLayout guide={guide} />
    </>
  );
}
