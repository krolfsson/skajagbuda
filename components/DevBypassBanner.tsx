export function DevBypassBanner() {
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
      Dev-läge: betalväggen är avstängd via <code>DEV_BYPASS_PAYMENT=true</code> i .env.
    </div>
  );
}
