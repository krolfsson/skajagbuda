import type { Metadata } from "next";
import { Barlow, Instrument_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PRODUCT_DOMAIN, PRODUCT_TAGLINE, SITE_URL, SEO_KEYWORDS, OG_TITLE, OG_DESCRIPTION, OG_IMAGE_ALT, OG_IMAGE_PATH, OG_IMAGE_SIZE } from "@/lib/brand";
import { getSiteVerification, INDEX_ROBOTS } from "@/lib/seo";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

const wordmark = Instrument_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-wordmark",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: OG_TITLE,
    template: `%s | ${PRODUCT_DOMAIN}`,
  },
  description: OG_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  applicationName: PRODUCT_DOMAIN,
  authors: [{ name: PRODUCT_DOMAIN }],
  creator: PRODUCT_DOMAIN,
  publisher: PRODUCT_DOMAIN,
  category: "finance",
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
      "text/plain": `${SITE_URL}/llms.txt`,
    },
  },
  verification: getSiteVerification(),
  robots: INDEX_ROBOTS,
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: SITE_URL,
    siteName: PRODUCT_DOMAIN,
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_PATH,
        width: OG_IMAGE_SIZE.width,
        height: OG_IMAGE_SIZE.height,
        alt: OG_IMAGE_ALT,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: PRODUCT_DOMAIN,
  url: SITE_URL,
  description: PRODUCT_TAGLINE,
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: PRODUCT_DOMAIN,
  url: SITE_URL,
  inLanguage: "sv-SE",
  description: PRODUCT_TAGLINE,
  publisher: { "@type": "Organization", name: PRODUCT_DOMAIN, url: SITE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${barlow.variable} ${wordmark.variable}`}>
      <body className={barlow.className} style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([ORG_JSONLD, WEBSITE_JSONLD]) }}
        />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
