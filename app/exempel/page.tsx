import type { Metadata } from "next";
import Link from "next/link";
import { ExampleReport } from "@/components/ExampleReport";
import { SITE_URL, CTA_START_ANALYSIS } from "@/lib/brand";

const TITLE = "Exempelanalys – så ser en full bostadsanalys ut";
const DESCRIPTION =
  "Se en komplett exempelanalys med score, risknivå, rekommenderat maxbud, budstrategi, föreningsrisk, röda flaggor och frågor att ställa – allt annonsen inte berättar.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/exempel" },
  openGraph: {
    type: "article",
    url: `${SITE_URL}/exempel`,
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function ExempelPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "calc(100vh - 116px)", padding: "24px 16px 80px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <Link href="/" style={{ fontSize: "13px", color: "var(--muted)", textDecoration: "none" }}>
            ← Tillbaka
          </Link>
          <span style={{
            fontSize: "11px", padding: "4px 10px",
            background: "var(--brand-light)", border: "1px solid var(--brand-border)",
            borderRadius: "20px", color: "var(--brand)", fontWeight: 500,
          }}>
            Exempelanalys
          </span>
        </div>

        <ExampleReport />

        {/* CTA */}
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "12px" }}>
            Kör en riktig analys på bostaden du tittar på
          </p>
          <Link href="/new" style={{
            display: "inline-block", fontSize: "13px", fontWeight: 600,
            padding: "10px 24px", background: "var(--brand)", color: "#fff",
            borderRadius: "6px", textDecoration: "none",
          }}>
            {CTA_START_ANALYSIS}
          </Link>
        </div>
      </div>
    </div>
  );
}
