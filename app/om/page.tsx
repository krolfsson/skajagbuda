import type { Metadata } from "next";
import { PRODUCT_DOMAIN } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Om tjänsten",
  description: `${PRODUCT_DOMAIN} är ett beslutsstöd för bostadsköpare i Sverige som strukturerar information om bostaden och belyser risker och möjligheter inför budgivningen.`,
  alternates: { canonical: "/om" },
};

export default function OmPage() {
  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "60px 24px" }}>
      <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "20px" }}>
        Om tjänsten
      </p>
      <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "20px" }}>
        Ska jag buda?
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[
          "Ska jag buda? är ett beslutsstöd för bostadsköpare i Sverige.",
          "Du matar in fakta om bostaden — pris, avgift, föreningens ekonomi, planerade renoveringar och din egen budget — och systemet returnerar ett strukturerat scorecard.",
          "Tjänsten är inte finansiell rådgivning. Den är ett verktyg för att strukturera information och belysa risker och möjligheter innan du fattar ett av de största ekonomiska besluten i ditt liv.",
          "Gör alltid din egen bedömning och rådgör med bank och eventuellt en oberoende mäklare eller jurist.",
        ].map((p, i) => (
          <p key={i} style={{ fontSize: "14px", color: i === 0 ? "var(--fg)" : "var(--muted)", lineHeight: 1.75 }}>
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
