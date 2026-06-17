import Link from "next/link";
import { CTA_START_ANALYSIS, CTA_START_ANALYSIS_ARROW } from "@/lib/brand";
import { GuideCtaButton } from "@/components/GuideCtaButton";

export function GuideInlineCta({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`guide-inline-cta${compact ? " guide-inline-cta--compact" : ""}`}>
      <h2>Vill du kontrollera ett konkret objekt?</h2>
      <p>
        Klistra in objektlänken. Vi hämtar underlaget där det går och låter AI hjälpa dig väga
        pris, förening och risk.
      </p>
      <div className="guide-cta-actions">
        <GuideCtaButton href="/new" event="guide_cta_click" label={CTA_START_ANALYSIS} primary />
        <Link href="/exempel" className="guide-cta-secondary">
          Se exempelanalys
        </Link>
      </div>
    </div>
  );
}

export function GuideIndexCta() {
  return (
    <div className="guide-inline-cta guide-index-mid-cta">
      <h2>Har du redan hittat ett objekt?</h2>
      <p>
        Klistra in objektlänken och få en preliminär risknivå gratis innan du budar.
      </p>
      <div className="guide-cta-actions">
        <GuideCtaButton href="/new" event="guide_cta_click" label={CTA_START_ANALYSIS} primary />
        <Link href="/exempel" className="guide-cta-secondary">
          Se exempelanalys
        </Link>
      </div>
    </div>
  );
}

export function GuideSectionCta() {
  return (
    <p className="guide-section-cta">
      Vill du väga detta mot ett konkret objekt?{" "}
      <Link href="/new" className="guide-section-cta-link">
        {CTA_START_ANALYSIS_ARROW}
      </Link>
    </p>
  );
}
