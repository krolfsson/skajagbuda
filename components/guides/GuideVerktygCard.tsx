import Link from "next/link";
import { GuideIcon } from "@/components/guides/GuideIcon";

export function GuideVerktygCard() {
  return (
    <Link href="/verktyg" className="guide-card">
      <div className="guide-card-top">
        <GuideIcon name="economy" />
        <div className="card-top-meta">
          <div className="guide-card-badges">
            <span className="guide-card-badge">Verktyg</span>
          </div>
          <svg className="guide-card-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <h2 className="guide-card-title">Gratis kalkylatorer inför bud</h2>
      <p className="guide-card-desc">
        Räkna boendekostnad, maxbud och BRF-skuld per kvm innan du lägger första budet.
      </p>
    </Link>
  );
}
