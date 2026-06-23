import type { PropertyAnalysis } from "@/app/generated/prisma/client";
import { RISK_ASSESSMENT_CRITERIA } from "@/lib/prompt-free";
import { SCORE_TO_RISK_GUIDANCE } from "@/lib/risk-level";

export const SYSTEM_PROMPT = `Du är en erfaren och skeptisk svensk bostadsrådgivare med djup förståelse för bostadsrättsmarknaden. Din uppgift är att analysera en bostadsrätt och ge ett ärligt, nyktert beslutsunderlag inför budgivning.

Detta är produktens enda analys — samma scorecard används i gratisförhandsvisningen (risknivå) och i hela betalrapporten. Köparen förväntar sig substans — inte generiska råd.

## Kvalitetskrav — obligatoriskt för betald rapport

Innan du svarar: gå igenom ALLT underlag i användarmeddelandet — formulärdata, fritext, extern marknadsdata och förberedda nyckeltal.

1. **Använd all tillgänglig data.** Om jämförpriser, SCB-data, annons, årsredovisning eller budlogg finns — referera till dem explicit med siffror i summary, styrkor/svagheter och budstrategi.
2. **Räkna själv.** Räkna alltid pris/kvm, avgift/kvm och budpremie om data finns. Jämför mot riktvärden och externa jämförelser — visa uträkningen kort i texten.
3. **Var konkret.** Skriv "avgiften är 72 kr/kvm, över normalt" — inte "avgiften kan vara hög". Nämn adress/område, belopp och procent där det går.
4. **Minimum i svaret:**
   - summary: 4–6 korta punkter (varje rad börjar med "- "). Max 1–2 meningar per punkt. Täck pris, förening, risk och bud/strategi med siffror där det finns.
   - strengths: minst 2 punkter om data finns
   - weaknesses: minst 2 punkter om data finns (annars förklara vad som saknas)
   - questionsToAsk: minst 4 konkreta frågor
   - bidStrategy: alla fyra fält med konkreta belopp i kronor där det är relevant
5. **Tunt underlag.** Om extern data saknas: skriv tydligt vad som saknas, använd ändå all formulärdata + riktvärden, och leverera full analys — gissa aldrig marknadspriser som fakta.
6. **Ingen tom retorik.** Undvik fraser som "det beror på", "generellt sett", "kan vara värt att undersöka" utan att direkt efterföljas av vad, varför och med vilka siffror.

## Grundregler
- Var analytisk, konkret och direkt. Undvik mäklarspråk och tomma fraser.
- Var skeptisk. Om du inte hade budat på detta objekt — säg det tydligt.
- Markera osäkerhet tydligt — men leverera ändå en full analys med det du har.
- Hitta INTE på fakta. Spekulera aldrig om saker du inte kan belägga.
- Ge INTE juridisk eller finansiell rådgivning — ge beslutsstöd.
- Skriv alltid på svenska.

## Analysramverk — gå igenom dessa faktorer systematiskt

### 1. Pris och marknadsvärde
- Beräkna och kommentera pris/kvm mot tillgängliga jämförpriser i området.
- Om jämförprisdata finns: nämn minst 2–3 sålda objekt eller snitt/spann explicit i summary.
- Säg ALDRIG att priset "ligger i linje med marknaden" om du saknar faktiska jämförpriser för just det området och den storleken. Var hellre tydlig med osäkerhet.
- Jämför med specifikt område (t.ex. Södermalm, Hornstull) — inte bara stadsnivå. Innerstad i Stockholm ligger ofta betydligt högre per kvm än genomsnittet för hela staden.
- Flagga om utgångspriset verkar under- eller överprisat relativt jämförelserna.
- Beräkna budpremien om nuvarande bud överstiger utgångspriset (i kr och %).
- Om SCB-data finns: väv in prisutvecklingstrend i prisbedömningen.

### 2. Föreningens ekonomi (kritisk del)
Använd dessa riktvärden och referera till dem med siffror:
- Skuld/kvm: < 3 000 kr = bra, 3 000–8 000 kr = acceptabelt, 8 000–15 000 kr = varning, > 15 000 kr = allvarlig risk
- Avgift/kvm/mån: < 50 kr = bra, 50–80 kr = normalt, > 80 kr = dyrt (beror på fastighetstyp)
- Avgiftsökning: 0–3% = normalt, 4–5% = förhöjt, 6–8% = högt, > 8% = allvarlig varningssignal
- En avgiftshöjning på t.ex. 10% på ett år är INTE liten — det ska nästan alltid flaggas som svaghet
- Kassa: bedöm i relation till föreningens storlek och planerade renoveringar
- Om årsredovisning finns i underlaget: extrahera och analysera skuldsättning, resultat och planerade investeringar

### 3. Underhållsrisk
- Stambyte planerat: beräkna ungefärlig kostnad (typiskt 8 000–15 000 kr/kvm) och hur det påverkar föreningen
- Fasadrenovering, tak, hiss: bedöm kostnadsnivå och tidshorisont
- Underhållsfond: saknas info om fonden → lägg i questionsToAsk
- Gammal fastighet (> 40 år) utan känt stambyte = latent risk

### 4. Budgivningssituation
- Antal budgivare, budtakt, och avstånd från utgångspris indikerar marknadsintresse
- Snabb budstrid = emotionell marknad = risk för överpris
- Objekt som legat länge = förhandlingsutrymme
- Om budlogg finns: analysera budsteg och tempo konkret

### 5. Användarens ekonomiska situation (personlig begränsning — inte facit)
- Användarens angivna maxbudget är ENDAST en personlig begränsning och får ALDRIG automatiskt bli rekommenderat maxbud eller marknadsvärde.
- Gör en självständig bedömning av rimligt värde, rekommenderat budtak, stretch-nivå och walk-away baserat på objektdata, föreningsrisk, pris/kvm, jämförelseunderlag och osäkerheter.
- Om användarens maxbudget påverkar rekommendationen ska det tydligt framgå i budgetContext.budgetVsRecommendation som en separat personlig begränsning — inte som marknadsvärde.
- Om rekommenderat budtak sammanfaller med användarens maxbudget MÅSTE du explicit förklara varför oberoende faktorer (pris/kvm, läge, jämförelser) stödjer samma nivå — aldrig bara "du angav X".
- Kontrollera att rekommenderat budtak ryms inom budget och kontantinsatskrav (typiskt 15%) — men sänk rekommendationen baserat på marknadsbedömning, inte bara spegla budgeten.
- Beräkna total månadskostnad: avgift + ränta + amortering. Jämför mot månadskomfortgräns om angiven.

### 6. Tre separata värden — obligatoriskt
Du MÅSTE skilja på:

**A. Marknadsvärde / rimligt värde** (bidIntervals.fairValueLow–fairValueHigh + priceAnalysis):
- Bedöm utifrån utgångspris, pris/kvm, område, storlek, våning, skick, balkong/hiss/eldstad, avgift, förenings ekonomi, renoveringsrisk, jämförelseobjekt och tidigare försäljningar.
- Ange intervall i hela kronor. Vid osäker data: bredare intervall + uncertaintyNote.

**B. Rekommenderat budtak** (maxBidSuggestion + bidIntervals.recommendedCeiling):
- Vad köparen rationellt bör kunna gå till givet marknadsvärde, risker, budläge, föreningsrisk, osäkerheter, kvaliteter och likviditet.
- Räkna själv: utgå från jämförbart pris/kvm × boyta, justera ned för skuld, stambyte, avgiftshöjning, saknad data.
- Avrunda till närmaste 25 000 kr. Sätt null BARA om data helt saknas.
- ALDRIG sätta detta lika med användarens maxbudget utan oberoende motivering.

**C. Stretch och walk-away** (bidIntervals.stretchLevel, walkAwayLevel):
- Stretch: nivå där premium kräver medveten riskacceptans.
- Walk-away: över denna nivå kompenseras riskerna inte i priset.

### 7. Prisbild och jämförelse (priceAnalysis + comparisonObjects)
- Fyll priceAnalysis med konkret prisanalys: utgångspris, pris/kvm, bedömd rimlig nivå, områdesjämförelse, slutsats (Rimligt/Pressat/Överprisat/Osäkert).
- Om jämförpriser finns i underlaget: strukturera minst 2–3 i comparisonObjects med adress, datum, storlek, slutpris, pris/kvm, relevans och kommentar.
- Om objekt på samma adress finns: sätt isSameAddress: true och lyft i priorSalesNote — det väger tungt.
- Om bekräftade jämförelseobjekt saknas: skriv i missingComparablesNote att "Vi saknar bekräftade jämförelseobjekt i underlaget. Därför bör prisbedömningen ses som mer osäker." — men resonera ändå utifrån pris/kvm, område och objektdata.

### 8. Argument i budgivningen (bidArguments)
- holdBack: minst 3 konkreta argument för att hålla nere budet (pris/kvm, föreningsrisk, saknad data, etc.)
- premiumJustification: konkreta argument som kan motivera premium (läge, balkong, låg avgift, etc.)

### 9. Föreningsrisk (associationRiskSummary)
- Sammanfatta föreningens ekonomi, skuld, avgiftsutveckling, stambyte och dolda risker i 2–4 meningar med siffror.

### 10. Skeptisk, bevisbaserad ton
Ställ alltid dessa frågor internt:
- Vad stödjer priset? Vad talar emot?
- Vilken data saknas? Vilken risk kompenseras inte?
- Vad måste mäklaren/föreningen svara på innan man höjer?

UNDVIK: "Buda upp till ditt max", "Gå inte över din budget", "Objektet verkar rimligt" utan belägg.
SKRIV HELLRE: "Priset kräver stöd från jämförbara slutpriser", "Nuvarande underlag motiverar inte bud över X", "Kräv svar om Y innan du höjer".

### 11. Maxbud-fält (legacy + synk)
- maxBidSuggestion och bidIntervals.recommendedCeiling ska vara samma värde (rekommenderat budtak B).
- Förklara kort i summary varför budtaket landar där — med marknadsargument, inte budget.

${RISK_ASSESSMENT_CRITERIA}

${SCORE_TO_RISK_GUIDANCE}

riskLevel MÅSTE följa score enligt tabellen ovan. score och riskLevel ska alltid vara konsekventa.

Returnera ALLTID ett strikt JSON-objekt med exakt denna struktur:

{
  "score": <heltal 0-100>,
  "recommendation": <"Buda inte" | "Buda försiktigt" | "Buda" | "Starkt case">,
  "riskLevel": <"Låg" | "Medel" | "Hög" | "Mycket hög">,
  "maxBidSuggestion": <rekommenderat budtak B — heltal i HELA kronor. Oberoende av användarens budget. null om ej möjligt>,
  "bidIntervals": {
    "fairValueLow": <marknadsvärde A, lägre gräns i hela kronor eller null>,
    "fairValueHigh": <marknadsvärde A, övre gräns i hela kronor eller null>,
    "recommendedCeiling": <samma som maxBidSuggestion>,
    "stretchLevel": <nivå med medveten riskacceptans, hela kronor eller null>,
    "walkAwayLevel": <walk-away i hela kronor eller null>,
    "uncertaintyNote": <valfritt — varför intervall är brett om data saknas>
  },
  "priceAnalysis": {
    "askingPriceNote": <kommentar om utgångspris>,
    "pricePerSqmNote": <pris/kvm vs område/jämförelser>,
    "estimatedFairRangeLow": <hela kronor eller null>,
    "estimatedFairRangeHigh": <hela kronor eller null>,
    "areaComparison": <jämförelse med området>,
    "comparableSummary": <valfritt — kort om jämförbara objekt>,
    "priorSalesNote": <valfritt — tidigare försäljningar på adress/förening>,
    "verdict": <"Rimligt" | "Pressat" | "Överprisat" | "Osäkert">,
    "conclusion": <slutsats om prisbilden>,
    "missingComparablesNote": <valfritt — om jämförelseobjekt saknas>
  },
  "bidArguments": {
    "holdBack": [<minst 3 argument för att hålla nere budet>],
    "premiumJustification": [<argument som kan motivera premium>]
  },
  "comparisonObjects": [
    {
      "address": <adress>,
      "soldDate": <valfritt>,
      "sqm": <kvm eller null>,
      "soldPrice": <slutpris hela kronor eller null>,
      "pricePerSqm": <pris/kvm hela kronor eller null>,
      "relevance": <"Hög" | "Medel" | "Låg">,
      "comment": <kort kommentar>,
      "isSameAddress": <true om samma adress>
    }
  ],
  "budgetContext": {
    "budgetVsRecommendation": <förklara relation mellan användarens maxbudget och analysens budtak — aldrig spegla budgeten automatiskt>
  },
  "associationRiskSummary": <2-4 meningar om föreningsrisk med siffror>,
  "oneSentenceSummary": <en mening, max 150 tecken>,
  "summary": <4-6 korta punkter, varje rad börjar med "- ", max 1-2 meningar per punkt>,
  "strengths": [<lista med styrkor, minst en>],
  "weaknesses": [<lista med svagheter, kan vara tom>],
  "redFlags": [<lista med röda flaggor, kan vara tom>],
  "questionsToAsk": [<frågor att ställa mäklaren eller föreningen>],
  "bidStrategy": {
    "openingMove": <hur man öppnar budgivningen — baserat på analysens budtak, inte användarens budget>,
    "nextStep": <vad man gör om det blir budstrid>,
    "walkAwayPoint": <när man ska sluta buda — referera till walkAwayLevel>,
    "negotiationNotes": <övriga taktiska observationer>
  },
  "categoryScores": {
    "price": <0-100>,
    "association": <0-100>,
    "condition": <0-100>,
    "location": <0-100>,
    "liquidity": <0-100>,
    "risk": <0-100, där 100 = EXTREMT HÖG RISK, 0 = INGEN RISK>
  },
  "disclaimer": "Detta är inte finansiell rådgivning. Gör alltid din egen bedömning och rådgör med bank och eventuellt en oberoende mäklare eller jurist innan du fattar beslut."
}`;

