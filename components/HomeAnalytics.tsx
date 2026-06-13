"use client";

import { useEffect } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export function HomeAnalytics() {
  useEffect(() => {
    trackEvent("view_home");
  }, []);
  return null;
}

export function HomeCtaLink({
  href,
  event,
  className,
  children,
}: {
  href: string;
  event: "click_start_analysis" | "click_example_analysis";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => trackEvent(event)}>
      {children}
    </Link>
  );
}

export function HomeAnchorCta({
  href,
  event,
  className,
  children,
}: {
  href: string;
  event: "click_example_analysis";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className} onClick={() => trackEvent(event)}>
      {children}
    </a>
  );
}
