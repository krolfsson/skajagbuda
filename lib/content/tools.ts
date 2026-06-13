import type { ToolMeta } from "./types";

export const TOOLS: ToolMeta[] = [
  {
    slug: "boendekostnad",
    title: "Boendekostnadskalkylator",
    description: "Räkna ut ungefärlig månadskostnad för bostadsrätt – ränta, amortering och avgift.",
    metaTitle: "Boendekostnadskalkylator för bostadsrätt | skajagbuda.se",
    metaDescription:
      "Beräkna ungefärlig månadskostnad för bostadsrätt med ränta, amortering, avgift och ränteavdrag. Förenklad kalkyl – inte finansiell rådgivning.",
    relatedGuideSlugs: ["vad-ar-rimligt-maxbud", "pris-per-kvm-bostadsratt", "checklista-innan-budgivning"],
  },
  {
    slug: "brf-skuld-per-kvm",
    title: "BRF skuld per kvm",
    description: "Räkna ut föreningens skuld per kvm och få en preliminär riskindikation.",
    metaTitle: "BRF skuld per kvm – kalkylator | skajagbuda.se",
    metaDescription:
      "Beräkna skuld per kvm i bostadsrättsföreningen och se en förenklad riskindikation. Komplettera med årsredovisning och full analys.",
    relatedGuideSlugs: [
      "vad-ar-hog-skuld-per-kvm-brf",
      "analysera-brf-arsredovisning",
      "avgiftshojning-brf",
    ],
  },
  {
    slug: "maxbud",
    title: "Maxbud-kalkylator",
    description: "Uppskatta ungefärligt maxpris utifrån månadskostnad du är bekväm med.",
    metaTitle: "Maxbud-kalkylator – vad har du råd med? | skajagbuda.se",
    metaDescription:
      "Räkna ut ungefärligt maxbud utifrån kontantinsats, ränta, avgift och månadskostnad. Förenklad indikation – jämför med objektets risk.",
    relatedGuideSlugs: ["vad-ar-rimligt-maxbud", "budstrategi-bostadsratt", "hur-mycket-ska-man-buda-over-utgangspris"],
  },
];

export function getToolBySlug(slug: string) {
  return TOOLS.find((t) => t.slug === slug);
}

export function getAllToolSlugs() {
  return TOOLS.map((t) => t.slug);
}
