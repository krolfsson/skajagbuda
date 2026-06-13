export const PRODUCT_NAME = "Ska jag buda?";
export const PRODUCT_TAGLINE = "Beslutsstöd för bostadsköp";
export const PRODUCT_DOMAIN = "skajagbuda.se";
export const WORDMARK_HOST = "skajagbuda";
export const WORDMARK_TLD = ".se";
export const BRAND_GREEN = "#123F35";
export const STRIPE_PRODUCT_NAME = "Ska jag buda? – full bostadsanalys";

/** Primary CTA label linking to /new across the site. */
export const CTA_START_ANALYSIS = "Starta gratis analys";

/** Canonical, absolute site URL used for metadata, sitemap, robots and JSON-LD. */
export const SITE_URL = (() => {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const isProd =
    process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

  if (isProd) {
    if (configured?.includes("skajagbuda.se")) return configured;
    return "https://skajagbuda.se";
  }

  return configured || "http://localhost:3000";
})();

export const OG_TITLE = "Få koll innan du budar | skajagbuda.se";
export const OG_DESCRIPTION =
  "Klistra in annons, budhistorik och årsredovisning. Få en preliminär risknivå gratis och lås upp en full analys med prisbedömning, föreningsrisk och budstrategi.";
export const OG_IMAGE_ALT =
  "skajagbuda.se – beslutsstöd för bostadsköp med preliminär risknivå gratis";
export const OG_IMAGE_PATH = "/og-preview.jpg";
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** Default keywords reused across pages for SEO. */
export const SEO_KEYWORDS = [
  "budgivning",
  "budstrategi",
  "budgivning bostadsrätt",
  "vinna budgivning",
  "ska jag buda",
  "köpa bostadsrätt",
  "köpa lägenhet",
  "bostadsköp tips",
  "granska årsredovisning brf",
  "föreningens ekonomi",
  "stambyte bostadsrätt",
  "tomträtt",
  "omförhandling av lån brf",
  "räntekänslighet förening",
  "skuld per kvadratmeter",
  "dolda fel bostadsrätt",
  "lånelöfte",
  "maxbud",
  "utgångspris acceptpris lockpris",
  "vad ska man tänka på vid bostadsköp",
];
