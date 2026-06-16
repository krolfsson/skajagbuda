import Link from "next/link";
import { CTA_START_ANALYSIS } from "@/lib/brand";
import { GuideCtaButton } from "@/components/GuideCtaButton";

export function ToolAnalysisCta({
  title,
  text,
  compact = false,
  result = false,
  primaryLabel = CTA_START_ANALYSIS,
}: {
  title: string;
  text: string;
  compact?: boolean;
  result?: boolean;
  primaryLabel?: string;
}) {
  const className = [
    "tool-analysis-cta",
    compact ? "tool-analysis-cta--compact" : "",
    result ? "tool-analysis-cta--result" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <h3>{title}</h3>
      <p>{text}</p>
      <div className="tool-analysis-cta-actions">
        <GuideCtaButton href="/new" event="tool_cta_click" label={primaryLabel} primary />
        <Link href="/exempel" className="guide-cta-secondary">
          Se exempelanalys
        </Link>
      </div>
    </div>
  );
}