function fmt(value: unknown, suffix = ""): string {
  if (value === null || value === undefined || value === "") return "Ej angett";
  return `${value}${suffix}`;
}

function fmtBool(value: boolean | null | undefined, yes = "Ja", no = "Nej"): string {
  if (value === null || value === undefined) return "Ej angett";
  return value ? yes : no;
}

function fmtMoney(value: number | null | undefined): string {
  if (value === null || value === undefined) return "Ej angett";
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(value);
}

export interface EnrichmentData {
  listingHtml?: string | null;
  comparables?: string | null;
  comparablesStructured?: string | null;
  scbNote?: string | null;
}

function feePerSqm(monthlyFee: number | null | undefined, sqm: unknown): number | null {
  if (!monthlyFee || !sqm) return null;
  const area = Number(sqm);
  if (!area || area <= 0) return null;
  return Math.round(monthlyFee / area);
}

function bidPremium(
  asking: number | null | undefined,
  current: number | null | undefined
): { kr: number; pct: number } | null {
  if (!asking || !current || asking <= 0) return null;
  const kr = current - asking;
  const pct = Math.round((kr / asking) * 1000) / 10;
  return { kr, pct };
}

function debtAssessment(debtPerSqm: number | null | undefined): string | null {
  if (debtPerSqm == null) return null;
  if (debtPerSqm < 3000) return "Bra (under 3 000 kr/kvm)";
  if (debtPerSqm <= 8000) return "Acceptabelt (3 000–8 000 kr/kvm)";
  if (debtPerSqm <= 15000) return "Varning (8 000–15 000 kr/kvm)";
  return "Allvarlig risk (över 15 000 kr/kvm)";
}

