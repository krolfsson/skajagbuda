import type { Scorecard } from "@/lib/schemas";
import { PRODUCT_NAME } from "@/lib/brand";
import { fmtMoney, fmtMoneyRange, normalizeBid } from "@/lib/report-ui";

const CAT_LABELS: Record<string, string> = {
  price: "Pris",
  association: "Föreningen",
  condition: "Skick",
  location: "Läge",
  liquidity: "Likviditet",
  risk: "Risk",
};

function bulletList(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function scorecardToMarkdown(
  title: string,
  meta: string | null,
  sc: Scorecard
): string {
  const intervals = sc.bidIntervals;
  const ceiling = intervals.recommendedCeiling ?? sc.maxBidSuggestion;

  const lines: string[] = [
    `# ${title}`,
    meta ?? "",
    "",
    `**Total score:** ${sc.score}/100`,
    `**Rekommendation:** ${sc.recommendation}`,
    `**Risknivå:** ${sc.riskLevel}`,
    "",
    "## Rekommenderat budintervall",
    `- **Rimligt värde:** ${fmtMoneyRange(intervals.fairValueLow, intervals.fairValueHigh)}`,
    ceiling ? `- **Rekommenderat budtak:** ${fmtMoney(normalizeBid(ceiling))}` : "",
    intervals.stretchLevel ? `- **Stretch:** ${fmtMoney(normalizeBid(intervals.stretchLevel))}` : "",
    intervals.walkAwayLevel ? `- **Walk-away:** över ${fmtMoney(normalizeBid(intervals.walkAwayLevel))}` : "",
    intervals.uncertaintyNote ? `- _${intervals.uncertaintyNote}_` : "",
    sc.budgetContext.budgetVsRecommendation ? `- **Budget vs analys:** ${sc.budgetContext.budgetVsRecommendation}` : "",
    "",
    "## Prisbild och jämförelse",
    `- **Bedömning:** ${sc.priceAnalysis.verdict}`,
    `- **Utgångspris:** ${sc.priceAnalysis.askingPriceNote}`,
    `- **Pris/kvm:** ${sc.priceAnalysis.pricePerSqmNote}`,
    `- **Områdesjämförelse:** ${sc.priceAnalysis.areaComparison}`,
    sc.priceAnalysis.priorSalesNote ? `- **Tidigare försäljningar:** ${sc.priceAnalysis.priorSalesNote}` : "",
    sc.priceAnalysis.missingComparablesNote ? `- _${sc.priceAnalysis.missingComparablesNote}_` : "",
    `- **Slutsats:** ${sc.priceAnalysis.conclusion}`,
    "",
  ];

  if (sc.comparisonObjects.length > 0) {
    lines.push("### Jämförelseobjekt");
    for (const comp of sc.comparisonObjects) {
      const parts = [comp.address];
      if (comp.sqm) parts.push(`${comp.sqm} kvm`);
      if (comp.soldPrice) parts.push(`såld ${fmtMoney(normalizeBid(comp.soldPrice))}`);
      if (comp.comment) parts.push(comp.comment);
      lines.push(`- ${parts.join(" — ")}${comp.isSameAddress ? " _(samma adress)_" : ""}`);
    }
    lines.push("");
  }

  lines.push(
    "## Föreningsrisk",
    sc.associationRiskSummary,
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
    "## Argument i budgivningen",
    "### Hålla nere budet",
    bulletList(sc.bidArguments.holdBack),
    "",
    "### Motivera premium",
    sc.bidArguments.premiumJustification.length > 0
      ? bulletList(sc.bidArguments.premiumJustification)
      : "- Inga tydliga premiumargument",
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
  );

  return lines.filter((line, i, arr) => !(line === "" && arr[i - 1] === "")).join("\n");
}

function scorecardSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9åäö]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export function scorecardFilename(title: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `skajagbuda-${scorecardSlug(title) || "rapport"}-${date}.md`;
}

export function scorecardPdfFilename(title: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `skajagbuda-${scorecardSlug(title) || "rapport"}-${date}.pdf`;
}
