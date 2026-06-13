import type { Metadata } from "next";
import { Barlow, Instrument_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Logo } from "@/components/Logo";
import { PRODUCT_DOMAIN, PRODUCT_TAGLINE, SITE_URL, SEO_KEYWORDS, CTA_START_ANALYSIS, OG_TITLE, OG_DESCRIPTION, OG_IMAGE_ALT, OG_IMAGE_PATH, OG_IMAGE_SIZE } from "@/lib/brand";

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
  alternates: { canonical: SITE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
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
        type: "image/jpeg",
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${barlow.variable} ${wordmark.variable}`}>
      <body className={barlow.className} style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([ORG_JSONLD, WEBSITE_JSONLD]) }}
        />
        <header
          className="site-header"
          style={{
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div className="site-header-inner">
            <a href="/" className="site-logo-link">
              <Logo />
            </a>
            <nav className="site-nav">
              <Link href="/guider" className="nav-link">
                Guider
              </Link>
              <Link href="/verktyg" className="nav-link">
                Verktyg
              </Link>
              <a href="/#exempelrapport" className="nav-link">
                Exempelanalys
              </a>
              <Link href="/new" className="nav-cta">
                {CTA_START_ANALYSIS}
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
