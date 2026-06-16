import type { GuideIconName } from "@/lib/content/types";

export function GuideIcon({ name }: { name: GuideIconName }) {
  return (
    <span className="guide-icon" aria-hidden>
      {name === "bid" && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      )}
      {name === "brf" && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 3 4 7.5V20h16V7.5L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {name === "economy" && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v18M7 8h7a3 3 0 1 1 0 6H9a3 3 0 1 0 0 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {name === "risk" && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 3 4 20h16L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M12 10v4M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {name === "checklist" && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 6h11M9 12h11M9 18h11M5 6h.01M5 12h.01M5 18h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {name === "price" && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {name === "question" && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9.5 9.5a2.5 2.5 0 0 1 4.3 1.8c0 1.7-2.8 1.8-2.8 3.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="17" r=".75" fill="currentColor" />
        </svg>
      )}
    </span>
  );
}
