import type { GuideCallout, GuideCalloutType } from "@/lib/content/types";

const CALLOUT_LABELS: Record<GuideCalloutType, string> = {
  remember: "Kom ihåg",
  "red-flag": "Röd flagga",
  tip: "Tips",
  "ask-broker": "Fråga mäklaren",
};

function inferCalloutType(text: string): GuideCalloutType {
  if (/fråga|ställa till|mäkl/i.test(text)) return "ask-broker";
  if (/varning|röd|flagg|dölja|underspar|tecken på att/i.test(text)) return "red-flag";
  if (/tips|tänk på/i.test(text)) return "tip";
  return "remember";
}

export function normalizeGuideCallout(callout: string | GuideCallout): GuideCallout {
  if (typeof callout === "object") return callout;
  return { type: inferCalloutType(callout), text: callout };
}

export function GuideCalloutBox({ callout }: { callout: string | GuideCallout }) {
  const normalized = normalizeGuideCallout(callout);
  const label = normalized.title ?? CALLOUT_LABELS[normalized.type];

  return (
    <aside className={`guide-callout guide-callout--${normalized.type}`}>
      <p className="guide-callout-label">{label}</p>
      <p className="guide-callout-text">{normalized.text}</p>
    </aside>
  );
}
