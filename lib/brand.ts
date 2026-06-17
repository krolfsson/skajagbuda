export const PRODUCT_NAME = "Ska jag buda?";
export const PRODUCT_TAGLINE = "Beslutsstöd för bostadsköp";
export const PRODUCT_DOMAIN = "skajagbuda.se";
export const WORDMARK_HOST = "skajagbuda";
export const WORDMARK_TLD = ".se";
export const BRAND_GREEN = "#123F35";
export const STRIPE_PRODUCT_NAME = "Ska jag buda? – full bostadsanalys";

/** Price for unlocking the full analysis (SEK). Used in UI and Stripe Checkout. */
export const FULL_ANALYSIS_PRICE_SEK = 29;

/** Primary CTA label linking to /new across the site. */
export const CTA_START_ANALYSIS = "Starta gratis analys";

/** Same CTA with forward arrow for flow-start buttons. */
export const CTA_START_ANALYSIS_ARROW = `${CTA_START_ANALYSIS} →`;

/** Public contact email (NEXT_PUBLIC_CONTACT_EMAIL). */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "kontakt@skajagbuda.se";

/** Trust copy — price and payment (Stripe Checkout: card, Apple Pay, Google Pay where supported). */
export const TRUST_PRICE_LINE = `Full analys ${FULL_ANALYSIS_PRICE_SEK} kr · Engångsbetalning · Ingen prenumeration`;
export const TRUST_PRICE_LINE_FOOTER = `Full analys ${FULL_ANALYSIS_PRICE_SEK} kr. Engångsbetalning. Ingen prenumeration.`;
export const TRUST_PAYMENT_LINE =
  "Säker betalning via Stripe med kort, Apple Pay eller Google Pay där det stöds.";
export const TRUST_PAYMENT_LINE_PAYWALL =
  "Säker betalning med kort, Apple Pay eller Google Pay via Stripe.";
export const FOOTER_DISCLAIMER = `${PRODUCT_DOMAIN} är ett beslutsstöd och ersätter inte juridisk, ekonomisk eller finansiell rådgivning. Kontrollera alltid uppgifter med mäklare, bostadsrättsförening, bank eller relevant expert.`;

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
  "Klistra in objektlänken. Vi hämtar underlaget där det går och låter AI strukturera pris, förening och risk — preliminär risknivå gratis.";
export const OG_IMAGE_ALT =
  "skajagbuda.se – beslutsstöd för bostadsköp med preliminär risknivå gratis";
export const OG_IMAGE_PATH = "/opengraph-image";
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