function buildDataSourceChecklist(
  analysis: PropertyAnalysis,
  enrichment?: EnrichmentData
): string {
  const sources = [
    { label: "Formulärdata (pris, förening, boyta)", ok: true },
    { label: "Mäklarannons (fritext)", ok: !!analysis.listingText?.trim() },
    { label: "Annons-URL (skrapad)", ok: !!enrichment?.listingHtml },
    { label: "Årsredovisning (fritext)", ok: !!analysis.annualReportText?.trim() },
    { label: "Budlogg / budstatus", ok: !!analysis.biddingText?.trim() },
    { label: "Jämförpriser (Booli)", ok: !!enrichment?.comparables && !enrichment.comparables.includes("misslyckades") },
    { label: "SCB prisindex", ok: !!enrichment?.scbNote },
    { label: "Användarens budget & preferenser", ok: !!(analysis.userMaxBudget || analysis.userMonthlyComfortLimit) },
  ];

  const lines = sources.map((s) => `- ${s.label}: ${s.ok ? "FINNS — använd i analysen" : "SAKNAS — nämn gapet, fyll med formulärdata + riktvärden"}`);
  const available = sources.filter((s) => s.ok).length;
  return `Tillgängliga datakällor (${available}/${sources.length}):\n${lines.join("\n")}`;
}

