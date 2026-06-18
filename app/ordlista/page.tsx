import type { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY } from "@/lib/content/glossary";
import { AnalyticsPageView } from "@/components/AnalyticsPageView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: "/ordlista",
  title: "Ordlista – begrepp vid bostadsköp",
  description:
    "Förklaringar av skuld per kvm, stambyte, tomträtt, årsavgift, underhållsplan och fler begrepp du möter vid köp av bostadsrätt.",
});

export default function OrdlistaIndexPage() {
  return (
    <div className="content-index">
      <AnalyticsPageView event="view_guide" payload={{ page: "ordlista_index" }} />
      <p className="guide-eyebrow">Ordlista</p>
      <h1 className="guide-h1">Bostadsordlista</h1>
      <p className="guide-lead">
        Korta förklaringar av begrepp du möter i årsredovisning, annons och budgivning – och varför
        de spelar roll innan du budar.
      </p>
      <ul className="content-index-grid content-index-grid--compact">
        {GLOSSARY.map((t) => (
          <li key={t.slug}>
            <Link href={`/ordlista/${t.slug}`} className="content-index-card">
              <span className="content-index-card-title">{t.term}</span>
              <svg className="content-index-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
