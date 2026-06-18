import type { Metadata } from "next";
import Link from "next/link";
import { ExampleReport } from "@/components/ExampleReport";
import { CTA_START_ANALYSIS_ARROW } from "@/lib/brand";
import { buildPageMetadata } from "@/lib/seo";

const TITLE = "Exempelanalys – så ser en full bostadsanalys ut";
const DESCRIPTION =
  "Se en komplett exempelanalys med score, risknivå, rekommenderat maxbud, budstrategi, föreningsrisk, röda flaggor och frågor att ställa – allt annonsen inte berättar.";

export const metadata: Metadata = buildPageMetadata({
  path: "/exempel",
  title: TITLE,
  description: DESCRIPTION,
  type: "article",
});

export default function ExempelPage() {
  return (
    <div className="full-report-page">
      <div className="full-report-page__inner">
        <div className="exempel-page__toolbar no-print">
          <Link href="/" className="full-report-page__back">
            ← Tillbaka
          </Link>
          <span className="exempel-page__badge">Exempelanalys</span>
        </div>

        <div className="analysis-report-shell">
          <ExampleReport />
        </div>

        <div className="exempel-page__cta no-print">
          <p>Kör en riktig analys på bostaden du tittar på</p>
          <Link href="/new" className="guide-cta-primary">
            {CTA_START_ANALYSIS_ARROW}
          </Link>
        </div>
      </div>
    </div>
  );
}
