import { isPaywallDisabled } from "@/lib/paywall";

export function DevBypassBanner() {
  const viaPaywallFlag = isPaywallDisabled();

  const hint = viaPaywallFlag
    ? "PAYWALL_DISABLED=true"
    : "DEV_BYPASS_PAYMENT=true";

  return (
    <div
      className="no-print"
      style={{
        maxWidth: "960px",
        margin: "0 auto 16px",
        padding: "10px 14px",
        background: "#fffbeb",
        border: "1px solid #f0e0a8",
        borderRadius: "var(--radius-sm)",
        fontSize: "12px",
        color: "#7a6520",
        lineHeight: 1.5,
      }}
    >
      Betalväggen är avstängd via <code>{hint}</code>
      {viaPaywallFlag ? " — sätt PAYWALL_DISABLED=false för att aktivera betalning igen." : " i .env."}
    </div>
  );
}
