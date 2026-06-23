import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/brand";
import { STATIC_INDEXABLE_PATHS } from "@/lib/seo";
import { getAllGuideSlugs } from "@/lib/content/guides";
import { PRIORITY_GUIDE_SLUGS } from "@/lib/content/guide-seo";
import { getAllToolSlugs } from "@/lib/content/tools";
import { getAllGlossarySlugs } from "@/lib/content/glossary";

const PRIORITY: Record<string, number> = {
  "/": 1,
  "/att-tanka-pa": 0.95,
  "/guider": 0.9,
  "/verktyg": 0.85,
  "/ordlista": 0.8,
  "/exempel": 0.8,
};

const FREQUENCY: Record<string, MetadataRoute.Sitemap[number]["changeFrequency"]> = {
  "/": "weekly",
  "/guider": "weekly",
  "/verktyg": "monthly",
  "/ordlista": "monthly",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = STATIC_INDEXABLE_PATHS.map((path) => ({
    url: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: FREQUENCY[path] ?? "monthly",
    priority: PRIORITY[path] ?? 0.5,
  }));

  const guides = getAllGuideSlugs().map((slug) => ({
    url: `${SITE_URL}/guider/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: (PRIORITY_GUIDE_SLUGS as readonly string[]).includes(slug) ? 0.85 : 0.8,
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
