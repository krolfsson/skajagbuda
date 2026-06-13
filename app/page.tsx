import Link from "next/link";
import { LandingExampleReport } from "@/components/LandingExampleReport";
import { HomeAnalytics, HomeAnchorCta, HomeCtaLink } from "@/components/HomeAnalytics";
import { PRODUCT_DOMAIN } from "@/lib/brand";

const REPORT_ITEMS = [
  {
    title: "Prisbild",
    desc: "Rimligt pris jämfört med område, storlek och skick.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 10.5 12 4l9 6.5" />
        <path d="M5 9.5V20h14V9.5" />
        <path d="M9.5 20v-5h5v5" />
      </svg>
    ),
  },
  {
    title: "Föreningsrisk",
    desc: "Skuld, kassa, avgifter och planerade renoveringar.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3 5 6v5c0 4.4 3 8 7 9 4-1 7-4.6 7-9V6z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Budstrategi",
    desc: "Öppningsbud, nästa steg och walk-away-nivå.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 17l5-5 3 3 7-7" />
        <path d="M16 8h5v5" />
      </svg>
    ),
  },
  {
    title: "Frågor att ställa",
    desc: "Konkreta frågor till mäklare och förening.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 5h16v11H8l-4 4z" />
        <path d="M9.2 9a2.8 2.8 0 0 1 5.3 1c0 1.5-2 1.8-2 3.2" />
        <path d="M12 15.5h.01" />
      </svg>
    ),
  },
  {
    title: "Röda flaggor",
    desc: "Risker som kan påverka kostnad och framtida värde.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 21V4" />
        <path d="M5 4h11l-1.5 3.5L16 11H5" />
      </svg>
    ),
  },
];

const TOPICS = [
  { title: "Budstrategi", desc: "Öppningsbud, nästa steg och walk-away.", href: "/guider/budstrategi-bostadsratt" },
  { title: "Rimligt maxbud", desc: "Så sätter du en gräns innan budgivning.", href: "/guider/vad-ar-rimligt-maxbud" },
  { title: "BRF-årsredovisning", desc: "Vad du ska granska innan köp.", href: "/guider/analysera-brf-arsredovisning" },
  { title: "Stambyte", desc: "Risk eller möjlighet i föreningen.", href: "/guider/stambyte-bostadsratt-risk" },
  { title: "Boendekostnad", desc: "Räkna månadskostnad gratis.", href: "/verktyg/boendekostnad" },
  { title: "Checklista", desc: "Detta bör du kontrollera före bud.", href: "/guider/checklista-innan-budgivning" },
];

export default function HomePage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "calc(100vh - 116px)" }}>
      <HomeAnalytics />
      {/* Hero */}
      <section className="home-hero home-hero--solo">
        <div className="home-hero-copy">
          <p className="home-eyebrow">Beslutsstöd för bostadsköp</p>
          <h1 className="home-h1">Få koll innan du budar.</h1>
          <p className="home-lead">
            Klistra in annons, budhistorik och årsredovisning. Vi strukturerar underlaget och
            väger pris, förening och risk — så att du får en preliminär risknivå gratis. Lås upp
            hela analysen när du vill gå vidare.
          </p>
          <div className="home-hero-ctas">
            <HomeCtaLink href="/new" event="click_start_analysis" className="home-btn-primary">
              Starta analys
            </HomeCtaLink>
            <HomeAnchorCta href="#exempelrapport" event="click_example_analysis" className="home-btn-secondary">
              Se exempelanalys
            </HomeAnchorCta>
          </div>
          <p className="home-hero-disclaimer">
            <InfoIcon />
            Inte finansiell rådgivning. Bara bättre underlag inför nästa steg.
          </p>
        </div>
      </section>

      <LandingExampleReport />

      {/* Popular topics → guide (SEO internal linking) */}
      <section className="home-topics" aria-labelledby="topics-heading">
        <div className="home-report-section-head home-report-section-head--center">
          <p className="home-section-eyebrow">Att tänka på inför budgivningen</p>
          <h2 id="topics-heading" className="home-report-section-title">
            Det mesta avgörande står inte i annonsen
          </h2>
        </div>
        <div className="home-topics-grid">
          {TOPICS.map((t) => (
            <Link key={t.href} href={t.href} className="home-topic-chip">
              <span className="home-topic-chip-head">
                <span className="home-topic-chip-title">{t.title}</span>
                <svg
                  className="home-topic-chip-arrow"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </span>
              <span className="home-topic-chip-desc">{t.desc}</span>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <Link href="/guider" className="home-topics-link">
            Se alla guider →
          </Link>
        </div>
      </section>

      {/* What you get */}
      <section className="home-bottom">
        <div className="home-report-section-head home-report-section-head--center">
          <p className="home-section-eyebrow">Vad du får i rapporten</p>
          <h2 className="home-report-section-title">Tydligt underlag — inte gissningar</h2>
        </div>

        <div className="home-report-grid">
          {REPORT_ITEMS.map((item) => (
            <div key={item.title} className="home-report-card">
              <span className="home-report-icon">{item.icon}</span>
              <h3 className="home-report-card-title">{item.title}</h3>
              <p className="home-report-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="home-cta">
          <div className="home-cta-main">
            <span className="home-cta-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10.5 12 4l9 6.5" />
                <path d="M5 9.5V20h14V9.5" />
                <path d="M9.5 20v-5h5v5" />
              </svg>
            </span>
            <div className="home-cta-copy">
              <h2 className="home-cta-title">Redo att gå igenom objektet?</h2>
              <p className="home-cta-text">
                Få en preliminär risknivå gratis. Lås upp hela rapporten när du vill gå vidare.
              </p>
            </div>
          </div>
          <HomeCtaLink href="/new" event="click_start_analysis" className="home-btn-primary home-cta-btn">
            Starta analys
          </HomeCtaLink>
        </div>
      </section>

      <footer className="home-footer">
        <nav
          aria-label="Sidlänkar"
          style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "12px" }}
        >
          <Link href="/guider" className="nav-link">Guider</Link>
          <Link href="/verktyg" className="nav-link">Verktyg</Link>
          <Link href="/omraden" className="nav-link">Områden</Link>
          <Link href="/ordlista" className="nav-link">Ordlista</Link>
          <Link href="/exempel" className="nav-link">Exempelanalys</Link>
          <Link href="/new" className="nav-link">Starta analys</Link>
          <Link href="/om" className="nav-link">Om tjänsten</Link>
        </nav>
        <p>
          {PRODUCT_DOMAIN} är ett beslutsstöd och ersätter inte juridisk, ekonomisk eller finansiell
          rådgivning. Kontrollera alltid uppgifter med mäklare, förening, bank eller relevant
          expert.
        </p>
      </footer>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg className="home-disclaimer-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}
