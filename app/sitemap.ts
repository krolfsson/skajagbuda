import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/brand";
import { getAllGuideSlugs } from "@/lib/content/guides";
import { getAllToolSlugs } from "@/lib/content/tools";
import { getAllGlossarySlugs } from "@/lib/content/glossary";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/guider`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/verktyg`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/ordlista`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/att-tanka-pa`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/exempel`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/new`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE_URL}/om`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/kontakt`, lastModified: now, changeFrequency: "yearly", priority: 0.35 },
    { url: `${SITE_URL}/integritet`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/villkor`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const guides = getAllGuideSlugs().map((slug) => ({
    url: `${SITE_URL}/guider/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const tools = getAllToolSlugs().map((slug) => ({
    url: `${SITE_URL}/verktyg/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const glossary = getAllGlossarySlugs().map((slug) => ({
    url: `${SITE_URL}/ordlista/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticPages, ...guides, ...tools, ...glossary];
}
