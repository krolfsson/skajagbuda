import type { Guide, GuideWithMeta } from "./types";
import { getGuideIndexFields } from "./guide-index-meta";
import { applyGuideSeo } from "./guide-seo";

function enrichGuide(guide: Guide): GuideWithMeta {
  const withSeo = applyGuideSeo(guide);
  return { ...withSeo, ...getGuideIndexFields(withSeo.slug) };
}

export const GUIDES: Guide[] = [
  {
    slug: "ska-jag-buda-pa-bostadsratt",
    title: "Ska jag buda på bostadsrätt?",
    metaTitle:
      "Ska jag buda på bostadsrätt? Så gör du en snabb kontroll | skajagbuda.se",
    metaDescription:
      "Osäker på om du ska buda? Gör en snabb kontroll av pris, BRF och boendekostnad innan du lägger första budet. Praktisk vägledning utan mäklarspråk.",
    intro:
      "Att buda är inte samma sak som att köpa – det är ett steg där du binder dig ekonomiskt och psykologiskt. Innan du lägger första budet bör du veta om lägenheten är rimligt prissatt, om föreningen håller måttet och om du faktiskt har råd med hela boendekostnaden. Den här guiden hjälper dig göra en snabb men ärlig kontroll.",
    sections: [
      {
        id: "pris-kontroll",
        heading: "Är priset rimligt jämfört med området?",
        paragraphs: [
          "Jämför inte bara med utgångspriset – titta på slutpriser för liknande lägenheter i samma område under de senaste sex till tolv månaderna. Samma storlek, våning och skick ger bäst jämförelse.",
          "Om objektet ligger klart över medianen behöver du en konkret förklaring: renovering, utsikt, balkong eller läge. Utan det betalar du troligen premie utan att veta varför.",
        ],
        bullets: [
          "Kolla slutpriser, inte bara utgångspris",
          "Jämför liknande storlek och våning",
          "Fråga dig vad som motiverar ett högre pris",
        ],
      },
      {
        id: "brf-snabbkoll",
        heading: "Klarar BRF:en en snabbkoll?",
        paragraphs: [
          "Läs årsredovisningen innan budgivning, inte efter. Skulden per kvm, avgiftshistorik och planerade underhåll säger mer om risken än köksrenoveringen.",
          "Hög skuld per kvm, stigande avgifter eller stora kommande projekt utan tydlig finansiering är varningssignaler som inte försvinner för att lägenheten är fin.",
        ],
        callout:
          "En snygg lägenhet kan inte kompensera för en förening med svag ekonomi.",
      },
      {
        id: "boendekostnad",
        heading: "Har du räknat hela boendekostnaden?",
        paragraphs: [
          "Månadskostnaden är mer än ränta och avgift. Räkna med amortering, el, försäkring, eventuell renovering och buffert för oväntade utgifter.",
          "Om maxkostnaden pressar budgeten redan vid dagens ränta blir det sämre vid högre ränta eller avgiftshöjning. Räkna konservativt.",
        ],
      },
      {
        id: "budbeslut",
        heading: "När är det rimligt att faktiskt buda?",
        paragraphs: [
          "Buda när du har svar på pris, BRF och kostnad – och när du vet ditt maxbud i förväg. Bud utan gräns leder ofta till att du betalar mer än du planerat.",
          "Om något viktigt saknas, till exempel årsredovisning eller tydlig info om planerade stambyten, är det ofta bättre att vänta än att buda i blindo.",
        ],
      },
      {
        id: "nej-ar-ok",
        heading: "Det är okej att inte buda",
        paragraphs: [
          "Att avstå är inte ett misslyckande. Marknaden vänder, nya objekt dyker upp och en dålig affär kostar mer än en missad chans.",
          "Sätt ditt maxbud innan visningen och håll dig till det. Om budgivningen springer iväg är det information – inte en uppmaning att följa med.",
        ],
      },
    ],
    faq: [
      {
        q: "Måste jag buda direkt efter visning?",
        a: "Nej. Du har sällan något att vinna på att buda innan du läst årsredovisningen och räknat på boendekostnaden. Snabbhet är sällan samma sak som bra beslut.",
      },
      {
        q: "Räcker det att banken godkänner lånet?",
        a: "Bankens godkännande säger att du får låna – inte att köpet är klokt. Du måste själv bedöma om priset och föreningen är rimliga.",
      },
    ],
    relatedSlugs: [
      "vad-ar-rimligt-maxbud",
      "checklista-innan-budgivning",
      "analysera-brf-arsredovisning",
    ],
    relatedToolSlugs: ["boendekostnad", "maxbud"],
  },
  {
    slug: "hur-mycket-ska-man-buda-over-utgangspris",
    title: "Hur mycket ska man buda över utgångspris?",
    metaTitle: "Hur mycket ska man buda över utgångspris? | skajagbuda.se",
    metaDescription:
      "Utgångspriset är en strategi, inte ett facit. Lär dig hur mycket du kan behöva buda över i olika marknader – och när det inte är värt att följa med alls.",
    intro:
      "Utgångspriset sätts för att locka intresse, inte för att spegla slutpriset. Hur mycket du behöver buda över beror på område, efterfrågan och objektets kvalitet – men det finns inget universellt svar. Det viktiga är att du vet vad du är beredd att betala innan budgivningen börjar.",
    sections: [
      {
        id: "utgangspris-ar-strategi",
        heading: "Utgångspris är en strategi, inte ett facit",
        paragraphs: [
          "Mäklaren sätter utgångspriset tillsammans med säljaren för att maximera antalet spekulanter. Ett lågt utgångspris skapar konkurrens; ett högt filtrerar bort spekulanter tidigt.",
          "Slutpriset styrs av hur många som budar och hur mycket de är villiga att betala – inte av vad som står i annonsen.",
        ],
      },
      {
        id: "omradesskillnader",
        heading: "Skillnader mellan områden och lägenheter",
        paragraphs: [
          "I eftertraktade områden med få objekt kan slutpriset ligga 10–20 % över utgångspris eller mer. I områden med många liknande lägenheter kan skillnaden vara liten.",
          "Faktorer som balkong, våning, föreningens ekonomi och skick påverkar hur mycket spekulanter är beredda att betala – oberoende av utgångspriset.",
        ],
        bullets: [
          "Kolla slutpriser i samma område",
          "Jämför objekt med liknande storlek",
          "Räkna med högre överbud i heta områden",
        ],
      },
      {
        id: "oppningsbud",
        heading: "Hur tänka kring öppningsbud?",
        paragraphs: [
          "Ett öppningsbud nära utgångspriset signalerar seriösitet utan att avslöja ditt maxbud. Att börja för lågt kan göra att säljaren prioriterar andra budgivare.",
          "Att börja för högt lämnar dig utan utrymme. Utgångspriset ger en ledtråd, men ditt maxbud ska baseras på jämförelsepriser – inte på känsla i stunden.",
        ],
      },
      {
        id: "nar-sluta",
        heading: "När ska du sluta följa med?",
        paragraphs: [
          "Sätt ett maxbud innan budgivningen och håll fast vid det. Varje extra krona över ditt max är en förlust, inte en investering.",
          "Om budgivningen redan ligger över vad liknande lägenheter sålts för är det ofta bättre att dra sig ur än att rationalisera ett högre pris.",
        ],
        callout:
          "Det dyraste misstaget är att buda över ditt eget max för att 'inte missa'.",
      },
      {
        id: "praktiskt-exempel",
        heading: "Praktiskt exempel",
        paragraphs: [
          "Om liknande lägenheter sålts för 3,2–3,4 miljoner och utgångspriset är 2,95 miljoner vet du att slutpriset troligen hamnar i det intervallet. Ditt maxbud bör spegla det – inte utgångspriset.",
          "Räkna baklänges från vad du tycker är rimligt att betala, inte framåt från utgångspriset.",
        ],
      },
    ],
    faq: [
      {
        q: "Finns det en regel för hur mycket man ska buda över?",
        a: "Nej. Skillnaden varierar kraftigt. Slutprisstatistik i området ger bättre vägledning än generella tumregler.",
      },
      {
        q: "Ska jag alltid buda över utgångspris?",
        a: "Inte nödvändigtvis. I vissa marknader eller med få spekulanter kan slutpriset ligga nära utgångspriset. Låt jämförelsepriser styra, inte förväntningar.",
      },
    ],
    relatedSlugs: [
      "vad-ar-rimligt-maxbud",
      "budstrategi-bostadsratt",
      "pris-per-kvm-bostadsratt",
    ],
    relatedToolSlugs: ["maxbud"],
  },
  {
    slug: "vad-ar-rimligt-maxbud",
    title: "Vad är ett rimligt maxbud?",
    metaTitle: "Vad är ett rimligt maxbud? | skajagbuda.se",
    metaDescription:
      "Ett maxbud ska baseras på jämförelsepriser, BRF-risk och din faktiska boendekostnad – inte på känsla under budgivning. Så sätter du en gräns som håller.",
    intro:
      "Ditt maxbud är den högsta summa du är villig att betala innan budgivningen börjar – inte det du hoppas få lägenheten för. Ett rimligt maxbud bygger på slutpriser i området, föreningens ekonomi och vad du faktiskt har råd med varje månad. Utan den gränsen styrs du av konkurrensen, inte av din budget.",
    sections: [
      {
        id: "jamforelsepriser",
        heading: "Utgå från jämförelsepriser, inte utgångspris",
        paragraphs: [
          "Titta på vad liknande lägenheter faktiskt sålts för – inte vad de annonserades för. Samma antal rum, ungefär samma storlek och liknande standard ger bäst underlag.",
          "Om objektet du tittar på har tydliga fördelar eller nackdelar jämfört med dessa, justera maxbudet upp eller ner med en konkret siffra – inte en känsla.",
        ],
      },
      {
        id: "brf-paverkan",
        heading: "Låt BRF:ens ekonomi påverka maxbudet",
        paragraphs: [
          "Hög skuld per kvm, planerade stambyten eller osäker avgiftsutveckling motiverar ett lägre maxbud. Du betalar inte bara för lägenheten utan för din andel av föreningens förpliktelser.",
          "En lägenhet i en svag förening kan se billig ut men bli dyr över tid genom avgiftshöjningar och särskilda uttag.",
        ],
        bullets: [
          "Kolla skuld per kvm",
          "Läs underhållsplanen",
          "Räkna med möjliga avgiftshöjningar",
        ],
      },
      {
        id: "boendekostnad-grans",
        heading: "Räkna boendekostnad, inte bara köpeskilling",
        paragraphs: [
          "Två lägenheter till samma pris kan kosta olika mycket per månad beroende på avgift, ränta och skick. Ditt maxbud ska passa din månadsbudget – inte bara bankens lånetak.",
          "Räkna konservativt med ränta och amortering. Om marginalen är tunn vid dagens ränta är maxbudet troligen för högt.",
        ],
      },
      {
        id: "satt-gransen",
        heading: "Så sätter du gränsen i praktiken",
        paragraphs: [
          "Skriv ner tre siffror: vad liknande lägenheter sålts för, vad BRF:en motiverar i justering och vad din budget tillåter. Det lägsta av dessa blir utgångspunkt för maxbudet.",
          "Bestäm maxbudet innan visningen eller senast innan första budet. Under budgivning är det för sent att tänka klart.",
        ],
        callout:
          "Maxbudet är ett löfte till dig själv – inte ett mål att nå.",
      },
      {
        id: "hall-fast",
        heading: "Håll fast vid maxbudet",
        paragraphs: [
          "Om budgivningen passerar ditt maxbud är det inte ett misslyckande – det är information om att marknaden värderar lägenheten högre än du.",
          "Att höja maxbudet i stunden för att 'inte missa' är det vanligaste misstaget. Skriv ner varför du satt gränsen – det hjälper dig hålla den.",
        ],
      },
    ],
    faq: [
      {
        q: "Ska maxbudet vara hemligt?",
        a: "Ja, för dig själv och eventuellt en betrodd person. Att dela det med mäklaren eller andra budgivare ger dig ingen fördel.",
      },
      {
        q: "Kan jag höja maxbudet om jag får mer lån?",
        a: "Tekniskt ja, men fråga dig varför du behöver låna mer. Om gränsen baserades på boendekostnad snarare än banktak bör den inte ändras.",
      },
    ],
    relatedSlugs: [
      "hur-mycket-ska-man-buda-over-utgangspris",
      "budstrategi-bostadsratt",
      "checklista-innan-budgivning",
    ],
    relatedToolSlugs: ["maxbud"],
  },
  {
    slug: "budstrategi-bostadsratt",
    title: "Budstrategi för bostadsrätt",
    metaTitle:
      "Budstrategi för bostadsrätt – öppningsbud, nästa bud och gräns | skajagbuda.se",
    metaDescription:
      "Öppningsbud, budsteg och maxgräns – en enkel budstrategi för bostadsrätt som minskar risken att du betalar mer än du planerat under het budgivning.",
    intro:
      "Budgivning är ofta stressig och utformad för att få dig att agera snabbt. En enkel strategi i förväg – öppningsbud, hur du höjer och var du stoppar – gör att du fattar beslut innan pressen sätter in. Det handlar inte om att 'vinna' budgivningen utan om att inte betala mer än lägenheten är värd för dig.",
    sections: [
      {
        id: "forberedelse",
        heading: "Förberedelse innan första budet",
        paragraphs: [
          "Ha maxbud, jämförelsepriser och BRF-analys klara innan budgivningen. Utan det reagerar du på andras bud istället för att följa din plan.",
          "Bestäm också hur du budar – via mäklare, skriftligt och med tydliga belopp. Missförstånd i budgivningen kan bli dyrt.",
        ],
      },
      {
        id: "oppningsbud",
        heading: "Öppningsbud: signalera utan att avslöja allt",
        paragraphs: [
          "Ett öppningsbud nära utgångspriset eller strax under jämförelseprisens nedre del visar att du är seriös. Att börja för lågt kan få säljaren att prioritera andra.",
          "Avslöja aldrig ditt maxbud i öppningsbudet. Du behöver utrymme att höja stegvis.",
        ],
      },
      {
        id: "budsteg",
        heading: "Hur stora ska budstegen vara?",
        paragraphs: [
          "I en het budgivning höjer många med 50 000–100 000 kr i taget beroende på prisnivå. Mindre steg kan fungera om få budgivare finns.",
          "Håll jämna steg tills du närmar dig maxbudet. Spara de sista pengarna till slutet – inte till början.",
        ],
        bullets: [
          "Börja inte med maxbud",
          "Höj i planerade steg",
          "Sista budet ska vara ditt max – inte över",
        ],
      },
      {
        id: "maxgrans",
        heading: "Maxgränsen är inte förhandlingsbar",
        paragraphs: [
          "När du når maxbudet stoppar du. Att lägga 'ett sista bud' utan ny information är sällan motiverat.",
          "Om du förlorar budgivningen till någon som betalade mer vet du att marknaden värderade högre – inte att du gjorde fel.",
        ],
        callout:
          "Budstrategi handlar om disciplin, inte om psykologiska trick.",
      },
      {
        id: "efter-budgivning",
        heading: "Efter budgivningen",
        paragraphs: [
          "Om du vann: kontrollera att budet accepterades korrekt och att inga villkor saknas. Om du förlorade: analysera om maxbudet var rimligt, inte om du 'borde budat mer'.",
          "Varje budgivning ger dig data om marknaden. Använd den till nästa objekt.",
        ],
      },
    ],
    faq: [
      {
        q: "Ska jag buda direkt när någon annan budar?",
        a: "Nej, om du inte har tänkt igenom nästa steg. Ta tid att räkna – minuter spelar sällan roll jämfört med fel belopp.",
      },
      {
        q: "Fungerar det att buda exakt maxbud direkt?",
        a: "Sällan klokt. Du lämnar inget utrymme och signalerar att du inte kan höja mer – vilket kan göra att säljaren väljer en budgivare med mer marginal.",
      },
    ],
    relatedSlugs: [
      "vad-ar-rimligt-maxbud",
      "hur-mycket-ska-man-buda-over-utgangspris",
      "checklista-innan-budgivning",
    ],
    relatedToolSlugs: ["maxbud"],
  },
  {
    slug: "vad-ska-man-fraga-maklaren-innan-bud",
    title: "Frågor att ställa mäklaren innan du budar",
    metaTitle: "Frågor att ställa mäklaren innan du budar | skajagbuda.se",
    metaDescription:
      "Vilka frågor bör du ställa mäklaren innan budgivning? Konkreta frågor om BRF, budläge, fel och underhåll – utan att lita blint på svaren.",
    intro:
      "Mäklaren representerar säljaren, inte dig. Det betyder inte att svaren är värdelösa – men du måste ställa rätt frågor och verifiera viktiga uppgifter själv. Här är frågorna som faktiskt påverkar ditt budbeslut.",
    sections: [
      {
        id: "budlage",
        heading: "Frågor om budläget",
        paragraphs: [
          "Fråga hur många som visat intresse, om det finns registrerade bud och vilka villkor som gäller. Du har rätt att veta budgivningens läge innan du lägger bud.",
          "Be om skriftlig bekräftelse på bud och villkor. Muntliga löften om 'inga andra bud' är inte tillräckliga.",
        ],
        bullets: [
          "Finns registrerade bud?",
          "Vilka budgivningsvillkor gäller?",
          "När är sista buddag?",
        ],
      },
      {
        id: "brf-fraga",
        heading: "Frågor om föreningen",
        paragraphs: [
          "Fråga om planerade underhåll, avgiftshöjningar, stambyten och eventuella särskilda uttag. Be om årsredovisning och underhållsplan om du inte redan fått dem.",
          "Om mäklaren inte kan svara på grundläggande BRF-frågor är det ett tecken att göra egen research innan bud.",
        ],
      },
      {
        id: "lagenhet-fel",
        heading: "Frågor om lägenheten och fel",
        paragraphs: [
          "Fråga om kända fel, fuktproblem, störningar, planerade renoveringar i huset och vad som ingår i föreningens ansvar versus ditt.",
          "Kolla föreningens stadgar och ansvarsfördelning. 'Renoverat kök' betyder inte att stammarna är fräscha.",
        ],
      },
      {
        id: "dokumentation",
        heading: "Dokumentation du ska begära",
        paragraphs: [
          "Årsredovisning, underhållsplan, stadgar, energideklaration och eventuell besiktningsrapport. Utan dessa budar du delvis i blindo.",
          "Om dokument saknas, fråga varför. Ibland är det slarv – ibland döljer det problem.",
        ],
        callout:
          "Mäklarens svar är en startpunkt. Verifiera mot årsredovisningen.",
      },
      {
        id: "varningssignaler",
        heading: "Varningssignaler i svaren",
        paragraphs: [
          "Vaga svar om BRF:ens ekonomi, 'det löser sig' kring underhåll eller press att buda snabbt utan dokumentation bör få dig att pausa.",
          "En bra mäklare ger tydliga svar och dokument. En som undviker frågor skyddar affären – inte dig.",
        ],
      },
    ],
    faq: [
      {
        q: "Måste mäklaren svara ärligt?",
        a: "Mäklaren ska inte lämna vilseledande uppgifter, men hen prioriterar säljarens intresse. Du ansvarar själv för att granska dokumentationen.",
      },
      {
        q: "Kan jag lita på att inga andra budar?",
        a: "Nej, förrän bud är registrerade enligt budgivningsreglerna. Fråga alltid om skriftlig status.",
      },
    ],
    relatedSlugs: [
      "analysera-brf-arsredovisning",
      "roda-flaggor-bostadsratt",
      "checklista-innan-budgivning",
    ],
    relatedToolSlugs: ["boendekostnad"],
  },
  {
    slug: "analysera-brf-arsredovisning",
    title: "Analysera BRF-årsredovisning innan köp",
    metaTitle: "Analysera BRF-årsredovisning innan köp | skajagbuda.se",
    metaDescription:
      "Årsredovisningen avslöjar mer än visningen. Lär dig vad du ska titta på – skuld, avgifter, kassa och underhåll – innan du lägger bud på bostadsrätt.",
    intro:
      "Årsredovisningen är den viktigaste dokumentet du läser innan bud – inte annonsen och inte visningen. Den visar föreningens ekonomi, skulder, avgiftsutveckling och planerade underhåll. Att hoppa över den är att köpa en andel i en förening du inte känner till.",
    sections: [
      {
        id: "var-hittar-du",
        heading: "Var hittar du årsredovisningen?",
        paragraphs: [
          "Mäklaren ska tillhandahålla den. Du kan också begära den direkt från föreningen eller hitta den via Alla Bolag och liknande tjänster.",
          "Läs de senaste två till tre årens redovisningar – en enskild bra rapport kan dölja en negativ trend.",
        ],
      },
      {
        id: "skuld-och-avgift",
        heading: "Skuld per kvm och avgiftsutveckling",
        paragraphs: [
          "Jämför skulden per kvm med liknande föreningar i området. Hög skuld utan tydlig plan för avbetalning ökar risken för framtida avgiftshöjningar.",
          "Titta på hur avgiften utvecklats de senaste fem åren. Stadigt stigande avgifter utan motsvarande förbättringar i fastigheten är en varningssignal.",
        ],
        bullets: [
          "Skuld per kvm",
          "Avgift per kvm",
          "Trend över flera år",
        ],
      },
      {
        id: "resultat-kassa",
        heading: "Resultat, kassa och soliditet",
        paragraphs: [
          "Föreningen ska gå plus eller i värsta fall break-even över tid. Upprepade underskott utan förklaring är problematiskt.",
          "Kassa och likviditet visar om föreningen klarar oförutsedda utgifter utan särskilt uttag eller lån.",
        ],
      },
      {
        id: "underhall-planer",
        heading: "Underhåll och planerade projekt",
        paragraphs: [
          "Läs underhållsplanen tillsammans med årsredovisningen. Stora kommande projekt – stambyte, fasad, tak – ska ha finansiering eller tydlig plan.",
          "Om underhållsplanen saknas eller är föråldrad vet föreningen troligen inte vad som behöver göras – det blir ditt problem som andelsägare.",
        ],
        callout:
          "Planerat stambyte utan buffert i kassan betyder troligen högre avgift eller särskilt uttag.",
      },
      {
        id: "lokaler-tomtratt",
        heading: "Lokaler, tomträtt och övriga risker",
        paragraphs: [
          "Notera intäkter från lokaler, tomträttsavgäld och andra poster som kan förändras. Dessa påverkar föreningens långsiktiga ekonomi.",
          "Läs noterna i årsredovisningen – där finns ofta detaljer om tvister, skadestånd och osäkra fordringar.",
        ],
      },
    ],
    faq: [
      {
        q: "Räcker ett års årsredovisning?",
        a: "Nej, titta på minst två till tre år för att se trender. Ett bra år kan vara undantag.",
      },
      {
        q: "Vad gör jag om årsredovisningen är svår att förstå?",
        a: "Fokusera på skuld per kvm, avgiftstrend, kassa och planerade underhåll. Resten kan du fråga om eller konsultera någon med erfarenhet.",
      },
    ],
    relatedSlugs: [
      "vad-ar-hog-skuld-per-kvm-brf",
      "underhallsplan-brf",
      "kassa-i-bostadsrattsforening",
    ],
    relatedToolSlugs: ["brf-skuld-per-kvm"],
  },
  {
    slug: "vad-ar-hog-skuld-per-kvm-brf",
    title: "Vad är hög skuld per kvm i en BRF?",
    metaTitle: "Vad är hög skuld per kvm i en BRF? | skajagbuda.se",
    metaDescription:
      "Hög skuld per kvm i BRF ökar risken för avgiftshöjningar. Så tolkar du siffran, jämför med andra föreningar och avgör om den påverkar ditt maxbud.",
    intro:
      "Skuld per kvm är en av de mest användbara siffrorna i en BRF:s årsredovisning. Den visar hur mycket lån föreningen har i förhållande till sin storlek – och indikerar om framtida avgifter kan pressas upp. Det finns ingen magisk gräns, men du kan jämföra och bedöma risken.",
    sections: [
      {
        id: "vad-ar-siffran",
        heading: "Vad mäter skuld per kvm?",
        paragraphs: [
          "Skuld per kvm är föreningens totala räntebärande skulder dividerat med den totala boytan. Den visar belåningsgraden per kvadratmeter bostadsyta.",
          "Siffran säger inget om lägenhetens skick men mycket om föreningens finansiella utrymme framåt.",
        ],
      },
      {
        id: "jamforelse",
        heading: "Hur jämför du med andra föreningar?",
        paragraphs: [
          "Jämför med föreningar i samma område och ungefär samma byggår. Nyare hus har ofta högre skuld efter nyproduktion; äldre kan ha lägre skuld eller stora kommande lån för renovering.",
          "En skuld på 8 000 kr/kvm kan vara normal i ett nybyggt område men hög i en äldre förening utan planerade investeringar.",
        ],
        bullets: [
          "Jämför med liknande föreningar",
          "Titta på trenden över år",
          "Koppla till underhållsplanen",
        ],
      },
      {
        id: "nar-ar-hog",
        heading: "När är skulden 'hög'?",
        paragraphs: [
          "Det finns ingen universell gräns, men skuld per kvm som sticker ut markant i området – eller som stiger snabbt utan tydligt syfte – motiverar extra försiktighet.",
          "Hög skuld kombinerat med låg kassa, planerat stambyte och stigande räntor ökar sannolikheten för avgiftshöjningar.",
        ],
        callout:
          "Hög skuld är inte automatiskt dåligt – men ohöjd skuld utan plan är det.",
      },
      {
        id: "paverkan-maxbud",
        heading: "Hur påverkar det ditt maxbud?",
        paragraphs: [
          "Hög skuld per kvm motiverar ett lägre maxbud eftersom du indirekt tar över en del av föreningens skuldbörda via framtida avgifter.",
          "Räkna in möjliga avgiftshöjningar i din boendekostnad innan du bestämmer vad lägenheten är värd.",
        ],
      },
      {
        id: "fragor-att-stalla",
        heading: "Frågor att ställa om skulden",
        paragraphs: [
          "Vad lånet finansierat, när det ska amorteras och om nya lån planeras. Be om förklaring om skulden ökat kraftigt ett enskilt år.",
          "Om styrelsen inte kan förklara skuldbilden saknar du grund för att bedöma risken.",
        ],
      },
    ],
    faq: [
      {
        q: "Vad är en typisk skuld per kvm?",
        a: "Det varierar kraftigt. Jämför inom samma område snarare än att lita på en generell tumregel.",
      },
      {
        q: "Ska jag avstå om skulden är hög?",
        a: "Inte automatiskt – men du bör kräva tydlig förklaring och justera maxbud och boendekostnadskalkyl därefter.",
      },
    ],
    relatedSlugs: [
      "analysera-brf-arsredovisning",
      "avgiftshojning-brf",
      "for-lag-avgift-bostadsratt",
    ],
    relatedToolSlugs: ["brf-skuld-per-kvm"],
  },
  {
    slug: "stambyte-bostadsratt-risk",
    title: "Stambyte i bostadsrätt – risk eller möjlighet?",
    metaTitle: "Stambyte i bostadsrätt – risk eller möjlighet? | skajagbuda.se",
    metaDescription:
      "Stambyte kan kosta hundratusentals kronor per lägenhet. Så bedömer du om planerat eller genomfört stambyte är en risk eller en möjlighet vid köp.",
    intro:
      "Stambyte är bland de dyraste underhållsåtgärderna en BRF gör. Ett genomfört stambyte kan vara en fördel; ett planerat utan finansiering är en tydlig ekonomisk risk. Du behöver veta vilket läge föreningen är i innan du budar.",
    sections: [
      {
        id: "vad-ar-stambyte",
        heading: "Vad innebär stambyte?",
        paragraphs: [
          "Stambyte innebär att stammar för vatten och avlopp byts ut – ofta i samband med badrumsrenovering. Det är obligatoriskt underhåll när rören närmar sig slutet av sin livslängd.",
          "Kostnaden fördelas på alla bostadsrättsinnehavare via avgiftshöjning, särskilt uttag eller lån.",
        ],
      },
      {
        id: "genomfort-stambyte",
        heading: "Genomfört stambyte – oftast positivt",
        paragraphs: [
          "Om stambytet nyligen genomförts och finansieringen är klar minskar risken för stora oväntade utgifter. Kontrollera att arbetet är godkänt och att kostnaden faktiskt betalats.",
          "Fråga om standard på badrum – ibland ingår lägenhetsinteriören i stambytet, ibland inte.",
        ],
      },
      {
        id: "planerat-stambyte",
        heading: "Planerat stambyte utan finansiering",
        paragraphs: [
          "Om stambyte planeras men inte finansierat är det en röd flagga. Du kan få en stor kostnad kort efter tillträde.",
          "Kolla underhållsplanen, styrelseprotokoll och om föreningen sparar till projektet. Låg kassa plus planerat stambyte är en dålig kombination.",
        ],
        bullets: [
          "När planeras stambytet?",
          "Hur ska det finansieras?",
          "Vad kostar det per lägenhet?",
        ],
        callout:
          "Planerat stambyte utan buffert = trolig avgiftshöjning eller särskilt uttag.",
      },
      {
        id: "paverkan-pris",
        heading: "Hur påverkar stambyte priset?",
        paragraphs: [
          "Genomfört stambyte kan motivera högre pris. Kommande stambyte utan klar finansiering bör sänka ditt maxbud med den förväntade kostnaden.",
          "Räkna inte med att 'det löser sig' – det gör det sällan utan att någon betalar.",
        ],
      },
      {
        id: "fragor-innan-bud",
        heading: "Frågor att ställa innan bud",
        paragraphs: [
          "När gjordes eller planeras stambyte? Vad kostade eller beräknas det kosta? Hur finansierades eller ska det finansieras?",
          "Be om dokumentation – inte bara muntliga besked från mäklaren.",
        ],
      },
    ],
    faq: [
      {
        q: "Måste föreningen informera om planerat stambyte?",
        a: "Information ska finnas i underhållsplan och årsredovisning. Fråga aktivt om det inte är tydligt.",
      },
      {
        q: "Kan jag förhandla om priset pga stambyte?",
        a: "Du kan justera ditt maxbud baserat på förväntad kostnad. Det är inte förhandling i traditionell mening utan rationell prissättning.",
      },
    ],
    relatedSlugs: [
      "underhallsplan-brf",
      "avgiftshojning-brf",
      "analysera-brf-arsredovisning",
    ],
    relatedToolSlugs: ["brf-skuld-per-kvm"],
  },
  {
    slug: "avgiftshojning-brf",
    title: "Avgiftshöjning i BRF",
    metaTitle:
      "Avgiftshöjning i BRF – vad betyder det för dig som köpare? | skajagbuda.se",
    metaDescription:
      "Stigande avgift äter upp din boendebudget. Så tolkar du avgiftshistorik, förstår varför avgiften höjs och bedömer risken innan du budar.",
    intro:
      "Månadsavgiften är ofta den största kostnaden utöver räntan – och den kan höjas utan att du kan göra något åt det. Som blivande andelsägare tar du över föreningens ekonomi, inklusive framtida avgiftshöjningar. Att förstå varför avgiften höjs och hur den utvecklats är avgörande.",
    sections: [
      {
        id: "varfor-hojs",
        heading: "Varför höjs avgiften?",
        paragraphs: [
          "Vanliga orsaker: stigande räntor på föreningens lån, underhåll och renoveringar, högre elkostnader, sänkta intäkter från lokaler eller igenkänning av tidigare underhåll.",
          "En engångshöjning för ett specifikt projekt skiljer sig från en trend av årliga höjningar utan tydlig slutpunkt.",
        ],
      },
      {
        id: "las-trenden",
        heading: "Läs trenden i årsredovisningen",
        paragraphs: [
          "Jämför avgiften per kvm över minst fem år. En stadig ökning på 3–5 % per år utan motsvarande förbättringar i fastigheten är oroväckande.",
          "Kolla om höjningar motiveras i styrelseberättelsen eller om de bara 'händer'.",
        ],
        bullets: [
          "Avgift per kvm historik",
          "Koppling till lån och räntor",
          "Planerade projekt framåt",
        ],
      },
      {
        id: "lag-avgift-varning",
        heading: "Låg avgift är inte alltid bra",
        paragraphs: [
          "En avgift som ligger under områdets snitt kan bero på uppskjutet underhåll snarare än god ekonomi. Det betyder ofta höjningar framåt.",
          "Jämför alltid med liknande föreningar – inte bara med din boendekostnadskalkyl.",
        ],
      },
      {
        id: "paverkan-budget",
        heading: "Påverkan på din boendekostnad",
        paragraphs: [
          "Räkna med möjliga avgiftshöjningar i din budget. Om en höjning på 2 000 kr/mån slår ut din marginal är lägenheten för dyr – oavsett köpeskilling.",
          "Hög skuld per kvm och planerade stambyten ökar risken för framtida höjningar.",
        ],
        callout:
          "Köpeskillingen är engångs. Avgiften betalar du varje månad.",
      },
      {
        id: "innan-bud",
        heading: "Vad du bör göra innan bud",
        paragraphs: [
          "Läs avgiftshistorik, fråga om planerade höjningar och koppla det till underhållsplanen. Justera maxbud om risken är hög.",
          "Be om tydliga svar – vaga formuleringar om 'marginella justeringar' räcker inte.",
        ],
      },
    ],
    faq: [
      {
        q: "Kan jag förhandla om avgiften?",
        a: "Nej, avgiften beslutas av föreningen. Du kan bara välja att inte köpa om den är för hög eller riskfylld.",
      },
      {
        q: "Hur mycket kan avgiften höjas?",
        a: "Det finns inget tak. Styrelsen föreslår och stämman beslutar. Din skydd är analysen innan köp.",
      },
    ],
    relatedSlugs: [
      "for-lag-avgift-bostadsratt",
      "vad-ar-hog-skuld-per-kvm-brf",
      "underhallsplan-brf",
    ],
    relatedToolSlugs: ["boendekostnad"],
  },
  {
    slug: "underhallsplan-brf",
    title: "Underhållsplan i BRF",
    metaTitle: "Underhållsplan i BRF – därför är den viktig före bud | skajagbuda.se",
    metaDescription:
      "Underhållsplanen visar vad BRF:en måste göra och när. Så läser du den, kopplar till kostnader och avgör om föreningen har koll innan du budar.",
    intro:
      "Underhållsplanen är föreningens karta över framtida renoveringar och reparationer. Utan en aktuell plan vet föreningen inte vad som behöver göras – och du vet inte vad du kan få betala för. Den hör till standardkollen innan bud.",
    sections: [
      {
        id: "vad-ingar",
        heading: "Vad är en underhållsplan?",
        paragraphs: [
          "En underhållsplan listar byggnadens delar – tak, fasad, stammar, hissar, ventilation – med bedömd status och planerat år för åtgärd.",
          "Den ska uppdateras regelbundet och kopplas till föreningens ekonomiska planering.",
        ],
      },
      {
        id: "vad-titta-pa",
        heading: "Vad du ska titta på",
        paragraphs: [
          "Vilka åtgärder planeras inom 5–10 år? Vad beräknas de kosta? Finns finansiering eller sparande till dem?",
          "Jämför planen med faktiskt gjorda åtgärder i årsredovisningen – stor skillnad tyder på att planen inte följs.",
        ],
        bullets: [
          "Kommande 5–10 års åtgärder",
          "Beräknade kostnader",
          "Koppling till kassa och lån",
        ],
      },
      {
        id: "saknas-plan",
        heading: "Om underhållsplanen saknas",
        paragraphs: [
          "Saknas plan eller är den mer än tio år gammal är det en röd flagga. Föreningen kan ha uppskjutit underhåll som sedan blir akut och dyrt.",
          "Fråga styrelsen direkt varför planen saknas eller inte uppdaterats.",
        ],
        callout:
          "Ingen underhållsplan = ingen kontroll över framtida kostnader.",
      },
      {
        id: "koppling-avgift",
        heading: "Koppling till avgift och skuld",
        paragraphs: [
          "Stora planerade åtgärder utan buffert i kassan leder nästan alltid till lån eller särskilda uttag – och högre avgift.",
          "Läs planen tillsammans med skuld per kvm och kassa för att få helheten.",
        ],
      },
      {
        id: "innan-bud",
        heading: "Använd planen i budbeslutet",
        paragraphs: [
          "Om stora åtgärder väntar utan finansiering, sänk maxbudet med den förväntade kostnaden. Om underhåll nyligen gjorts kan det motivera ett högre bud.",
          "Planen ger dig argument för ditt maxbud – inte bara känsla.",
        ],
      },
    ],
    faq: [
      {
        q: "Är underhållsplan obligatorisk?",
        a: "Den är starkt rekommenderad och praxis i välskötta föreningar. Frånvaro är i sig ett tecken på dålig förvaltning.",
      },
      {
        q: "Hur detaljerad ska planen vara?",
        a: "Tillräckligt för att se vad, när och ungefär hur mycket. Vaga formuleringar utan kostnadsuppskattning är svaga.",
      },
    ],
    relatedSlugs: [
      "stambyte-bostadsratt-risk",
      "analysera-brf-arsredovisning",
      "kassa-i-bostadsrattsforening",
    ],
    relatedToolSlugs: ["brf-skuld-per-kvm"],
  },
  {
    slug: "kassa-i-bostadsrattsforening",
    title: "Kassa i bostadsrättsförening",
    metaTitle:
      "Kassa i bostadsrättsförening – hur mycket är tillräckligt? | skajagbuda.se",
    metaDescription:
      "Föreningens kassa avslöjar om den klarar oväntade utgifter. Så bedömer du likviditet, buffert och risken för särskilt uttag innan du köper bostadsrätt.",
    intro:
      "Kassan visar om föreningen har pengar att ta av när något går sönder – utan att höja avgiften eller ta nya lån direkt. En stark årsredovisning med hög skuld kan ändå vara riskfylld om kassan är tom. Det här är en av de mest förbisedda siffrorna vid bostadsköp.",
    sections: [
      {
        id: "vad-ar-kassa",
        heading: "Vad menas med kassa i BRF?",
        paragraphs: [
          "Kassa och bankmedel i årsredovisningen visar föreningens likvida medel. Det inkluderar inte fastighetens värde – bara pengar som kan användas direkt.",
          "Jämför kassan med planerade utgifter i underhållsplanen för att se om bufferten räcker.",
        ],
      },
      {
        id: "hur-mycket",
        heading: "Hur mycket är tillräckligt?",
        paragraphs: [
          "Det finns ingen fast regel, men en förening bör ha buffert för oförutsedda utgifter och pågående underhåll. Om kassan är nära noll samtidigt som stora projekt planeras är risken hög.",
          "Jämför med liknande föreningar i området och med föreningens egna underhållsplan.",
        ],
        bullets: [
          "Kassa i förhållande till årsavgifter",
          "Planerade utgifter närmaste åren",
          "Trend – minskar kassan?",
        ],
      },
      {
        id: "lag-kassa",
        heading: "Låg kassa – vad händer då?",
        paragraphs: [
          "Låg kassa leder ofta till särskilt uttag (engångsbelopp från varje ägare), nya lån eller kraftiga avgiftshöjningar vid oförutsedda händelser.",
          "Du som ny ägare kan få en faktura kort efter tillträde om föreningen inte har marginal.",
        ],
        callout:
          "Tom kassa + planerat stambyte = hög risk för plötslig kostnad.",
      },
      {
        id: "las-tillsammans",
        heading: "Läs kassa tillsammans med skuld",
        paragraphs: [
          "Hög skuld och låg kassa är en svag kombination. Hög skuld med god kassa och tydlig amorteringsplan kan vara hanterbart.",
          "Titta också på om föreningen har uppskjutit underhåll för att hålla kassan och avgiften artificiellt låga.",
        ],
      },
      {
        id: "budbeslut",
        heading: "Påverkan på budbeslutet",
        paragraphs: [
          "Svag kassa motiverar lägre maxbud och högre buffert i din egen budget. Fråga styrelsen om sparmål och hur oförutsedda utgifter hanteras.",
          "Om svaren är vaga är det ytterligare en anledning att vara försiktig.",
        ],
      },
    ],
    faq: [
      {
        q: "Var hittar jag kassan i årsredovisningen?",
        a: "I balansräkningen under likvida medel eller bankmedel. Jämför med föregående år.",
      },
      {
        q: "Kan kassan vara för hög?",
        a: "En stor kassa utan plan kan tyda på dålig avkastning, men är sällan ett problem för dig som köpare. Det värre är för lite.",
      },
    ],
    relatedSlugs: [
      "analysera-brf-arsredovisning",
      "underhallsplan-brf",
      "avgiftshojning-brf",
    ],
    relatedToolSlugs: ["boendekostnad"],
  },
  {
    slug: "pris-per-kvm-bostadsratt",
    title: "Pris per kvm",
    metaTitle:
      "Pris per kvm – så använder du det utan att bli lurad | skajagbuda.se",
    metaDescription:
      "Pris per kvm är ett verktyg – inte en sanning. Så jämför du rätt, undviker fällor och sätter ett rimligt maxbud utan att låta kvadratmetersiffran styra.",
    intro:
      "Pris per kvm används överallt i bostadsannonser – men siffran säger bara något om du jämför likvärdiga objekt på rätt sätt. Fel jämförelser ger falsk trygghet och kan få dig att betala för mycket. Här är hur du använder måttet utan att bli lurad.",
    sections: [
      {
        id: "vad-sager-siffran",
        heading: "Vad säger pris per kvm?",
        paragraphs: [
          "Pris per kvm är köpeskillingen dividerad med bostadsytan. Det underlättar jämförelse mellan lägenheter av olika storlek i samma område.",
          "Det säger inget om föreningens ekonomi, läge i huset eller skick – bara om prisnivån per ytenhet.",
        ],
      },
      {
        id: "fel-jamforelser",
        heading: "Vanliga fel jämförelser",
        paragraphs: [
          "Att jämföra en tvåa med en fyra, bottenvåning med översta våningen eller renoverad med originalskick ger missvisande siffror.",
          "Biarea, balkong och uteplats räknas olika i olika annonser – jämför inte ytor som inte är likvärdiga.",
        ],
        bullets: [
          "Samma antal rum och liknande storlek",
          "Samma område och standard",
          "Justera för våning och skick",
        ],
      },
      {
        id: "slutpris-statistik",
        heading: "Använd slutpris, inte utgångspris",
        paragraphs: [
          "Räkna pris per kvm på faktiska slutpriser från liknande objekt. Utgångspris per kvm speglar mäklarens strategi – inte marknadsvärdet.",
          "Slutprisstatistik per område ger bättre intervall för ditt maxbud.",
        ],
      },
      {
        id: "brf-justering",
        heading: "Justera för BRF och skick",
        paragraphs: [
          "Två lägenheter med samma pris per kvm kan vara olika bra affärer om den ena har lägre avgift och bättre förening.",
          "Dra av mentalt för hög skuld, planerat stambyte eller dåligt skick – eller lägg till för genomfört underhåll.",
        ],
        callout:
          "Pris per kvm utan BRF-analys är halva bilden.",
      },
      {
        id: "praktisk-anvandning",
        heading: "Praktisk användning inför bud",
        paragraphs: [
          "Sätt ett intervall för rimligt pris per kvm baserat på slutpriser. Om objektet ligger över intervallet, kräv en tydlig motivering.",
          "Använd siffran som kontroll – inte som facit på att lägenheten är bra.",
        ],
      },
    ],
    faq: [
      {
        q: "Vilket pris per kvm är 'normalt'?",
        a: "Det varierar per område och storlek. Jämför inom samma stadsdel och lägenhetstyp.",
      },
      {
        q: "Ska jag bry mig om föreningens skuld per kvm också?",
        a: "Ja. Lägenhetens pris per kvm och föreningens skuld per kvm hör ihop i din totala riskbedömning.",
      },
    ],
    relatedSlugs: [
      "hur-mycket-ska-man-buda-over-utgangspris",
      "vad-ar-rimligt-maxbud",
      "kopa-bostadsratt-stockholm",
    ],
    relatedToolSlugs: ["boendekostnad"],
  },
  {
    slug: "kopa-bostadsratt-stockholm",
    title: "Köpa bostadsrätt i Stockholm",
    metaTitle:
      "Köpa bostadsrätt i Stockholm – saker att kontrollera före bud | skajagbuda.se",
    metaDescription:
      "Stockholmsmarknaden är snabb och dyr. Här är vad du bör kontrollera – pris, BRF, område och budstrategi – innan du budar på bostadsrätt i Stockholm.",
    intro:
      "Stockholm är en av Sveriges dyraste och snabbaste bostadsmarknader. Hög efterfrågan, begränsat utbud och aggressiv budgivning gör det extra viktigt att veta vad du köper och vad du är villig att betala. Generella råd räcker inte – du behöver en tydlig kontrollista.",
    sections: [
      {
        id: "prisniva",
        heading: "Prisnivå och slutpriser",
        paragraphs: [
          "Slutpriser i Stockholm ligger ofta långt över utgångspris i populära områden. Jämför med slutpris per kvm i samma stadsdel – inte bara i hela Stockholm.",
          "Stadsdelar skiljer sig kraftigt. Södermalm, Vasastan och nya områden har olika dynamik och riskprofil.",
        ],
      },
      {
        id: "brf-stockholm",
        heading: "BRF-koll är extra viktig",
        paragraphs: [
          "Många stockholmsföreningar har hög skuld, lokalfastigheter eller tomträtt som påverkar ekonomin. Läs årsredovisningen noggrant – den skiljer bra och dåliga föreningar åt.",
          "Nyproduktion har ofta hög skuld per kvm efter bygglån. Äldre hus kan ha stambyte framför sig.",
        ],
        bullets: [
          "Skuld per kvm vs områdessnitt",
          "Tomträtt och lokaler",
          "Planerade underhåll",
        ],
      },
      {
        id: "omrade",
        heading: "Område och framtida kostnader",
        paragraphs: [
          "Titta på kommande byggnation, buller, parkering och pendling. Attraktivt läge motiverar högre pris – men inte oändligt högre.",
          "Räkna boendekostnad med stockholmsnivå på avgift och ränta. Marginalen är ofta tunnare än i mindre städer.",
        ],
      },
      {
        id: "budgivning",
        heading: "Budgivning i Stockholm",
        paragraphs: [
          "Budgivningar kan gå snabbt med många spekulanter. Ha maxbud klart innan visning och håll dig till det.",
          "Mäklare kan pressa för snabba besked – ta den tid du behöver för att läsa dokument om de saknas.",
        ],
        callout:
          "I Stockholm betalar du ofta premie – se till att du vet vad du får för pengarna.",
      },
      {
        id: "checklista",
        heading: "Snabb checklista före bud",
        paragraphs: [
          "Slutprisjämförelse, BRF-analys, boendekostnad, maxbud och dokumentation. Saknas något av detta är det oftast bättre att vänta.",
          "Det kommer fler objekt – även i Stockholm.",
        ],
      },
    ],
    faq: [
      {
        q: "Hur mycket över utgångspris är normalt i Stockholm?",
        a: "Det varierar per stadsdel och objekt. Slutprisstatistik i området ger bättre svar än generella procentsatser.",
      },
      {
        q: "Är nyproduktion säkrare?",
        a: "Inte automatiskt. Nybyggda föreningar har ofta hög skuld och osäker avgiftsutveckling de första åren.",
      },
    ],
    relatedSlugs: [
      "budgivning-stockholm",
      "pris-per-kvm-bostadsratt",
      "checklista-innan-budgivning",
    ],
    relatedToolSlugs: ["boendekostnad"],
  },
  {
    slug: "budgivning-stockholm",
    title: "Budgivning i Stockholm",
    metaTitle:
      "Budgivning i Stockholm – så tänker du mer rationellt | skajagbuda.se",
    metaDescription:
      "Het budgivning i Stockholm lockar till impulsköp. Så behåller du lugnet, sätter maxbud och undviker att betala mer än lägenheten är värd för dig.",
    intro:
      "Budgivning i Stockholm är ofta intensiv – många spekulanter, korta deadlines och mäklare som skapar tempo. Det är utformat för att få dig att agera snabbt och betala mer. Din försvarslinje är förberedelse, maxbud och disciplin.",
    sections: [
      {
        id: "tempo",
        heading: "Tempot är en del av strategin",
        paragraphs: [
          "Snabba budgivningar och 'sista chansen'-meddelanden ska få dig att höja utan att tänka. Känner du press är det ofta dags att pausa, inte att buda.",
          "Registrerade bud och tydliga villkor gäller – inte muntlig stress.",
        ],
      },
      {
        id: "maxbud-innan",
        heading: "Maxbud innan – inte under",
        paragraphs: [
          "Bestäm maxbud baserat på slutpriser och BRF-analys innan budgivningen. I Stockholm tenderar känslan att säga 'lite till' vid varje steg.",
          "Skriv ner maxbudet och visa det inte för någon. Det är din gräns.",
        ],
        bullets: [
          "Sätt maxbud före budgivning",
          "Höj i planerade steg",
          "Stoppa vid max – utan undantag",
        ],
      },
      {
        id: "jamforelse",
        heading: "Jämför med slutpriser, inte konkurrens",
        paragraphs: [
          "Att någon annan budar mer betyder inte att lägenheten är värd mer för dig. De kan ha sämre koll – eller bättre ekonomi du inte känner till.",
          "Slutprisstatistik i stadsdelen är din referens, inte andra budgivares aggressivitet.",
        ],
      },
      {
        id: "dokument-forst",
        heading: "Dokument först, bud sedan",
        paragraphs: [
          "I heta marknader pressas du buda innan du läst årsredovisningen. Gör det ändå – eller avstå. BRF-problem försvinner inte för att budgivningen är het.",
          "Saknas dokument är det ett tecken att prioritera annat objekt.",
        ],
        callout:
          "FOMO är dyrt i Stockholm. Disciplin är billigare.",
      },
      {
        id: "efter-forlust",
        heading: "Om du förlorar budgivningen",
        paragraphs: [
          "Att förlora är ofta bra för plånboken om du höll maxbudet. Analysera om ditt max var rimligt – inte om du 'borde' budat mer.",
          "Nästa objekt kommer. Marknaden ger dig fler chanser om du har tydliga kriterier.",
        ],
      },
    ],
    faq: [
      {
        q: "Ska jag buda på en gång i Stockholm?",
        a: "Bara om du har gjort hela kollen och vet ditt nästa bud. Snabbhet utan analys är sällan en fördel.",
      },
      {
        q: "Hur hanterar jag budgivning via SMS?",
        a: "Bekräfta alltid skriftligt via mäklaren med tydligt belopp. Ta tid att räkna mellan bud – minuter spelar sällan roll.",
      },
    ],
    relatedSlugs: [
      "kopa-bostadsratt-stockholm",
      "budstrategi-bostadsratt",
      "vad-ar-rimligt-maxbud",
    ],
    relatedToolSlugs: ["maxbud"],
  },
  {
    slug: "roda-flaggor-bostadsratt",
    title: "Röda flaggor vid köp av bostadsrätt",
    metaTitle: "Röda flaggor vid köp av bostadsrätt | skajagbuda.se",
    metaDescription:
      "Vilka varningssignaler bör få dig att pausa innan bud? Från BRF-problem och dolda fel till pressad budgivning – en konkret lista för bostadsköpare.",
    intro:
      "Alla lägenheter har nackdelar – men vissa signaler bör få dig att stanna upp eller dra dig ur helt. Röda flaggor handlar inte om perfektion utan om risker som är dyra att ignorera. Här är de vanligaste du bör känna igen innan bud.",
    sections: [
      {
        id: "brf-flaggor",
        heading: "BRF-relaterade röda flaggor",
        paragraphs: [
          "Hög och stigande skuld per kvm utan förklaring, saknad underhållsplan, upprepade särskilda uttag och låg kassa kombinerat med planerade stambyten.",
          "Avgift som ligger markant under områdessnittet kan tyda på uppskjutet underhåll – inte bra ekonomi.",
        ],
        bullets: [
          "Saknad eller föråldrad underhållsplan",
          "Tom kassa + stora planerade projekt",
          "Otydlig skuldhistorik",
        ],
      },
      {
        id: "lagenhet-flaggor",
        heading: "Lägenhetsrelaterade röda flaggor",
        paragraphs: [
          "Fuktskador, mögel, sprickor, ljuddämpningsproblem och dålig ventilation. Fråga om historik och be om dokumentation vid kända problem.",
          "Renovering utan besiktning eller utan tillstånd kan dölja dyra fel.",
        ],
      },
      {
        id: "maklare-flaggor",
        heading: "Mäklare och budgivning",
        paragraphs: [
          "Press att buda utan årsredovisning, vaga svar om BRF:en, motstridiga uppgifter om budläge eller 'det löser sig'-attityd kring risker.",
          "Mäklaren jobbar för säljaren. Otydlighet skyddar inte dig.",
        ],
        callout:
          "Dokumentation som uteblir är i sig en röd flagga.",
      },
      {
        id: "ekonomi-flaggor",
        heading: "Ekonomiska varningssignaler",
        paragraphs: [
          "Pris per kvm klart över områdessnitt utan motivering, boendekostnad som pressar budgeten redan idag eller maxbud som bara 'känns rätt'.",
          "Om du rationaliserar varför du borde betala mer är det ofta dags att stanna.",
        ],
      },
      {
        id: "vad-gora",
        heading: "Vad du bör göra",
        paragraphs: [
          "Pausa budgivningen, begär dokument, ställ skriftliga frågor och justera maxbudet. Vid allvarliga flaggor – avstå helt.",
          "En missad lägenhet kostar inget. En dålig affär kostar mycket.",
        ],
      },
    ],
    faq: [
      {
        q: "Hur många röda flaggor är för många?",
        a: "En allvarlig flagga kan räcka – till exempel planerat stambyte utan finansiering. Flera mindre flaggor tillsammans motiverar också försiktighet.",
      },
      {
        q: "Kan jag buda lägre pga röda flaggor?",
        a: "Du sätter maxbud baserat på risk. Det är inte straff utan rationell prissättning.",
      },
    ],
    relatedSlugs: [
      "vad-ska-man-fraga-maklaren-innan-bud",
      "analysera-brf-arsredovisning",
      "checklista-innan-budgivning",
    ],
    relatedToolSlugs: ["brf-skuld-per-kvm"],
  },
  {
    slug: "for-lag-avgift-bostadsratt",
    title: "För låg avgift i bostadsrätt",
    metaTitle:
      "För låg avgift i bostadsrätt – kan det vara en varningssignal? | skajagbuda.se",
    metaDescription:
      "En avgift under snittet lockar – men kan dölja uppskjutet underhåll. Så avgör du om låg månadsavgift är en fördel eller en varningssignal vid köp.",
    intro:
      "En låg månadsavgift ser attraktiv ut i annonsen – men den kan vara låg av fel anledning. Föreningar som skjuter upp underhåll för att hålla avgiften nere skapar framtida kostnader som du som ny ägare får ta. Det är värt att gräva innan du tolkar låg avgift som en bonus.",
    sections: [
      {
        id: "varfor-lag",
        heading: "Varför kan avgiften vara låg?",
        paragraphs: [
          "Goda skäl: nyligen genomfört underhåll, god kassa, låg skuld och effektiv förvaltning. Dåliga skäl: uppskjutet underhåll, underskott som inte redovisats tydligt eller artificiellt låg avgift inför försäljning.",
          "Din uppgift är att avgöra vilket det är – inte att ta siffran för given.",
        ],
      },
      {
        id: "jamfor-snitt",
        heading: "Jämför med områdessnittet",
        paragraphs: [
          "Kolla avgift per kvm i liknande föreningar i samma område. Ligger din förening 20–30 % under utan tydlig förklaring bör du vara skeptisk.",
          "Fråga styrelsen varför avgiften är lägre och be om underlag.",
        ],
        bullets: [
          "Avgift per kvm vs grannföreningar",
          "Underhållsplanens status",
          "Kassa och skuldtrend",
        ],
      },
      {
        id: "uppskjutet-underhall",
        heading: "Tecken på uppskjutet underhåll",
        paragraphs: [
          "Föråldrad underhållsplan, låg kassa, kända skador som inte åtgärdats och styrelseprotokoll som nämner 'avgiftsdisciplin' utan underhållsdiskussion.",
          "Det här mönstret slutar nästan alltid med höjning eller särskilt uttag.",
        ],
        callout:
          "Låg avgift idag kan bli hög avgift imorgon – utan förvarning om du inte läst planen.",
      },
      {
        id: "nyproduktion",
        heading: "Nyproduktion och temporärt låga avgifter",
        paragraphs: [
          "I nybyggda föreningar kan avgiften vara låg de första åren innan garantier löper ut och underhållsbehovet blir verklighet. Läs prognoser i årsredovisningen.",
          "Hög skuld per kvm i nyproduktion kombinerat med låg avgift är en klassisk riskprofil.",
        ],
      },
      {
        id: "budbeslut",
        heading: "Hur det påverkar ditt bud",
        paragraphs: [
          "Om låg avgift verkar misstänkt, räkna med framtida höjning i boendekostnaden och sänk maxbudet. Om den är låg av goda skäl – dokumenterat underhåll och god ekonomi – är det en fördel.",
          "Låt underlaget styra, inte annonsens månadsavgift.",
        ],
      },
    ],
    faq: [
      {
        q: "Hur låg är 'för låg' avgift?",
        a: "Jämför med liknande föreningar. En tydlig avvikelse utan förklaring motiverar extra granskning.",
      },
      {
        q: "Kan mäklaren garantera att avgiften inte höjs?",
        a: "Nej. Styrelsen och stämman beslutar. Du måste läsa historik och planer själv.",
      },
    ],
    relatedSlugs: [
      "avgiftshojning-brf",
      "underhallsplan-brf",
      "analysera-brf-arsredovisning",
    ],
    relatedToolSlugs: ["boendekostnad"],
  },
  {
    slug: "lokalfastigheter-brf-risk",
    title: "Lokalfastigheter i BRF",
    metaTitle: "Lokalfastigheter i BRF – risker att förstå innan bud | skajagbuda.se",
    metaDescription:
      "Hyresintäkter från lokaler kan stötta en BRF – eller bli en risk om hyresgäster flyttar. Så bedömer du lokalfastigheter innan du köper bostadsrätt.",
    intro:
      "Många bostadsrättsföreningar äger lokaler som genererar hyresintäkter. Det kan stabilisera avgiften – eller skapa risk om hyresgäster lämnar, hyror omförhandlas eller lokaler står tomma. Som andelsägare delar du den risken.",
    sections: [
      {
        id: "varfor-lokaler",
        heading: "Varför BRF:er äger lokaler",
        paragraphs: [
          "Lokaler i bottenplan hyrs ofta ut till butiker, kontor eller restauranger. Intäkterna kan subventionera bostadsägarnas avgifter.",
          "I årsredovisningen syns intäkter från lokaler – och ibland vakans eller sänkta hyror.",
        ],
      },
      {
        id: "risker",
        heading: "Risker med lokalfastigheter",
        paragraphs: [
          "Hyresgäster kan säga upp avtal, gå i konkurs eller förhandla ner hyran. Tomma lokaler kostar pengar utan att ge intäkt.",
          "Om föreningen är beroende av lokalintäkter för att hålla avgiften nere blir du sårbar vid förändring.",
        ],
        bullets: [
          "Andel lokalintäkter av total budget",
          "Kontraktslängd och hyresgäststabilitet",
          "Vakanshistorik",
        ],
      },
      {
        id: "las-arsredovisning",
        heading: "Vad du hittar i årsredovisningen",
        paragraphs: [
          "Titta på intäkter från lokaler, eventuella vakanser och om intäkterna minskat. Läs noter om hyresavtal och planerade ombyggnationer av lokaler.",
          "Stora förändringar i lokalintäkter det senaste året bör förklaras.",
        ],
        callout:
          "Hög beroende av en hyresgäst = hög risk om de försvinner.",
      },
      {
        id: "fragor",
        heading: "Frågor att ställa",
        paragraphs: [
          "Vilka hyresgäster finns, hur långa är kontrakten och vad händer vid uppsägning? Planeras ombyggnation som kan påverka intäkter?",
          "Om styrelsen inte kan svara vet du inte vilken risk du tar.",
        ],
      },
      {
        id: "maxbud",
        heading: "Påverkan på maxbud",
        paragraphs: [
          "Hög beroende av lokalintäkter utan långa kontrakt motiverar lägre maxbud eller högre buffert i boendekostnaden.",
          "Stabila långsiktiga hyresgäster med rimliga kontrakt minskar risken.",
        ],
      },
    ],
    faq: [
      {
        q: "Är lokaler alltid dåligt?",
        a: "Nej, stabila lokalintäkter kan vara positivt. Risken är beroendet och osäkerheten – inte lokaler i sig.",
      },
      {
        q: "Var ser jag lokalintäkter?",
        a: "I resultaträkningen och noterna i årsredovisningen. Jämför över flera år.",
      },
    ],
    relatedSlugs: [
      "analysera-brf-arsredovisning",
      "tomtratt-bostadsratt",
      "roda-flaggor-bostadsratt",
    ],
    relatedToolSlugs: ["brf-skuld-per-kvm"],
  },
  {
    slug: "tomtratt-bostadsratt",
    title: "Tomträtt i bostadsrätt",
    metaTitle: "Tomträtt i bostadsrätt – vad betyder det för risken? | skajagbuda.se",
    metaDescription:
      "Tomträtt innebär att BRF hyr marken – inte äger den. Så bedömer du tomträttsavgäld, avtal och risk innan du budar på bostadsrätt.",
    intro:
      "Alla bostadsrättsföreningar äger inte marken de står på. Vid tomträtt hyr föreningen marken och betalar tomträttsavgäld – en kostnad som kan omförhandlas och påverka din avgift. Det är en risk många köpare missar.",
    sections: [
      {
        id: "vad-ar-tomtratt",
        heading: "Vad är tomträtt?",
        paragraphs: [
          "Tomträtt innebär att föreningen har rätt att använda marken men inte äger den. Markägaren (ofta kommunen) tar ut tomträttsavgäld.",
          "Avgälden syns i årsredovisningen och påverkar föreningens kostnader.",
        ],
      },
      {
        id: "risk",
        heading: "Risker med tomträtt",
        paragraphs: [
          "Tomträttsavgälden kan omförhandlas vid avtalsslut – ibland kraftigt uppåt. Kort återstående avtalstid utan klar förlängning skapar osäkerhet.",
          "Föreningen kan också behöva betala för att förlänga tomträtten, vilket belastar ekonomin.",
        ],
        bullets: [
          "Återstående avtalstid",
          "Historik av avgäldshöjningar",
          "Planerad omförhandling",
        ],
      },
      {
        id: "jamfor-aganderatt",
        heading: "Tomträtt vs äganderätt",
        paragraphs: [
          "Äganderätt till marken tar bort tomträttsrisken men är inte automatiskt bättre i alla avseenden. Det viktiga är att du förstår kostnaden och avtalet.",
          "Många stockholmsföreningar har tomträtt – det är vanligt men inte riskfritt.",
        ],
        callout:
          "Kort tomträttsavtal utan plan = potentiell avgiftshock.",
      },
      {
        id: "fragor",
        heading: "Frågor att ställa",
        paragraphs: [
          "När löper tomträttsavtalet ut? Vad betalas idag i avgäld och vad hände vid senaste omförhandling? Finns plan för förlängning?",
          "Be om avtalet eller sammanfattning från styrelsen.",
        ],
      },
      {
        id: "budbeslut",
        heading: "Påverkan på budbeslutet",
        paragraphs: [
          "Osäker tomträtt motiverar lägre maxbud och försiktigare boendekostnadskalkyl. Tydligt långt avtal med förutsägbar avgäld minskar risken.",
          "Ignorera inte tomträtten för att lägenheten är fin.",
        ],
      },
    ],
    faq: [
      {
        q: "Är tomträtt alltid dåligt?",
        a: "Nej, men det är en riskfaktor du måste förstå. Långt avtal med stabil avgäld är annat än kort avtal med omförhandling runt hörnet.",
      },
      {
        q: "Var hittar jag tomträttsinformation?",
        a: "I årsredovisningen, noterna och stadgarna. Fråga styrelsen om det inte är tydligt.",
      },
    ],
    relatedSlugs: [
      "lokalfastigheter-brf-risk",
      "analysera-brf-arsredovisning",
      "avgiftshojning-brf",
    ],
    relatedToolSlugs: ["boendekostnad"],
  },
  {
    slug: "besiktning-bostadsratt",
    title: "Behöver man besiktiga en bostadsrätt?",
    metaTitle: "Behöver man besiktiga en bostadsrätt? | skajagbuda.se",
    metaDescription:
      "Besiktning av bostadsrätt är inte obligatorisk men kan avslöja dyra fel. Så avgör du om det är värt det och vad du bör kontrollera innan bud.",
    intro:
      "Till skillnad från villa finns ingen standardiserad besiktning vid köp av bostadsrätt. Ändå kan fukt, el, ventilation och dolda skador kosta mycket. Frågan är inte om besiktning alltid behövs – utan när den är värd kostnaden.",
    sections: [
      {
        id: "obligatoriskt",
        heading: "Är besiktning obligatorisk?",
        paragraphs: [
          "Nej, det finns inget krav på besiktning vid bostadsrättsköp. Säljaren ansvarar för dolda fel enligt köplagen under en begränsad tid, men gränsen mellan dolt fel och underhåll är ofta otydlig.",
          "Du köper lägenheten i befintligt skick om inget annat avtalas.",
        ],
      },
      {
        id: "nar-vart",
        heading: "När är besiktning värt det?",
        paragraphs: [
          "Vid äldre lägenheter, misstänkt fukt, omfattande egenrenovering eller om du saknar kunskap att bedöma el och ventilation själv.",
          "Kostnaden för besiktning är liten jämfört med en felaktig badrumsrenovering eller elproblem.",
        ],
        bullets: [
          "Äldre lägenhet utan dokumenterat underhåll",
          "Spår av fukt eller mögel",
          "Ombyggd lägenhet utan tillstånd",
        ],
      },
      {
        id: "vad-kontrolleras",
        heading: "Vad kontrolleras?",
        paragraphs: [
          "En besiktning täcker ofta fukt, el, ventilation och allmänt skick – inte stammar som ägs av föreningen. Gränsen mellan ditt och föreningens ansvar är viktig.",
          "Läs besiktningsrapporten och ställ frågor om allt som flaggas.",
        ],
      },
      {
        id: "utan-besiktning",
        heading: "Om du avstår besiktning",
        paragraphs: [
          "Gör då en noggrann egen visning: lukt, fläckar, sprickor, fönster, golv och ljud. Fråga om renoveringshistorik och be om kvitton.",
          "Kombinera med BRF-analys – föreningens stammar kan vara problemet även om lägenheten ser bra ut.",
        ],
        callout:
          "Besiktning ersätter inte årsredovisningen – den kompletterar den.",
      },
      {
        id: "infor-bud",
        heading: "Besiktning och budgivning",
        paragraphs: [
          "I het budgivning hinner du sällan besikta före bud. Prioritera då BRF-analys och sätt maxbud som inkluderar risk för renoveringsbehov.",
          "Om besiktning avslöjar allvarliga fel – justera maxbudet eller avstå.",
        ],
      },
    ],
    faq: [
      {
        q: "Kan jag kräva besiktning av säljaren?",
        a: "Du kan begära det som villkor, men säljaren är inte skyldig. I praktiken betalar köparen ofta själv om det görs.",
      },
      {
        q: "Täcker besiktning föreningens stammar?",
        a: "Nej, det som tillhör föreningen ingår inte. Därför är BRF-analysen parallellt viktig.",
      },
    ],
    relatedSlugs: [
      "roda-flaggor-bostadsratt",
      "stambyte-bostadsratt-risk",
      "checklista-innan-budgivning",
    ],
    relatedToolSlugs: ["boendekostnad"],
  },
  {
    slug: "checklista-innan-budgivning",
    title: "Checklista innan budgivning",
    metaTitle:
      "Checklista innan budgivning – detta bör du kontrollera | skajagbuda.se",
    metaDescription:
      "Komplett checklista innan bud på bostadsrätt: pris, BRF, boendekostnad, dokument och maxbud. Gå igenom listan innan du lägger första budet.",
    intro:
      "Budgivning utan förberedelse är det vanligaste misstaget vid bostadsköp. Den här checklistan samlar det du bör ha koll på innan första budet – inte efter att du redan är emotionellt investerad. Gå igenom den ärligt.",
    sections: [
      {
        id: "pris-jamforelse",
        heading: "Pris och jämförelse",
        paragraphs: [
          "Jämfört slutpriser för liknande lägenheter i området? Räknat pris per kvm mot dessa? Vet du vad som motiverar avvikelse?",
          "Satt maxbud baserat på jämförelse – inte utgångspris?",
        ],
        bullets: [
          "Slutpriser senaste 6–12 månaderna",
          "Pris per kvm intervall",
          "Maxbud nedskrivet",
        ],
      },
      {
        id: "brf-check",
        heading: "BRF och ekonomi",
        paragraphs: [
          "Läst årsredovisning och underhållsplan? Kollat skuld per kvm, avgiftstrend och kassa? Vet du om planerat stambyte, tomträtt eller lokaler?",
          "Om något av detta saknas – pausa budgivningen.",
        ],
        bullets: [
          "Årsredovisning 2–3 år",
          "Underhållsplan",
          "Skuld och avgift per kvm",
          "Kassa och planerade projekt",
        ],
      },
      {
        id: "boendekostnad",
        heading: "Boendekostnad och budget",
        paragraphs: [
          "Räknat ränta, amortering, avgift, el och buffert? Testat kalkylen vid högre ränta? Marginalen kvar om avgiften höjs?",
          "Om svaret är nej är lägenheten troligen för dyr – oavsett hur mycket du gillar den.",
        ],
      },
      {
        id: "dokument",
        heading: "Dokument och frågor",
        paragraphs: [
          "Har du stadgar, energideklaration och eventuell besiktningsrapport? Ställt frågor till mäklaren om budläge, fel och planerade åtgärder?",
          "Skriftliga svar på viktiga frågor sparar dig från missförstånd.",
        ],
      },
      {
        id: "strategi",
        heading: "Budstrategi",
        paragraphs: [
          "Vet du ditt öppningsbud och budsteg? Maxbudet är bestämt och du håller det? Du budar inte för att 'inte missa' utan för att siffrorna stämmer?",
          "Om budgivningen passerar maxbudet drar du dig ur – utan skuld.",
        ],
        callout:
          "Checklistan är klar när du kan svara ja på allt – inte när du hoppas det löser sig.",
      },
      {
        id: "sista-kontroll",
        heading: "Sista kontrollen",
        paragraphs: [
          "Visa listan för någon du litar på. Om du inte kan motivera maxbudet med fakta är du inte redo att buda.",
          "Att vänta är alltid ett alternativ.",
        ],
      },
    ],
    faq: [
      {
        q: "Måste allt vara klart innan första bud?",
        a: "Ideellt ja. I praktiken kan budgivning gå snabbt – prioritera då BRF-analys och maxbud som minimum.",
      },
      {
        q: "Vad om jag bara missar en punkt?",
        a: "Beror på vilken. Saknad årsredovisning eller okänt maxbud är allvarligt. Mindre avvikelser kan hanteras med lägre maxbud.",
      },
    ],
    relatedSlugs: [
      "ska-jag-buda-pa-bostadsratt",
      "vad-ar-rimligt-maxbud",
      "analysera-brf-arsredovisning",
      "roda-flaggor-bostadsratt",
    ],
    relatedToolSlugs: ["boendekostnad", "maxbud", "brf-skuld-per-kvm"],
  },
];

export function getGuideBySlug(slug: string): GuideWithMeta | undefined {
  const guide = GUIDES.find((g) => g.slug === slug);
  return guide ? enrichGuide(guide) : undefined;
}

export function getGuidesBySlugs(slugs: string[]): GuideWithMeta[] {
  return slugs
    .map((slug) => getGuideBySlug(slug))
    .filter((guide): guide is GuideWithMeta => guide !== undefined);
}

export function getAllGuides(): GuideWithMeta[] {
  return GUIDES.map(enrichGuide);
}

export function getAllGuideSlugs(): string[] {
  return GUIDES.map((guide) => guide.slug);
}
