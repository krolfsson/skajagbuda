import type { FaqItem, Guide } from "./types";

export type GuideSeoLink = { href: string; anchor: string };

export type GuideSeoPatch = {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  intro?: string;
  quickAnswer?: string[];
  internalLinks?: GuideSeoLink[];
  faq?: FaqItem[];
  relatedSlugs?: string[];
  relatedToolSlugs?: string[];
  /** Override first section heading for keyword alignment. */
  firstSectionHeading?: string;
};

/** Primary SEO targets — one page per phrase, no overlap. */
export const PRIORITY_GUIDE_SLUGS = [
  "ska-jag-buda-pa-bostadsratt",
  "hur-mycket-ska-man-buda-over-utgangspris",
  "vad-ar-rimligt-maxbud",
  "vad-ska-man-fraga-maklaren-innan-bud",
  "checklista-innan-budgivning",
  "analysera-brf-arsredovisning",
  "vad-ar-hog-skuld-per-kvm-brf",
  "stambyte-bostadsratt-risk",
  "tomtratt-bostadsratt",
  "avgiftshojning-brf",
] as const;

const ANALYSIS_LINK: GuideSeoLink = {
  href: "/new",
  anchor: "starta gratis analys",
};

export const GUIDE_SEO_PATCHES: Record<string, GuideSeoPatch> = {
  "ska-jag-buda-pa-bostadsratt": {
    title: "Ska jag buda på bostadsrätt?",
    metaTitle: "Ska jag buda på bostadsrätt? Så kontrollerar du objektet | skajagbuda.se",
    metaDescription:
      "Ska jag buda på bostadsrätt? Läs vad du bör kontrollera om pris, BRF, avgift och risk innan budgivning. Klistra in objektlänken och få preliminär risknivå gratis.",
    intro:
      "Du bör inte buda på en bostadsrätt förrän du har kontrollerat priset, föreningens ekonomi, avgiften, planerat underhåll och din egen maxgräns. En snabb kontroll kan hjälpa dig se om objektet verkar rimligt, riskabelt eller för dyrt innan du går vidare i budgivningen.",
    quickAnswer: [
      "Jämför inte bara med utgångspriset — titta på slutpriser för liknande objekt.",
      "Kontrollera skuld/kvm, avgift och planerat underhåll i årsredovisningen.",
      "Sätt en walk-away-nivå innan budgivningen börjar.",
      "Be mäklaren om budhistorik och viktiga föreningsuppgifter.",
      "Gå vidare till analys bara om pris och BRF ser rimliga ut utifrån underlaget.",
    ],
    firstSectionHeading: "Ska jag buda? Börja med pris och marknad",
    internalLinks: [
      { href: "/guider/vad-ska-man-fraga-maklaren-innan-bud", anchor: "frågor att ställa mäklaren innan budgivning" },
      { href: "/guider/checklista-innan-budgivning", anchor: "vad ska man kolla innan budgivning" },
      { href: "/guider/vad-ar-hog-skuld-per-kvm-brf", anchor: "hög skuld per kvm i BRF" },
      { href: "/verktyg/maxbud", anchor: "maxbud-kalkylator" },
      ANALYSIS_LINK,
    ],
    relatedSlugs: [
      "vad-ska-man-fraga-maklaren-innan-bud",
      "checklista-innan-budgivning",
      "vad-ar-rimligt-maxbud",
      "analysera-brf-arsredovisning",
    ],
    faq: [
      {
        q: "Är det bindande att lägga bud på bostadsrätt?",
        a: "Ett accepterat bud är bindande enligt budgivningsreglerna. Lägg därför bara bud när du kontrollerat pris, förening och din egen maxgräns.",
      },
      {
        q: "Hur mycket ska man höja i en budgivning?",
        a: "Höj i planerade steg baserat på slutpriser i området — inte efter känsla. Många budar i steg om 50 000–100 000 kr beroende på prisnivå.",
      },
      {
        q: "När ska man sluta buda?",
        a: "När du når ditt walk-away-belopp eller när priset inte längre motiveras av jämförelseobjekt och föreningsrisk.",
      },
      {
        q: "Ska man lägga första budet under utgångspris?",
        a: "Ofta ja, om slutpriser i området ligger högre och du vill signalera att du gjort hemläxan. Utgångspriset är en strategi — inte facit.",
      },
    ],
  },

  "hur-mycket-ska-man-buda-over-utgangspris": {
    title: "Hur mycket ska man buda över utgångspris?",
    metaTitle: "Hur mycket ska man buda över utgångspris? | skajagbuda.se",
    metaDescription:
      "Hur mycket ska man buda över utgångspris? Lär dig hur slutpriser i området styr budnivån — och när det inte är värt att följa med. Starta gratis analys på ditt objekt.",
    intro:
      "Hur mycket du ska buda över utgångspris beror på slutpriser för liknande lägenheter i området — inte på en generell tumregel. Utgångspriset sätts för att locka intresse. Ditt maxbud ska bygga på jämförbara slutpriser, föreningens risk och din budget.",
    quickAnswer: [
      "Utgångspris är strategi — slutpriser i området är facit.",
      "I heta områden kan slutpriset ligga 10–20 % över utgångspris, ibland mer.",
      "Sätt maxbud från jämförelsepriser, inte från utgångspris plus procent.",
      "Sluta buda när priset inte längre motiveras av data.",
    ],
    firstSectionHeading: "Hur mycket över utgångspris är rimligt?",
    internalLinks: [
      { href: "/guider/vad-ar-rimligt-maxbud", anchor: "rimligt maxbud för bostadsrätt" },
      { href: "/guider/budstrategi-bostadsratt", anchor: "budstrategi bostadsrätt" },
      { href: "/guider/vad-ska-man-fraga-maklaren-innan-bud", anchor: "frågor att ställa mäklaren innan budgivning" },
      { href: "/verktyg/maxbud", anchor: "maxbud-kalkylator" },
      ANALYSIS_LINK,
    ],
    faq: [
      {
        q: "Finns det en regel för hur mycket man ska buda över utgångspris?",
        a: "Nej. Skillnaden varierar kraftigt mellan områden och objekt. Slutprisstatistik för liknande lägenheter ger bättre vägledning.",
      },
      {
        q: "Ska jag alltid buda över utgångspris?",
        a: "Inte nödvändigtvis. Med få spekulanter kan slutpriset ligga nära utgångspriset. Låt jämförelsepriser styra.",
      },
      {
        q: "Hur mycket ska man höja i en budgivning?",
        a: "Planera budsteg i förväg. Höj bara om ny information motiverar det — inte för att hänga med i tempot.",
      },
      {
        q: "När ska man sluta buda?",
        a: "Vid ditt walk-away-belopp eller när slutprisnivån i området inte längre motiverar mer.",
      },
    ],
  },

  "vad-ar-rimligt-maxbud": {
    title: "Rimligt maxbud för bostadsrätt",
    metaTitle: "Rimligt maxbud bostadsrätt – så sätter du en gräns | skajagbuda.se",
    metaDescription:
      "Vad är rimligt maxbud för bostadsrätt? Sätt gränsen utifrån slutpriser, BRF-risk och boendekostnad — inte känsla i budgivningen. Testa maxbud-kalkylatorn gratis.",
    intro:
      "Ett rimligt maxbud för bostadsrätt bygger på slutpriser i området, föreningens ekonomi och vad du faktiskt har råd med varje månad — inte på utgångspriset eller budgivningens tempo. Utan en tydlig gräns styrs du av konkurrensen, inte av din budget.",
    quickAnswer: [
      "Utgå från slutpriser för liknande objekt — inte utgångspris.",
      "Justera ned för hög skuld/kvm, stambyte och osäker avgiftsutveckling.",
      "Räkna hela boendekostnaden, inte bara köpeskillingen.",
      "Bestäm maxbudet innan budgivningen — inte under den.",
    ],
    firstSectionHeading: "Rimligt maxbud: utgå från slutpriser",
    internalLinks: [
      { href: "/guider/hur-mycket-ska-man-buda-over-utgangspris", anchor: "hur mycket ska man buda över utgångspris" },
      { href: "/guider/budstrategi-bostadsratt", anchor: "budstrategi bostadsrätt" },
      { href: "/verktyg/maxbud", anchor: "maxbud-kalkylator" },
      ANALYSIS_LINK,
    ],
    faq: [
      {
        q: "Vad är ett rimligt maxbud för bostadsrätt?",
        a: "Det lägsta av: vad liknande objekt sålts för, vad BRF-risken motiverar och vad din månadsbudget tillåter.",
      },
      {
        q: "Ska maxbudet vara hemligt?",
        a: "Ja, för dig själv. Att dela det med mäklaren ger ingen fördel.",
      },
      {
        q: "Kan bankens lånelöfte bli mitt maxbud?",
        a: "Nej. Banken säger vad du får låna — inte vad köpet är klokt.",
      },
    ],
  },

  "vad-ska-man-fraga-maklaren-innan-bud": {
    title: "Frågor att ställa mäklaren innan budgivning",
    metaTitle: "Frågor att ställa mäklaren innan budgivning | skajagbuda.se",
    metaDescription:
      "Frågor att ställa mäklaren innan budgivning: budläge, BRF, underhåll och dokumentation. Konkret lista så du inte budar i blindo. Starta gratis analys på objektet.",
    intro:
      "Innan du budar ska du ställa konkreta frågor till mäklaren om budläge, föreningens ekonomi, planerat underhåll och kända fel. Mäklaren representerar säljaren — men du har rätt till svar som påverkar ditt budbeslut.",
    quickAnswer: [
      "Be om aktuell budhistorik och budgivningsvillkor skriftligt.",
      "Fråga om planerade avgiftshöjningar, stambyte och större renoveringar.",
      "Begär årsredovisning, underhållsplan och stadgar om de saknas.",
      "Verifiera viktiga svar mot föreningens dokument — inte bara muntligt.",
    ],
    firstSectionHeading: "Frågor om budläget innan du budar",
    internalLinks: [
      { href: "/guider/checklista-innan-budgivning", anchor: "vad ska man kolla innan budgivning" },
      { href: "/guider/analysera-brf-arsredovisning", anchor: "analysera BRF-årsredovisning" },
      { href: "/guider/roda-flaggor-bostadsratt", anchor: "röda flaggor vid bostadsköp" },
      ANALYSIS_LINK,
    ],
    faq: [
      {
        q: "Finns det planerade avgiftshöjningar utöver kommunicerat?",
        a: "Fråga styrelsen och läs årsredovisningen. Vaga svar motiverar paus — inte högre bud.",
      },
      {
        q: "Hur många bud har lagts och vad ligger högsta budet på?",
        a: "Be om skriftlig status. Muntliga uppgifter om budläge räcker inte som beslutsunderlag.",
      },
      {
        q: "Måste mäklaren svara ärligt?",
        a: "Vilseledande uppgifter är inte tillåtna, men mäklaren prioriterar säljaren. Granska dokumenten själv.",
      },
    ],
  },

  "checklista-innan-budgivning": {
    title: "Vad ska man kolla innan budgivning?",
    metaTitle: "Vad ska man kolla innan budgivning? Checklista | skajagbuda.se",
    metaDescription:
      "Vad ska man kolla innan budgivning på bostadsrätt? Pris, BRF, boendekostnad, dokument och maxbud — komplett checklista innan första budet. Starta gratis analys.",
    intro:
      "Innan budgivning ska du ha koll på pris jämfört med slutpriser, föreningens ekonomi, hela boendekostnaden, viktiga dokument och ett tydligt maxbud. Den här checklistan samlar det du bör kontrollera — så att du inte budar på känsla.",
    quickAnswer: [
      "Jämför slutpriser och pris/kvm — inte bara utgångspris.",
      "Läs årsredovisning, underhållsplan och skuld/kvm.",
      "Räkna boendekostnad med marginal för ränta och avgiftshöjning.",
      "Sätt maxbud och budstrategi innan första budet.",
    ],
    firstSectionHeading: "Vad ska man kolla: pris och jämförelse",
    internalLinks: [
      { href: "/guider/ska-jag-buda-pa-bostadsratt", anchor: "ska jag buda på bostadsrätt" },
      { href: "/guider/vad-ar-rimligt-maxbud", anchor: "rimligt maxbud för bostadsrätt" },
      { href: "/guider/analysera-brf-arsredovisning", anchor: "analysera BRF-årsredovisning" },
      { href: "/verktyg/boendekostnad", anchor: "boendekostnadskalkylator" },
      ANALYSIS_LINK,
    ],
    faq: [
      {
        q: "Måste allt vara klart innan första bud?",
        a: "Ideellt ja. Minimum är BRF-analys och tydligt maxbud om budgivningen går snabbt.",
      },
      {
        q: "Vad är viktigast att kolla först?",
        a: "Slutpriser, årsredovisning och boendekostnad. Saknas årsredovisning — pausa.",
      },
    ],
  },

  "analysera-brf-arsredovisning": {
    title: "Analysera BRF-årsredovisning",
    metaTitle: "Analysera BRF-årsredovisning innan bud | skajagbuda.se",
    metaDescription:
      "Analysera BRF-årsredovisning innan bud: skuld/kvm, avgift, kassa och planerat underhåll. Så läser du det viktigaste utan att drunkna i siffror. Starta gratis analys.",
    intro:
      "När du analyserar BRF-årsredovisning innan bud ska du fokusera på skuld per kvm, avgiftsutveckling, kassa och planerade underhållsåtgärder. Dokumentet visar mer om risken än visningen — och mer än mäklarens sammanfattning.",
    quickAnswer: [
      "Läs minst två till tre års redovisningar för att se trender.",
      "Kontrollera skuld/kvm, avgift/kvm och kassa.",
      "Koppla underhållsplanen till föreningens ekonomi.",
      "Leta efter tomträtt, lokaler och stora kommande projekt i noterna.",
    ],
    firstSectionHeading: "Analysera BRF-årsredovisning: börja här",
    internalLinks: [
      { href: "/guider/vad-ar-hog-skuld-per-kvm-brf", anchor: "hög skuld per kvm i BRF" },
      { href: "/guider/avgiftshojning-brf", anchor: "avgiftshöjning i BRF" },
      { href: "/guider/stambyte-bostadsratt-risk", anchor: "stambyte i bostadsrätt" },
      { href: "/verktyg/brf-skuld-per-kvm", anchor: "BRF-skuld per kvm-kalkylator" },
      ANALYSIS_LINK,
    ],
    faq: [
      {
        q: "Hur ser man om en BRF har dålig ekonomi?",
        a: "Hög och stigande skuld/kvm, låg kassa, upprepade underskott och stora planerade projekt utan finansiering.",
      },
      {
        q: "Räcker ett års årsredovisning?",
        a: "Nej. Titta på trender över minst två till tre år.",
      },
      {
        q: "Var hittar jag årsredovisningen?",
        a: "Via mäklaren, föreningen eller Alla Bolag. Begär den innan bud.",
      },
    ],
  },

  "vad-ar-hog-skuld-per-kvm-brf": {
    title: "Hög skuld per kvm i BRF",
    metaTitle: "Hög skuld per kvm i BRF – vad är riskabelt? | skajagbuda.se",
    metaDescription:
      "Hög skuld per kvm i BRF kan öka risken för avgiftshöjningar. Lär dig vad du ska kontrollera i årsredovisningen innan du budar. Starta gratis analys på objektet.",
    intro:
      "Hög skuld per kvm i en BRF betyder att föreningen har stora lån i relation till bostadsytan. Det behöver inte vara farligt i sig, men kan öka risken för avgiftshöjningar — särskilt om räntan stiger eller föreningen har stort underhåll framför sig.",
    quickAnswer: [
      "Jämför skuld/kvm med liknande föreningar i området.",
      "Titta på trenden — stiger skulden snabbt utan tydlig förklaring?",
      "Koppla skulden till underhållsplan och kassa.",
      "Justera maxbudet ned om skulden kombineras med planerat stambyte.",
    ],
    firstSectionHeading: "Hög skuld per kvm: vad mäter siffran?",
    internalLinks: [
      { href: "/guider/analysera-brf-arsredovisning", anchor: "analysera BRF-årsredovisning" },
      { href: "/guider/avgiftshojning-brf", anchor: "avgiftshöjning i BRF" },
      { href: "/guider/stambyte-bostadsratt-risk", anchor: "stambyte i bostadsrätt" },
      { href: "/verktyg/brf-skuld-per-kvm", anchor: "BRF-skuld per kvm-kalkylator" },
      ANALYSIS_LINK,
    ],
    faq: [
      {
        q: "Vad är hög skuld per kvm i en BRF?",
        a: "Det varierar per område. Det viktiga är avvikelse från liknande föreningar och kombinationen med kassa och planerat underhåll.",
      },
      {
        q: "Är hög belåning alltid dåligt?",
        a: "Nej — om den finansierat genomfört underhåll med tydlig amorteringsplan kan det vara hanterbart.",
      },
      {
        q: "Kan avgiften höjas efter köp?",
        a: "Ja. Styrelsen och stämman beslutar. Din skydd är analysen innan köp.",
      },
    ],
  },

  "stambyte-bostadsratt-risk": {
    title: "Stambyte i bostadsrätt",
    metaTitle: "Stambyte i bostadsrätt – risk eller möjlighet? | skajagbuda.se",
    metaDescription:
      "Stambyte i bostadsrätt kan kosta hundratusentals kronor per lägenhet. Så bedömer du om planerat eller genomfört stambyte är risk eller möjlighet. Starta gratis analys.",
    intro:
      "Stambyte i bostadsrätt är bland de dyraste åtgärderna en förening gör. Ett genomfört stambyte kan minska framtida risk; ett planerat utan finansiering är en tydlig varningssignal som bör påverka ditt maxbud.",
    quickAnswer: [
      "Genomfört stambyte med klar finansiering minskar ofta risken.",
      "Planerat stambyte utan buffert kan ge avgiftshöjning eller särskilt uttag.",
      "Fråga om kostnad per lägenhet och finansieringsplan.",
      "Justera maxbudet om stambyte väntar utan tydlig kassa.",
    ],
    firstSectionHeading: "Stambyte i bostadsrätt: vad innebär det?",
    internalLinks: [
      { href: "/guider/underhallsplan-brf", anchor: "underhållsplan i BRF" },
      { href: "/guider/avgiftshojning-brf", anchor: "avgiftshöjning i BRF" },
      { href: "/guider/analysera-brf-arsredovisning", anchor: "analysera BRF-årsredovisning" },
      ANALYSIS_LINK,
    ],
    faq: [
      {
        q: "Måste föreningen informera om planerat stambyte?",
        a: "Information ska finnas i underhållsplan och årsredovisning. Fråga aktivt om det inte är tydligt.",
      },
      {
        q: "Kan jag förhandla om priset pga stambyte?",
        a: "Du justerar maxbudet baserat på förväntad kostnad — det är rationell prissättning.",
      },
      {
        q: "Är genomfört stambyte alltid bra?",
        a: "Ofta ja, om arbetet är dokumenterat och betalt. Kontrollera standard och vad som ingick.",
      },
    ],
  },

  "tomtratt-bostadsratt": {
    title: "Tomträtt i bostadsrätt – risk och kostnad",
    metaTitle: "Tomträtt bostadsrätt – risk och avgäld | skajagbuda.se",
    metaDescription:
      "Tomträtt i bostadsrätt innebär att föreningen hyr marken. Lär dig risker kring avgäld, omförhandling och avgift innan du budar. Starta gratis analys.",
    intro:
      "Tomträtt i bostadsrätt innebär att föreningen hyr marken och betalar tomträttsavgäld. Det är en risk många missar: avgälden kan omförhandlas och höja föreningens kostnader — och din månadsavgift.",
    quickAnswer: [
      "Kolla återstående avtalstid och när tomträtten omförhandlas.",
      "Läs historik av avgäldshöjningar i årsredovisningen.",
      "Kort avtal utan plan motiverar lägre maxbud.",
      "Tomträtt är vanligt — men inte riskfritt utan tydlig ekonomi.",
    ],
    firstSectionHeading: "Tomträtt i bostadsrätt: vad är risken?",
    internalLinks: [
      { href: "/guider/analysera-brf-arsredovisning", anchor: "analysera BRF-årsredovisning" },
      { href: "/guider/avgiftshojning-brf", anchor: "avgiftshöjning i BRF" },
      { href: "/guider/lokalfastigheter-brf-risk", anchor: "lokaler i BRF" },
      ANALYSIS_LINK,
    ],
    faq: [
      {
        q: "Är tomträtt alltid dåligt?",
        a: "Nej, men det är en riskfaktor. Långt avtal med stabil avgäld skiljer sig från kort avtal med omförhandling nära.",
      },
      {
        q: "Var hittar jag tomträttsinformation?",
        a: "I årsredovisningen, noterna och stadgarna. Fråga styrelsen om det inte är tydligt.",
      },
      {
        q: "Kan tomträtt höja avgiften efter köp?",
        a: "Ja, vid omförhandlad avgäld eller förlängningskostnad. Räkna in risken i maxbudet.",
      },
    ],
  },

  "avgiftshojning-brf": {
    title: "Avgiftshöjning i BRF",
    metaTitle: "Avgiftshöjning i BRF – vad betyder det för dig? | skajagbuda.se",
    metaDescription:
      "Avgiftshöjning i BRF påverkar din boendekostnad varje månad. Så tolkar du avgiftshistorik och risken innan du budar på bostadsrätt. Starta gratis analys.",
    intro:
      "Avgiftshöjning i BRF kan komma snabbt om föreningen har hög skuld, planerat underhåll eller stigande räntekostnader. Som blivande andelsägare tar du över föreningens ekonomi — inklusive framtida höjningar du inte röstar om retroaktivt.",
    quickAnswer: [
      "Läs avgift per kvm över minst fem år i årsredovisningen.",
      "Koppla höjningar till lån, räntor och planerade projekt.",
      "Låg avgift idag kan betyda uppskjutet underhåll — inte bra ekonomi.",
      "Räkna med möjlig höjning i din boendekostnadskalkyl.",
    ],
    firstSectionHeading: "Avgiftshöjning i BRF: varför höjs avgiften?",
    internalLinks: [
      { href: "/guider/for-lag-avgift-bostadsratt", anchor: "för låg avgift i bostadsrätt" },
      { href: "/guider/vad-ar-hog-skuld-per-kvm-brf", anchor: "hög skuld per kvm i BRF" },
      { href: "/guider/underhallsplan-brf", anchor: "underhållsplan i BRF" },
      { href: "/verktyg/boendekostnad", anchor: "boendekostnadskalkylator" },
      ANALYSIS_LINK,
    ],
    faq: [
      {
        q: "Kan jag förhandla om avgiften?",
        a: "Nej. Avgiften beslutas av föreningen. Du kan välja att inte köpa om risken är för hög.",
      },
      {
        q: "Hur mycket kan avgiften höjas?",
        a: "Det finns inget tak. Din skydd är att läsa historik och planer innan bud.",
      },
      {
        q: "Kan avgiften höjas efter köp?",
        a: "Ja, när styrelse och stämma beslutar det. Analysera trenden innan du budar.",
      },
    ],
  },
};

