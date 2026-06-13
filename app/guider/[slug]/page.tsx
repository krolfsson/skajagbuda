import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllGuideSlugs, getGuideBySlug } from "@/lib/content/guides";
import { GuideLayout } from "@/components/GuideLayout";
import { AnalyticsPageView } from "@/components/AnalyticsPageView";
import { SITE_URL } from "@/lib/brand";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.metaTitle.replace(` | skajagbuda.se`, ""),
    description: guide.metaDescription,
    alternates: { canonical: `/guider/${slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/guider/${slug}`,
      title: guide.metaTitle,
      description: guide.metaDescription,
    },
  };
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
