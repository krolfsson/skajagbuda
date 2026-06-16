/** Turn AI summary text into scannable bullet lines for display. */
export function summaryToBullets(summary: string): string[] {
  const trimmed = summary.trim();
  if (!trimmed) return [];

  const lines = trimmed.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const explicitBullets = lines
    .filter((l) => /^[-•*]\s+/.test(l))
    .map((l) => l.replace(/^[-•*]\s+/, "").trim())
    .filter(Boolean);

  if (explicitBullets.length >= 2) return explicitBullets;

  const paragraphs = trimmed.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length >= 2) return paragraphs;

  return [trimmed];
}
