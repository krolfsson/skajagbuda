export type AnalyticsEvent =
  | "view_home"
  | "click_start_analysis"
  | "click_example_analysis"
  | "view_guide"
  | "guide_cta_click"
  | "view_tool"
  | "tool_calculated"
  | "tool_cta_click"
  | "analysis_started"
  | "free_risk_completed"
  | "paywall_viewed"
  | "checkout_clicked"
  | "purchase_completed"
  | "full_analysis_completed";

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

/** Hook-ready analytics — koppla till GA/Plausible/PostHog senare. */
export function trackEvent(event: AnalyticsEvent, payload?: AnalyticsPayload) {
  if (typeof window === "undefined") return;

  const detail = { event, ...payload, ts: Date.now() };

  window.dispatchEvent(new CustomEvent("skajagbuda_analytics", { detail }));

  if (window.dataLayer) {
    window.dataLayer.push({ event, ...payload });
  }

  if (window.plausible) {
    window.plausible(event, {
      props: Object.fromEntries(
        Object.entries(payload ?? {}).map(([k, v]) => [k, String(v)])
      ),
    });
  }
}
