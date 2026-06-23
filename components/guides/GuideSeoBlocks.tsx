import Link from "next/link";

export function GuideQuickAnswer({ items }: { items: string[] }) {
  return (
    <aside className="guide-quick-answer" aria-labelledby="guide-quick-answer-title">
      <p id="guide-quick-answer-title" className="guide-quick-answer__title">
        Snabbt svar
      </p>
      <ul className="guide-quick-answer__list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}

export function GuideInternalLinks({ links }: { links: { href: string; anchor: string }[] }) {
  if (links.length === 0) return null;
  return (
    <nav className="guide-internal-links" aria-label="Relaterade guider och verktyg">
      <p className="guide-internal-links__title">Läs också</p>
      <ul className="guide-internal-links__list">
        {links.map((link) => (
          <li key={link.href + link.anchor}>
            <Link href={link.href}>{link.anchor}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
