import type { Scorecard } from "@/lib/schemas";
import { PRODUCT_NAME } from "@/lib/brand";

const CAT_LABELS: Record<string, string> = {
  price: "Pris",
  association: "Föreningen",
  condition: "Skick",
  location: "Läge",
  liquidity: "Likviditet",
  risk: "Risk",
};

function fmtMoney(v: number | null | undefined) {
  if (!v) return "–";
  return new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(v) + " kr";
}

function bulletList(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function scorecardToMarkdown(
  title: string,
  meta: string | null,
  sc: Scorecard
): string {
  const lines: string[] = [
    `# ${title}`,
    meta ?? "",
    "",
    `**Total score:** ${sc.score}/100`,
    `**Rekommendation:** ${sc.recommendation}`,
    `**Risknivå:** ${sc.riskLevel}`,
    sc.maxBidSuggestion ? `**Föreslaget maxbud:** ${fmtMoney(sc.maxBidSuggestion)}` : "",
    "",
    "## Sammanfattning",
    sc.summary,
    "",
    "## Kategoripoäng",
    ...Object.entries(sc.categoryScores)
      .filter(([key]) => key in CAT_LABELS)
      .map(([key, val]) => `- ${CAT_LABELS[key] ?? key}: ${val}/100`),
    "",
    "## Styrkor",
    bulletList(sc.strengths),
    "",
    "## Svagheter",
    sc.weaknesses.length > 0 ? bulletList(sc.weaknesses) : "- Inga identifierade",
    "",
    "## Röda flaggor",
    sc.redFlags.length > 0 ? bulletList(sc.redFlags) : "- Inga identifierade",
    "",
    "## Frågor att ställa",
    sc.questionsToAsk.length > 0 ? bulletList(sc.questionsToAsk) : "- Inga",
    "",
    "## Budstrategi",
    `- **Öppningsbud:** ${sc.bidStrategy.openingMove}`,
    `- **Nästa steg:** ${sc.bidStrategy.nextStep}`,
    `- **Walk-away:** ${sc.bidStrategy.walkAwayPoint}`,
    `- **Strategi:** ${sc.bidStrategy.negotiationNotes}`,
    "",
    "---",
    sc.disclaimer,
    "",
    `_Exporterad från ${PRODUCT_NAME} ${new Date().toLocaleString("sv-SE")}_`,
  ];

  return lines.filter((line, i, arr) => !(line === "" && arr[i - 1] === "")).join("\n");
}

export function scorecardFilename(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9åäö]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const date = new Date().toISOString().slice(0, 10);
  return `skajagbuda-${slug || "rapport"}-${date}.md`;
}
