import { summaryToBullets } from "@/lib/format-summary";
import type { Scorecard } from "@/lib/schemas";

export function fmtMoney(v: number | null | undefined) {
  if (!v) return "–";
  return new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(v) + " kr";
}

export function normalizeBid(v: number): number {
  if (v > 0 && v < 500) return v * 1_000_000;
  if (v >= 500 && v < 10_000) return v * 1_000;
  return v;
}

export function deriveConclusion(sc: Scorecard): string {
  const bullets = summaryToBullets(sc.summary);
  const bidBullet = bullets.find((b) =>
    /maxbud|slutbud|buda försiktigt|walk-away|walk away|kräv svar/i.test(b),
  );
  if (bidBullet) return bidBullet;

  const walk = sc.bidStrategy.walkAwayPoint.trim();
  if (walk.length > 10) {
    const short = walk.split(/[.—–]/)[0]?.trim();
    if (short && short.length > 15) return `${sc.recommendation} — ${short}.`;
  }

  return `${sc.recommendation}. Granska röda flaggor och frågor innan slutbud.`;
}
