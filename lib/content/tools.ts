import type { ToolMeta } from "./types";

export const TOOLS: ToolMeta[] = [
  {
    slug: "boendekostnad",
    title: "Boendekostnad",
    shortTitle: "Boendekostnad",
    description: "Räkna ut ungefärlig månadskostnad för bostadsrätt – ränta, amortering och avgift.",
    indexDescription:
      "Räkna ungefärlig månadskostnad med ränta, amortering och avgift.",
    badge: "Gratis",
    icon: "cost",
    previewTitle: "Vad kostar bostaden per månad?",
    previewText:
      "Fyll i pris, kontantinsats, ränta och avgift. Kalkylen visar ungefärlig månadskostnad med schablon för ränteavdrag.",
    previewBullets: [
      "Ungefärlig månadskostnad",
      "Räntekostnad efter avdrag",
      "Amortering och avgift",
      "Känslighet för ränta och avgift",
    ],
    metaTitle: "Boendekostnadskalkylator för bostadsrätt | skajagbuda.se",
    metaDescription:
      "Beräkna ungefärlig månadskostnad för bostadsrätt med ränta, amortering, avgift och ränteavdrag. Förenklad kalkyl – inte finansiell rådgivning.",
    relatedGuideSlugs: ["vad-ar-rimligt-maxbud", "pris-per-kvm-bostadsratt", "checklista-innan-budgivning"],
    ctaTitle: "Vill du väga in objektets risk också?",
    ctaText:
      "Kalkylen visar bara en del av bilden. Klistra in objektlänken så hämtar vi underlag där det går och låter AI väga pris, förening och risk.",
    resultCtaLabel: "Analysera objektet gratis",
  },
  {
    slug: "brf-skuld-per-kvm",
    title: "BRF skuld per kvm",
    shortTitle: "BRF-skuld per kvm",
    description: "Räkna ut föreningens skuld per kvm och få en preliminär riskindikation.",
    indexDescription:
      "Se en förenklad riskindikation utifrån föreningens belåning.",
    badge: "Gratis",
    icon: "brf",
    previewTitle: "Hur hög är belåningen?",
    previewText:
      "Ange föreningens lån och area – eller skuld per kvm direkt från årsredovisningen. Du får en preliminär riskindikation.",
    previewBullets: [
      "Skuld per kvm",
      "Preliminär risknivå",
      "Kort tolkning",
      "Vad som saknas i bilden",
    ],
    metaTitle: "BRF skuld per kvm – kalkylator | skajagbuda.se",
    metaDescription:
      "Beräkna skuld per kvm i bostadsrättsföreningen och se en förenklad riskindikation. Komplettera med årsredovisning och full analys.",
    relatedGuideSlugs: [
      "vad-ar-hog-skuld-per-kvm-brf",
      "analysera-brf-arsredovisning",
      "avgiftshojning-brf",
    ],
    ctaTitle: "Vill du väga in objektets risk också?",
    ctaText:
      "Belåning behöver vägas mot avgift, kassa och planerat underhåll. Analysera ett konkret objekt med årsredovisning och riskbedömning.",
    resultCtaLabel: "Analysera föreningen i ett objekt",
  },
  {
    slug: "maxbud",
    title: "Maxbud-kalkylator",
    shortTitle: "Maxbud",
    description: "Uppskatta ungefärligt maxpris utifrån månadskostnad du är bekväm med.",
    indexDescription:
      "Uppskatta ett rimligt pristak utifrån din bekväma månadskostnad.",
    badge: "Gratis",
    icon: "maxbud",
    previewTitle: "Vad är din gräns?",
    previewText:
      "Fyll i kontantinsats, bekväm månadskostnad, ränta och avgift. Kalkylen uppskattar vilket pris som ungefär matchar din nivå.",
    previewBullets: [
      "Ungefärligt maxpris",
      "Lånebelopp",
      "Månadskostnad",
      "Känslighet för ränta och avgift",
    ],
    metaTitle: "Maxbud-kalkylator – vad har du råd med? | skajagbuda.se",
    metaDescription:
      "Räkna ut ungefärligt maxbud utifrån kontantinsats, ränta, avgift och månadskostnad. Förenklad indikation – jämför med objektets risk.",
    relatedGuideSlugs: ["vad-ar-rimligt-maxbud", "budstrategi-bostadsratt", "hur-mycket-ska-man-buda-over-utgangspris"],
    ctaTitle: "Vill du väga in objektets risk också?",
    ctaText:
      "Maxbudet säger inget om förening, prisnivå eller röda flaggor. Jämför mot ett konkret objekt med en full analys.",
    resultCtaLabel: "Jämför med ett objekt",
  },
];

export function getToolBySlug(slug: string) {
  return TOOLS.find((t) => t.slug === slug);
}

export function getAllToolSlugs() {
  return TOOLS.map((t) => t.slug);
}
