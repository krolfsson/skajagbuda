export function ToolResultHero({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="tool-result-hero">
      <h2 className="tool-result-hero-title">{label}</h2>
      <p className="tool-result-hero-value">
        {value}
        {suffix && <span className="tool-result-hero-suffix">{suffix}</span>}
      </p>
    </div>
  );
}

export function ToolResultStats({
  items,
}: {
  items: Array<{ label: string; value: string; strong?: boolean }>;
}) {
  return (
    <dl className="tool-result-stats">
      {items.map((item) => (
        <div key={item.label} className="tool-result-stat">
          <dt>{item.label}</dt>
          <dd className={item.strong ? "tool-result-stat--strong" : undefined}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ToolRiskBadge({ level }: { level: string }) {
  const key = level.toLowerCase();
  const mod =
    key === "låg" || key === "lag"
      ? "low"
      : key === "medel"
        ? "med"
        : key === "hög" || key === "hog"
          ? "high"
          : "neutral";
  return <span className={`tool-risk-badge tool-risk-badge--${mod}`}>{level}</span>;
}
