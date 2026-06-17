import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  CTA_START_ANALYSIS,
  FOOTER_DISCLAIMER,
  PRODUCT_DOMAIN,
  TRUST_PAYMENT_LINE,
  TRUST_PRICE_LINE_FOOTER,
} from "@/lib/brand";

const PRODUCT_LINKS = [
  { href: "/guider", label: "Guider" },
  { href: "/att-tanka-pa", label: "Att tänka på" },
  { href: "/verktyg", label: "Verktyg" },
  { href: "/ordlista", label: "Ordlista" },
  { href: "/exempel", label: "Exempelanalys" },
  { href: "/new", label: CTA_START_ANALYSIS },
] as const;

const INFO_LINKS = [
  { href: "/om", label: "Om tjänsten" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/integritet", label: "Integritet" },
  { href: "/villkor", label: "Villkor" },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link href="/" className="site-footer-logo" aria-label={`${PRODUCT_DOMAIN} startsida`}>
            <Logo />
          </Link>
          <p className="site-footer-desc">
            Beslutsstöd för bostadsköpare som vill få bättre underlag innan de budar.
          </p>
          <p className="site-footer-trust">{TRUST_PRICE_LINE_FOOTER}</p>
          <p className="site-footer-payment">{TRUST_PAYMENT_LINE}</p>
        </div>

        <nav className="site-footer-nav" aria-label="Produkt">
          <p className="site-footer-nav-title">Utforska</p>
          <ul className="site-footer-nav-list">
            {PRODUCT_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="site-footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="site-footer-nav" aria-label="Information">
          <p className="site-footer-nav-title">Om {PRODUCT_DOMAIN}</p>
          <ul className="site-footer-nav-list">
            {INFO_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="site-footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="site-footer-disclaimer">{FOOTER_DISCLAIMER}</p>
    </footer>
  );
}
