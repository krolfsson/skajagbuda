import type { ContentSource } from "@/lib/content/types";

export function ContentSources({ sources }: { sources: ContentSource[] }) {
  if (sources.length === 0) return null;
  return (
    <section className="guide-section guide-sources" aria-labelledby="kallor">
      <h2 id="kallor" className="guide-h2">
        Källor
      </h2>
      <ul className="guide-list">
        {sources.map((s) => (
          <li key={s.href}>
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
