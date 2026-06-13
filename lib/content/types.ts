export type ContentSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: string;
};

export type FaqItem = { q: string; a: string };

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: ContentSection[];
  faq?: FaqItem[];
  relatedSlugs: string[];
  relatedToolSlugs?: string[];
};

export type Area = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  considerations: string[];
  risks: string[];
  questions: string[];
  relatedGuideSlugs: string[];
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
  description: string;
  metaTitle: string;
  metaDescription: string;
  relatedGuideSlugs: string[];
};
