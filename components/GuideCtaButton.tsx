"use client";

import Link from "next/link";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

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
  return (
    <Link
      href={href}
      className={primary ? "guide-cta-primary" : "guide-cta-secondary"}
      onClick={() => trackEvent(event, { cta: label, href })}
    >
      {label}
    </Link>
  );
}
