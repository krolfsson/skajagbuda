import { summaryToBullets } from "@/lib/format-summary";
import type { Scorecard } from "@/lib/schemas";

export function fmtMoney(v: number | null | undefined) {
  if (!v) return "–";
  return new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(v) + " kr";
}

export function normalizeBid(v: number): number {
  if (v > 0 && v < 500) return v * 1_000_000;
  if (v >= 500 && v < 10_000) return v * 1_000;
  return v;
}

function cleanPoint(text: string): string {
  return text.replace(/^[-•*]\s+/, "").trim();
}

function firstSentence(text: string, max = 120): string {
  const cleaned = cleanPoint(text);
  const sentence = cleaned.split(/[.—–]/)[0]?.trim() ?? cleaned;
  return sentence.length > max ? `${sentence.slice(0, max - 1).trim()}…` : sentence;
}

export function deriveScoreInterpretation(sc: Scorecard): string {
  if (sc.score >= 78) return "Starkt case";
  if (sc.score >= 66) return "Medelstarkt case";
  if (sc.score >= 52) return "Blandat case";
  return "Svagt case";
}

export function deriveScoreSubtext(sc: Scorecard): string {
  const cats = sc.categoryScores;
  const labels: Record<string, string> = {
    price: "prisbilden",
    association: "föreningen",
    condition: "skicket",
    location: "läget",
    liquidity: "likviditeten",
    risk: "riskbilden",
  };

  const sorted = Object.entries(cats)
    .filter(([key]) => key in labels)
    .sort(([, a], [, b]) => b - a);

  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  if (best && worst && best[0] !== worst[0]) {
    const up = labels[best[0]] ?? best[0];
    const down = labels[worst[0]] ?? worst[0];
    if (best[1] - worst[1] >= 12) {
      return `${up.charAt(0).toUpperCase()}${up.slice(1)} väger upp, men ${down} drar ner.`;
    }
  }

  if (sc.strengths[0] && sc.weaknesses[0]) {
    return `${firstSentence(sc.strengths[0], 55)} — men ${firstSentence(sc.weaknesses[0], 55).toLowerCase()}.`;
  }

  return "Bedömningen bygger på tillgängligt objekt- och föreningsunderlag.";
}

export function deriveRiskExplanation(sc: Scorecard): string {
  const reason =
    sc.redFlags[0] ??
    sc.weaknesses[0] ??
    (sc.categoryScores.price < 50 ? "hög prisnivå relativt underlaget" : null);

  if (reason) {
    return `${sc.riskLevel} — främst på grund av ${firstSentence(reason, 90).toLowerCase()}.`;
  }

  return `${sc.riskLevel} — ingen enskild risk dominerar, men kontrollera underlaget innan nästa bud.`;
}

export function deriveConclusion(sc: Scorecard): string {
  const bullets = summaryToBullets(sc.summary);
  const bidBullet = bullets.find((b) =>
    /maxbud|slutbud|buda försiktigt|walk-away|walk away|kräv svar/i.test(b),
  );
  if (bidBullet) return bidBullet;

  const walk = sc.bidStrategy.walkAwayPoint.trim();
  if (walk.length > 10) {
    const short = walk.split(/[.—–]/)[0]?.trim();
    if (short && short.length > 15) return `${sc.recommendation} — ${short}.`;
  }

  return `${sc.recommendation}. Granska röda flaggor och frågor innan slutbud.`;
}

export function deriveConclusionBox(sc: Scorecard): string {
  const bullets = summaryToBullets(sc.summary);
  const whyParts: string[] = [];

  if (bullets.length >= 2) {
    whyParts.push(cleanPoint(bullets[0]), cleanPoint(bullets[1]));
  } else if (bullets.length === 1) {
    whyParts.push(cleanPoint(bullets[0]));
  } else if (sc.weaknesses[0]) {
    whyParts.push(firstSentence(sc.weaknesses[0], 100));
  }

  if (sc.strengths[0] && whyParts.length < 2) {
    whyParts.unshift(firstSentence(sc.strengths[0], 90));
  }

  const why = whyParts.filter(Boolean).join(" ").trim();
  const maxBid = sc.maxBidSuggestion ? fmtMoney(normalizeBid(sc.maxBidSuggestion)) : null;

  let action = sc.bidStrategy.nextStep.trim();
  if (maxBid && !/gå inte över|maxbud|walk-away/i.test(action)) {
    action = `Gå inte över ${maxBid} utan bättre underlag om budhistorik, jämförbara slutpriser och eventuella avgiftshöjningar.`;
  } else if (!action) {
    action = "Kontrollera budhistorik, föreningens ekonomi och planerade avgiftshöjningar innan du höjer.";
  }

  const lead = sc.recommendation.endsWith(".") ? sc.recommendation : `${sc.recommendation}.`;
  return why ? `${lead} ${why} ${action}` : `${lead} ${action}`;
}

