export type GuideCalloutType = "remember" | "red-flag" | "tip" | "ask-broker";

export type GuideCallout = {
  type: GuideCalloutType;
  text: string;
  title?: string;
};

export type GuideCategory =
  | "Budgivning"
  | "BRF"
  | "Ekonomi"
  | "Risk"
  | "Checklista"
  | "Pris";

export type GuideIconName =
  | "bid"
  | "brf"
  | "economy"
  | "risk"
  | "checklist"
  | "price"
  | "question";

export type ContentSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: string | GuideCallout;
};

export type FaqItem = { q: string; a: string };

export type GuideInternalLink = { href: string; anchor: string };

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Short answer box shown after intro on priority guides. */
  quickAnswer?: string[];
  /** SEO internal links with explicit anchor text. */
  internalLinks?: GuideInternalLink[];
  sections: ContentSection[];
  faq?: FaqItem[];
  relatedSlugs: string[];
  relatedToolSlugs?: string[];
};

/** Guide with index/card metadata merged in at runtime. */
export type GuideWithMeta = Guide & {
  category: GuideCategory;
  indexDescription: string;
  icon: GuideIconName;
  popular?: boolean;
};

export type GlossaryTerm = {
  slug: string;
  term: string;
  metaTitle: string;
  metaDescription: string;
  definition: string;
  whyItMatters: string;
  checkPoints: string[];
  relatedGuideSlugs?: string[];
  relatedToolSlugs?: string[];
};

export type ToolMeta = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  indexDescription: string;
  badge: "Gratis" | "Snabb kalkyl";
  icon: "cost" | "brf" | "maxbud";
  previewTitle: string;
  previewText: string;
  previewBullets: string[];
  metaTitle: string;
  metaDescription: string;
  relatedGuideSlugs: string[];
  ctaTitle: string;
  ctaText: string;
  /** Primary button label shown in the result panel. */
  resultCtaLabel: string;
};
