"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEvent, type AnalyticsPayload } from "@/lib/analytics";

export function AnalyticsPageView({
  event,
  payload,
}: {
  event: AnalyticsEvent;
  payload?: AnalyticsPayload;
}) {
  useEffect(() => {
    trackEvent(event, payload);
  }, [event, payload]);

  return null;
}
