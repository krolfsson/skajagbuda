"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { CTA_START_ANALYSIS } from "@/lib/brand";

const DESKTOP_NAV = [
  { href: "/guider", label: "Guider", match: (path: string) => path.startsWith("/guider") },
  { href: "/verktyg", label: "Verktyg", match: (path: string) => path.startsWith("/verktyg") },
  {
    href: "/#exempelanalys",
    label: "Exempel",
    match: (path: string) => path === "/exempel",
  },
  { href: "/om", label: "Om", match: (path: string) => path.startsWith("/om") },
] as const;

const MOBILE_PILLS = [
  { href: "/guider", label: "Guider", icon: "guide" },
  { href: "/verktyg", label: "Verktyg", icon: "tool" },
  { href: "/#exempelanalys", label: "Exempel", icon: "example" },
] as const;

function NavIcon({ name }: { name: "guide" | "tool" | "example" }) {
  if (name === "guide") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 4h10a2 2 0 0 1 2 2v14l-4-2.5L9 20V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "tool") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M14.7 6.3a4.5 4.5 0 0 0-6.1 6.1L3 18l3 3 5.6-5.6a4.5 4.5 0 0 0 6.1-6.1l-2.2 2.2-3.9-3.9 2.2-2.2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19V5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M8 15v-4M12 15V8M16 15v-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function navLinkClass(active: boolean) {
  return `site-header-nav-link${active ? " site-header-nav-link--active" : ""}`;
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header-shell">
        <div className="site-header-bar site-header-bar--desktop">
          <a href="/" className="site-header-logo site-header-logo--desktop">
            <Logo />
          </a>

          <nav className="site-header-nav" aria-label="Huvudnavigation">
            {DESKTOP_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navLinkClass(item.match(pathname))}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-header-actions">
            <Link href="/new" className="site-header-cta">
              {CTA_START_ANALYSIS}
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </div>

        <div className="site-header-bar site-header-bar--mobile">
          <a href="/" className="site-header-logo site-header-logo--mobile">
            <Logo />
          </a>

          <nav className="site-header-mobile-pills" aria-label="Snabbnavigation">
            {MOBILE_PILLS.map((item) => (
              <Link key={item.href} href={item.href} className="site-header-pill">
                <NavIcon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
