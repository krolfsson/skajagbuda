import Link from "next/link";
import type { ReactNode } from "react";
import { CTA_START_ANALYSIS_ARROW } from "@/lib/brand";

type InfoPageLayoutProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
  showCta?: boolean;
};

export function InfoPageLayout({
  eyebrow,
  title,
  lead,
  children,
  showCta = false,
}: InfoPageLayoutProps) {
  return (
    <div className="info-page">
      <div className="info-page-inner">
        {eyebrow && <p className="info-page-eyebrow">{eyebrow}</p>}
        <h1 className="info-page-h1">{title}</h1>
        {lead && <p className="info-page-lead">{lead}</p>}
        <div className="info-page-content">{children}</div>
        {showCta && (
          <div className="info-page-cta">
            <Link href="/new" className="home-btn-primary">
              {CTA_START_ANALYSIS_ARROW}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="info-page-section">
      <h2 className="info-page-h2">{title}</h2>
      {children}
    </section>
  );
}
