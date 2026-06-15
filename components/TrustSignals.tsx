import {
  TRUST_PAYMENT_LINE,
  TRUST_PAYMENT_LINE_PAYWALL,
  TRUST_PRICE_LINE,
} from "@/lib/brand";

type TrustSignalsProps = {
  variant?: "cta" | "paywall";
};

export function TrustSignals({ variant = "cta" }: TrustSignalsProps) {
  if (variant === "paywall") {
    return (
      <div className="trust-signals trust-signals--paywall">
        <p className="trust-signals__line">Engångsbetalning. Ingen prenumeration.</p>
        <p className="trust-signals__line">{TRUST_PAYMENT_LINE_PAYWALL}</p>
      </div>
    );
  }

  return (
    <div className="trust-signals trust-signals--cta">
      <p className="trust-signals__line">{TRUST_PRICE_LINE}</p>
      <p className="trust-signals__line">{TRUST_PAYMENT_LINE}</p>
    </div>
  );
}
