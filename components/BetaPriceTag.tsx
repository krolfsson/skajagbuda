import { FULL_ANALYSIS_PRICE_SEK } from "@/lib/brand";

/** "BETA · 29 kr · Just nu gratis" — shown while PAYWALL_DISABLED is on. */
export function BetaPriceTag({ className = "" }: { className?: string }) {
  return (
    <p className={`beta-price-tag ${className}`.trim()}>
      <span className="beta-price-tag__badge">Beta</span>
      <span className="beta-price-tag__old" aria-label={`Ordinarie pris ${FULL_ANALYSIS_PRICE_SEK} kronor`}>
        <s>{FULL_ANALYSIS_PRICE_SEK} kr</s>
      </span>
      <span className="beta-price-tag__now">Just nu gratis</span>
    </p>
  );
}
