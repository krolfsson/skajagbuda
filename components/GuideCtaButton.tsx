"use client";

import Link from "next/link";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";
import { CTA_START_ANALYSIS, CTA_START_ANALYSIS_ARROW } from "@/lib/brand";

export function GuideCtaButton({
  href,
  label,
  primary,
  event = "guide_cta_click",
}: {
  href: string;
  label: string;
  primary?: boolean;
  event?: AnalyticsEvent;
}) {
  const displayLabel =
    primary && href === "/new" && label === CTA_START_ANALYSIS
      ? CTA_START_ANALYSIS_ARROW
      : label;

  return (
    <Link
      href={href}
      className={primary ? "guide-cta-primary" : "guide-cta-secondary"}
      onClick={() => trackEvent(event, { cta: label, href })}
    >
      {displayLabel}
    </Link>
  );
}
