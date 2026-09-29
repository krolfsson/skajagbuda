import Link from "next/link";
import type { ReactNode } from "react";

const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Renders "[anchor](/path)" inside content strings as links. */
export function InlineText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK_RE)) {
    const [whole, anchor, href] = m;
    const start = m.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      href.startsWith("/") ? (
        <Link key={start} href={href}>
          {anchor}
        </Link>
      ) : (
        <a key={start} href={href} target="_blank" rel="noopener noreferrer">
          {anchor}
        </a>
      )
    );
    last = start + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/** Same text without link markup — for meta tags and JSON-LD. */
export function plainText(text: string): string {
  return text.replace(LINK_RE, "$1");
}

export function formatUpdated(iso: string): string {
  return new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso)
  );
}