export function deriveDecisionSummary(sc: Scorecard): string {
  const bullets = summaryToBullets(sc.summary);
  if (bullets.length >= 3) {
    return bullets
      .slice(0, 3)
      .map(cleanPoint)
      .join(" ");
  }

  const parts: string[] = [];
  const positive =
    sc.strengths[0] ??
    (sc.categoryScores.association >= 60 ? "Föreningen ser stabil ut utifrån tillgängligt underlag." : null);
  const negative = sc.weaknesses[0] ?? sc.redFlags[0];
  const maxBid = sc.maxBidSuggestion ? fmtMoney(normalizeBid(sc.maxBidSuggestion)) : null;

  if (positive) parts.push(`${firstSentence(positive, 110)}.`);
  if (negative) {
    parts.push(
      `Den största risken är ${firstSentence(negative, 100).toLowerCase().replace(/\.$/, "")}.`,
    );
  }

  if (maxBid) {
    parts.push(
      `Rekommendationen är att ${sc.recommendation.toLowerCase()} och hålla maxnivån runt ${maxBid} tills mer data finns.`,
    );
  } else {
    parts.push(`${sc.recommendation}. Granska frågorna och svagheterna innan nästa bud.`);
  }

  if (parts.length === 0 && sc.oneSentenceSummary) {
    return sc.oneSentenceSummary;
  }

  return parts.slice(0, 3).join(" ");
}

export function deriveNextSteps(sc: Scorecard): string[] {
  const steps: string[] = [];
  const seen = new Set<string>();

  function add(step: string) {
    const key = step.toLowerCase();
    if (!seen.has(key) && steps.length < 5) {
      seen.add(key);
      steps.push(step);
    }
  }

  for (const q of sc.questionsToAsk.slice(0, 2)) {
    if (/budhistorik|bud/i.test(q)) add("Be mäklaren om aktuell budhistorik.");
    else if (/slutpris|jämför|marknad/i.test(q)) add("Jämför med slutpriser för liknande objekt i området.");
    else if (/avgift|höj/i.test(q)) add("Fråga föreningen om planerade avgiftshöjningar.");
    else if (/underhåll|stambyte|renover/i.test(q)) add("Kontrollera underhållsplanen och planerade större åtgärder.");
  }

  add("Be mäklaren om aktuell budhistorik.");
  add("Jämför med slutpriser för liknande objekt i området.");

  if (sc.weaknesses.some((w) => /avgift|förening|stambyte|tomträtt|lån/i.test(w))) {
    add("Fråga föreningen om planerade avgiftshöjningar och större investeringar.");
  }

  if (sc.weaknesses.some((w) => /underhåll|stambyte|renover/i.test(w))) {
    add("Kontrollera underhållsplanen.");
  }

  if (sc.maxBidSuggestion) {
    add(`Gå inte över ${fmtMoney(normalizeBid(sc.maxBidSuggestion))} utan ny information.`);
  } else {
    add("Sätt en tydlig maxnivå innan budgivningen och håll dig till den.");
  }

  return steps.slice(0, 5);
}

export function deriveWalkAwayAmount(sc: Scorecard): string | null {
  const text = sc.bidStrategy.walkAwayPoint;
  const match = text.match(/(\d[\d\s]{5,}|\d+[,.]?\d*)\s*(kr|mkr|Mkr)/i);
  if (match) {
    const raw = match[1].replace(/\s/g, "").replace(",", ".");
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) {
      if (/mkr/i.test(match[2]) || n < 500) return fmtMoney(normalizeBid(n));
      return fmtMoney(n);
    }
  }
  if (sc.maxBidSuggestion) return fmtMoney(normalizeBid(sc.maxBidSuggestion));
  return null;
}

export const CATEGORY_LABELS: Record<string, string> = {
  price: "Pris",
  association: "Föreningen",
  condition: "Skick",
  location: "Läge",
  liquidity: "Likviditet",
  risk: "Riskbild",
};

export const CATEGORY_HINTS: Record<string, string> = {
  price: "Hur rimligt priset verkar mot objektets data",
  association: "Ekonomi och stabilitet",
  condition: "Objektets skick och underhåll",
  location: "Lägesstyrka",
  liquidity: "Hur lätt objektet bedöms vara att sälja",
  risk: "Hur kontrollerad riskbilden är",
};