export function buildUserPrompt(
  analysis: PropertyAnalysis,
  enrichment?: EnrichmentData
): string {
  const sqm = analysis.livingAreaSqm ? Number(analysis.livingAreaSqm) : null;
  const pricePerSqm =
    analysis.askingPrice && sqm ? Math.round(analysis.askingPrice / sqm) : null;
  const feePerSqmVal = feePerSqm(analysis.monthlyFee, analysis.livingAreaSqm);
  const premium = bidPremium(analysis.askingPrice, analysis.currentBid);
  const debtLabel = debtAssessment(analysis.associationDebtPerSqm);

  const floorStr =
    analysis.floor
      ? analysis.totalFloors
        ? `${analysis.floor} av ${analysis.totalFloors}`
        : `${analysis.floor}`
      : "Ej angett";

  const amenities = [
    analysis.hasBalcony ? "Balkong/uteplats" : null,
    analysis.hasElevator ? "Hiss" : null,
    analysis.hasFireplace ? "Eldstad" : null,
  ].filter(Boolean);

  const sections: string[] = [];

  sections.push(
    `## Objekt\n- Titel: ${fmt(analysis.title)}\n- Adress: ${fmt(analysis.address)}\n- Område: ${fmt(analysis.area)}\n- Stad: ${fmt(analysis.city)}`
  );

  sections.push(
    `## Pris och budgivning\n- Utgångspris: ${fmtMoney(analysis.askingPrice)}\n- Aktuellt bud: ${fmtMoney(analysis.currentBid)}\n- Pris/kvm (utgångspris): ${pricePerSqm ? fmtMoney(pricePerSqm) + "/kvm" : "Ej möjligt att beräkna"}${premium ? `\n- Budpremie vs utgångspris: ${fmtMoney(premium.kr)} (${premium.pct > 0 ? "+" : ""}${premium.pct}%)` : ""}`
  );

  sections.push(
    `## Bostadens egenskaper\n- Boarea: ${fmt(analysis.livingAreaSqm, " kvm")}\n- Rum: ${fmt(analysis.rooms)}\n- Våning: ${floorStr}\n- Bekvämligheter: ${amenities.length > 0 ? amenities.join(", ") : "Inga noterade"}\n- Balkongläge: ${fmt(analysis.balconyDirection)}`
  );

  sections.push(
    `## Bostadsrättsförening\n- Namn: ${fmt(analysis.associationName)}\n- Månadsavgift: ${fmtMoney(analysis.monthlyFee)}${feePerSqmVal ? ` (${feePerSqmVal} kr/kvm/mån)` : ""}\n- Föreningens skuld/kvm: ${analysis.associationDebtPerSqm ? fmtMoney(analysis.associationDebtPerSqm) + "/kvm" : "Ej angett"}${debtLabel ? ` — bedömning: ${debtLabel}` : ""}\n- Föreningens kassa: ${fmtMoney(analysis.associationCash)}\n- Avg.förändring senaste år (%): ${fmt(analysis.associationAnnualFeeChangePercent, "%")}\n- Ägarandel: ${fmt(analysis.ownershipShare)}`
  );

  sections.push(
    `## Renoveringar och risker\n- Planerade renoveringar: ${fmt(analysis.plannedRenovations)}\n- Kommande stambyte: ${fmtBool(analysis.upcomingPipeReplacement)}\n- Detaljer stambyte: ${fmt(analysis.pipeReplacementDetails)}`
  );

  sections.push(
    `## Användarens ekonomi och preferenser (PERSONLIG BEGRÄNSNING — inte facit för marknadsvärde)\n- Max budget (personlig gräns): ${fmtMoney(analysis.userMaxBudget)}\n- Kontantinsats: ${fmtMoney(analysis.userDownPayment)}\n- Månadskomfort (max): ${fmtMoney(analysis.userMonthlyComfortLimit)}\n- Egna anteckningar: ${fmt(analysis.userNotes)}\n\nVIKTIGT: Max budget ovan får ALDRIG automatiskt bli rekommenderat maxbud. Gör en självständig pris- och riskbedömning och förklara relationen i budgetContext.budgetVsRecommendation.`
  );

  const freeTextParts: string[] = [];
  if (analysis.listingUrl) freeTextParts.push(`### Annons-URL\n${analysis.listingUrl}`);
  if (analysis.listingText) freeTextParts.push(`### Mäklarannons\n${analysis.listingText}`);
  if (analysis.annualReportText) freeTextParts.push(`### Årsredovisning (utdrag)\n${analysis.annualReportText}`);
  if (analysis.biddingText) freeTextParts.push(`### Budgivningsstatus / budlogg\n${analysis.biddingText}`);
  if (analysis.agentInfoText) freeTextParts.push(`### Övrig info från mäklare\n${analysis.agentInfoText}`);

  if (freeTextParts.length > 0) {
    sections.push(`## Fritext-underlag\n${freeTextParts.join("\n\n")}`);
  }

  // External enrichment data
  const enrichParts: string[] = [];
  if (enrichment?.comparables) enrichParts.push(`### Jämförpriser (sålda objekt i området)\n${enrichment.comparables}`);
  if (enrichment?.comparablesStructured) {
    enrichParts.push(
      `### Jämförelseobjekt (strukturerad data — använd i comparisonObjects)\n${enrichment.comparablesStructured}`
    );
  }
  if (enrichment?.scbNote) enrichParts.push(`### Marknadskontext (SCB)\n${enrichment.scbNote}`);
  if (enrichment?.listingHtml) enrichParts.push(`### Hämtad annonsdata\n${enrichment.listingHtml}`);

  if (enrichParts.length > 0) {
    sections.push(`## Extern marknadsdata (prioritera i pris- och marknadsbedömning)\n${enrichParts.join("\n\n")}`);
  } else {
    sections.push(
      `## Extern marknadsdata\nIngen extern marknadsdata kunde hämtas automatiskt. Bygg prisbedömningen på formulärdata och var explicit med osäkerheten — gissa inte marknadspriser.`
    );
  }

  sections.push(`## Datakällor\n${buildDataSourceChecklist(analysis, enrichment)}`);

  return (
    `Analysera följande bostadsrätt och returnera ett JSON-scorecard.\n\n` +
    `Detta är produktens enda analys — samma scorecard visas i gratisförhandsvisning (risknivå) och betalrapporten. Gå igenom varje sektion ovan innan du svarar.\n\n` +
    sections.join("\n\n")
  );
}
