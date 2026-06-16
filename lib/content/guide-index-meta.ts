import type { GuideCategory, GuideIconName } from "./types";

type GuideIndexFields = {
  category: GuideCategory;
  indexDescription: string;
  icon: GuideIconName;
  popular?: boolean;
};

/** Index/card metadata keyed by guide slug. */
export const GUIDE_INDEX_FIELDS: Record<string, GuideIndexFields> = {
  "ska-jag-buda-pa-bostadsratt": {
    category: "Budgivning",
    icon: "bid",
    popular: true,
    indexDescription:
      "Gör en snabb kontroll av pris, BRF och boendekostnad innan du lägger första budet.",
  },
  "hur-mycket-ska-man-buda-over-utgangspris": {
    category: "Budgivning",
    icon: "bid",
    indexDescription:
      "Utgångspriset är en strategi, inte ett facit. Så tänker du kring överbud.",
  },
  "vad-ar-rimligt-maxbud": {
    category: "Ekonomi",
    icon: "economy",
    indexDescription:
      "Sätt ett maxbud utifrån kostnad, risk och jämförelsepriser – inte känsla.",
  },
  "budstrategi-bostadsratt": {
    category: "Budgivning",
    icon: "bid",
    indexDescription:
      "Planera budnivåer, timing och när du ska lägga dig – innan budgivningen drar iväg.",
  },
  "vad-ska-man-fraga-maklaren-innan-bud": {
    category: "Budgivning",
    icon: "question",
    popular: true,
    indexDescription:
      "Konkreta frågor om förening, underhåll och budläge innan du höjer budet.",
  },
  "analysera-brf-arsredovisning": {
    category: "BRF",
    icon: "brf",
    indexDescription:
      "Vad du ska leta efter i årsredovisningen innan du budar.",
  },
  "vad-ar-hog-skuld-per-kvm-brf": {
    category: "BRF",
    icon: "brf",
    popular: true,
    indexDescription:
      "Tolka skuld per kvm och vad som är rimligt – och vad som är en varningssignal.",
  },
  "stambyte-bostadsratt-risk": {
    category: "Risk",
    icon: "risk",
    indexDescription:
      "Hur stambyte påverkar avgift, risk och vad du ska fråga om innan bud.",
  },
  "avgiftshojning-brf": {
    category: "BRF",
    icon: "brf",
    indexDescription:
      "Varför avgiften höjs, hur du läser signalerna och vad som är normalt.",
  },
  "underhallsplan-brf": {
    category: "BRF",
    icon: "brf",
    indexDescription:
      "Planerat underhåll, finansiering och hur det påverkar din boendekostnad.",
  },
  "kassa-i-bostadsrattsforening": {
    category: "BRF",
    icon: "brf",
    indexDescription:
      "Föreningens kassa, likviditet och varför den säger mer än du tror.",
  },
  "pris-per-kvm-bostadsratt": {
    category: "Pris",
    icon: "price",
    indexDescription:
      "Jämför pris per kvm mot område och objekt – utan att fastna i fel siffror.",
  },
  "kopa-bostadsratt-stockholm": {
    category: "Budgivning",
    icon: "bid",
    indexDescription:
      "Praktiska saker att tänka på när du köper bostadsrätt i Stockholm.",
  },
  "budgivning-stockholm": {
    category: "Budgivning",
    icon: "bid",
    indexDescription:
      "Så fungerar budgivning i Stockholm och hur du håller huvudet kallt.",
  },
  "roda-flaggor-bostadsratt": {
    category: "Risk",
    icon: "risk",
    indexDescription:
      "Vanliga varningssignaler i annons, förening och budprocess.",
  },
  "for-lag-avgift-bostadsratt": {
    category: "Risk",
    icon: "risk",
    indexDescription:
      "En låg avgift kan vara positivt – eller ett tecken på undersparande.",
  },
  "lokalfastigheter-brf-risk": {
    category: "Risk",
    icon: "risk",
    indexDescription:
      "När lokaler i föreningen skapar intäkter – eller dold risk.",
  },
  "tomtratt-bostadsratt": {
    category: "Risk",
    icon: "risk",
    indexDescription:
      "Tomträtt, avgäld och varför det kan påverka avgiften framåt.",
  },
  "besiktning-bostadsratt": {
    category: "Checklista",
    icon: "checklist",
    indexDescription:
      "Vad du kan och bör kontrollera vid visning och besiktning.",
  },
  "checklista-innan-budgivning": {
    category: "Checklista",
    icon: "checklist",
    indexDescription:
      "Snabb checklista innan du lägger bud – pris, förening, kostnad och risk.",
  },
};

export const DEFAULT_GUIDE_INDEX: GuideIndexFields = {
  category: "Budgivning",
  icon: "bid",
  indexDescription: "Praktisk guide inför budgivning och bostadsköp.",
};

export function getGuideIndexFields(slug: string): GuideIndexFields {
  return GUIDE_INDEX_FIELDS[slug] ?? DEFAULT_GUIDE_INDEX;
}
