type ToolIconName = "cost" | "brf" | "maxbud";

export function ToolIcon({ name }: { name: ToolIconName }) {
  return (
    <span className="tool-icon" aria-hidden>
      {name === "cost" && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M9 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {name === "brf" && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3 4 7.5V20h16V7.5L12 3Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M9 12h6M9 16h6M12 9v7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
      {name === "maxbud" && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
        </svg>
      )}
    </span>
  );
}
