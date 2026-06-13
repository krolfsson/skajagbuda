"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function ResultAnalytics({
  event,
  analysisId,
}: {
  event: "paywall_viewed" | "full_analysis_completed" | "purchase_completed";
  analysisId: string;
}) {
  useEffect(() => {
    trackEvent(event, { analysisId });
  }, [event, analysisId]);
  return null;
}
