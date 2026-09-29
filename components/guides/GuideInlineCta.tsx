import Link from "next/link";
import { CTA_START_ANALYSIS_ARROW } from "@/lib/brand";
import { GuideCtaButton } from "@/components/GuideCtaButton";

export function GuideInlineCta({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`guide-inline-cta${compact ? " guide-inline-cta--compact" : ""}`}>
      <h2>Vill du kontrollera ett konkret objekt?</h2>
      <p>
        Klistra in länken från mäklarens hemsida. Vi hämtar underlaget där det går och strukturerar
        pris, förening och risk så att du kan jämföra mot ditt eget budtak. Just nu gratis under betan.
      </p>
      <div className="guide-cta-actions">
        <GuideCtaButton href="/new" event="guide_cta_click" label={CTA_START_ANALYSIS_ARROW} primary />
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
        Klistra in länken från mäklarens hemsida och få en analys innan du budar — just nu gratis
        under betan.
      </p>
      <div className="guide-cta-actions">
        <GuideCtaButton href="/new" event="guide_cta_click" label={CTA_START_ANALYSIS_ARROW} primary />
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
