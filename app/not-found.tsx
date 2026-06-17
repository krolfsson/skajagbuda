import Link from "next/link";
import type { Metadata } from "next";
import { NOINDEX_ROBOTS, PILLAR_LINKS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sidan hittades inte",
  robots: NOINDEX_ROBOTS,
};

export default function NotFound() {
  return (
    <div className="guide-page" style={{ textAlign: "center", paddingTop: 48, paddingBottom: 80 }}>
      <p className="guide-eyebrow">404</p>
      <h1 className="guide-h1">Sidan finns inte</h1>
      <p className="guide-lead" style={{ margin: "0 auto 28px" }}>
        Länken kan vara fel, eller sidan har flyttats. Prova någon av våra guider och verktyg inför budgivningen.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        <Link href="/" className="guide-cta-primary">Till startsidan</Link>
        <Link href={PILLAR_LINKS.guider.href} className="guide-cta-secondary">{PILLAR_LINKS.guider.label}</Link>
        <Link href={PILLAR_LINKS.verktyg.href} className="guide-cta-secondary">{PILLAR_LINKS.verktyg.label}</Link>
        <Link href={PILLAR_LINKS.attTankaPa.href} className="guide-cta-secondary">{PILLAR_LINKS.attTankaPa.label}</Link>
      </div>
    </div>
  );
}