export function applyGuideSeo(guide: Guide): Guide {
  const patch = GUIDE_SEO_PATCHES[guide.slug];
  if (!patch) return guide;

  const sections = [...guide.sections];
  if (patch.firstSectionHeading && sections[0]) {
    sections[0] = { ...sections[0], heading: patch.firstSectionHeading };
  }

  const faq = patch.faq ?? guide.faq;

  return {
    ...guide,
    title: patch.title ?? guide.title,
    metaTitle: patch.metaTitle ?? guide.metaTitle,
    metaDescription: patch.metaDescription ?? guide.metaDescription,
    intro: patch.intro ?? guide.intro,
    quickAnswer: patch.quickAnswer,
    internalLinks: patch.internalLinks,
    sections,
    faq,
    relatedSlugs: patch.relatedSlugs ?? guide.relatedSlugs,
    relatedToolSlugs: patch.relatedToolSlugs ?? guide.relatedToolSlugs,
  };
}

export function sortGuidesForIndex<T extends { slug: string }>(guides: T[]): T[] {
  const priority = new Map<string, number>(PRIORITY_GUIDE_SLUGS.map((slug, i) => [slug, i]));
  return [...guides].sort((a, b) => {
    const pa = priority.get(a.slug) ?? 999;
    const pb = priority.get(b.slug) ?? 999;
    if (pa !== pb) return pa - pb;
    return a.slug.localeCompare(b.slug, "sv");
  });
}
