import Link from "next/link";
import type { GuideWithMeta } from "@/lib/content/types";
import { GuideIcon } from "@/components/guides/GuideIcon";

export function GuideCard({ guide }: { guide: GuideWithMeta }) {
  return (
    <Link href={`/guider/${guide.slug}`} className="guide-card">
      <div className="guide-card-top">
        <GuideIcon name={guide.icon} />
        <div className="card-top-meta">
          <div className="guide-card-badges">
            {guide.popular && <span className="guide-card-badge guide-card-badge--popular">Populär</span>}
            <span className="guide-card-badge">{guide.category}</span>
          </div>
          <svg className="guide-card-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <h2 className="guide-card-title">{guide.title}</h2>
      <p className="guide-card-desc">{guide.indexDescription}</p>
    </Link>
  );
}
