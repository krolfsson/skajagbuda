import type { Metadata } from "next";
import { SITE_URL, OG_IMAGE_PATH, OG_IMAGE_SIZE, OG_IMAGE_ALT, PRODUCT_DOMAIN } from "@/lib/brand";
import { getAllGuideSlugs, getGuidesBySlugs, GUIDES } from "@/lib/content/guides";
import { getAllToolSlugs } from "@/lib/content/tools";
import { getAllGlossarySlugs } from "@/lib/content/glossary";

/** Pages that should never appear in search results. */
export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

/** Utility flows: don't index, but pass link equity. */
export const NOINDEX_FOLLOW_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: true,
  googleBot: { index: false, follow: true },
};

export const INDEX_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
};

export function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageOpenGraph(
  path: string,
  title: string,
  description: string,
  type: "website" | "article" = "website",
) {
  return {
    type,
    locale: "sv_SE" as const,
    url: absoluteUrl(path),
    siteName: PRODUCT_DOMAIN,
    title,
    description,
    images: [
      {
        url: OG_IMAGE_PATH,
        width: OG_IMAGE_SIZE.width,
        height: OG_IMAGE_SIZE.height,
        alt: OG_IMAGE_ALT,
        type: "image/png" as const,
      },
    ],
  };
}

export function pageTwitter(title: string, description: string) {
  return {
    card: "summary_large_image" as const,
    title,
    description,
    images: [OG_IMAGE_PATH],
  };
}

export function buildPageMetadata({
  path,
  title,
  description,
  keywords,
  type = "website",
  robots = INDEX_ROBOTS,
}: {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  type?: "website" | "article";
  robots?: Metadata["robots"];
}): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    robots,
    openGraph: pageOpenGraph(path, title, description, type),
    twitter: pageTwitter(title, description),
  };
}

export function getSiteVerification(): Metadata["verification"] | undefined {
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  const bing = process.env.BING_SITE_VERIFICATION?.trim();
  if (!google && !bing) return undefined;
  const verification: NonNullable<Metadata["verification"]> = {};
  if (google) verification.google = google;
  if (bing) verification.other = { "msvalidate.01": bing };
  return verification;
}

/** All indexable static paths (no dynamic segments). */
export const STATIC_INDEXABLE_PATHS = [
  "/",
  "/guider",
  "/verktyg",
  "/ordlista",
  "/att-tanka-pa",
  "/exempel",
  "/om",
  "/kontakt",
  "/integritet",
  "/villkor",
] as const;

export function getAllIndexablePaths(): string[] {
  return [
    ...STATIC_INDEXABLE_PATHS,
    ...getAllGuideSlugs().map((slug) => `/guider/${slug}`),
    ...getAllToolSlugs().map((slug) => `/verktyg/${slug}`),
    ...getAllGlossarySlugs().map((slug) => `/ordlista/${slug}`),
  ];
}

export function getGuideFeedItems() {
  return GUIDES.map((g) => ({
    slug: g.slug,
    title: g.title,
    description: g.metaDescription,
    url: absoluteUrl(`/guider/${g.slug}`),
  }));
}

export const PILLAR_LINKS = {
  attTankaPa: { href: "/att-tanka-pa", label: "Att tänka på vid budgivning" },
  guider: { href: "/guider", label: "Alla guider" },
  verktyg: { href: "/verktyg", label: "Gratis kalkylatorer" },
  ordlista: { href: "/ordlista", label: "Ordlista" },
  exempel: { href: "/exempel", label: "Exempelanalys" },
} as const;

export const ATT_TANKA_PA_RELATED_GUIDES = getGuidesBySlugs([
  "budstrategi-bostadsratt",
  "checklista-innan-budgivning",
  "analysera-brf-arsredovisning",
  "stambyte-bostadsratt-risk",
  "roda-flaggor-bostadsratt",
  "vad-ar-rimligt-maxbud",
]);

export const INDEXNOW_KEY = "skajagbuda-indexnow-key";
