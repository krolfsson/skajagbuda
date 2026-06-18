export function AdminEmptyState({
  title,
  description,
  icon = "default",
  compact = false,
}: {
  title: string;
  description?: string;
  icon?: "default" | "wallet";
  compact?: boolean;
}) {
  return (
    <div className={`admin-empty-state${compact ? " admin-empty-state--compact" : ""}`}>
      <span className="admin-empty-state__icon" aria-hidden="true">
        {icon === "wallet" ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 8h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M16 12h4v4h-4a2 2 0 0 1 0-4Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </span>
      <p className="admin-empty-state__title">{title}</p>
      {description && <p className="admin-empty-state__desc">{description}</p>}
    </div>
  );
}
