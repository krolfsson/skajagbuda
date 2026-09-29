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
          "Sätt ett maxbud innan budgivningen och håll fast vid det. Varje extra krona över ditt max är en förlust, inte en investering. Hur du lägger upp öppningsbud, budsteg och stopp beskrivs i guiden om [budstrategi vid bostadsköp](/guider/budstrategi-bostadsratt).",
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
    title: "Vad är ett rimligt maxbud? Så sätter du maxbud på bostadsrätt",
    metaTitle: "Rimligt maxbud – så sätter du maxbud på bostadsrätt | skajagbuda.se",
    metaDescription:
      "Ett rimligt maxbud är det lägsta av tre siffror: vad liknande bostäder sålts för, vad föreningens ekonomi motiverar och vad din månadsbudget klarar. Så räknar du, steg för steg.",
    intro:
      "Ett rimligt maxbud är det högsta belopp du är beredd att betala, bestämt innan budgivningen börjar. Det bygger på tre saker: vad liknande bostäder faktiskt sålts för, vad föreningens ekonomi och bostadens skick motiverar, och vad du har råd med varje månad. Det lägsta av de tre är ditt maxbud – inte utgångspriset och inte bankens lånelöfte.",
    quickAnswer: [
      "Utgå från slutpriser för liknande bostäder – inte från utgångspriset.",
      "Justera för föreningens ekonomi: skuld, sparande, kommande underhåll och avgift.",
      "Räkna hela månadskostnaden med marginal för högre ränta och avgift.",
      "Maxbudet är det lägsta av marknadsvärde, BRF-justerat värde och din budget.",
      "Bestäm det innan budgivningen – och skriv ner varför.",
    ],
    internalLinks: [
      { href: "/verktyg/maxbud", anchor: "maxbud-kalkylator" },
      { href: "/guider/budstrategi-bostadsratt", anchor: "budstrategi vid bostadsköp" },
      { href: "/guider/pris-per-kvm-bostadsratt", anchor: "pris per kvm" },
      { href: "/guider/analysera-brf-arsredovisning", anchor: "analysera årsredovisning i BRF" },
    ],
    sections: [
      {
        id: "vad-ar-maxbud",
        heading: "Vad är ett maxbud – och vad är det inte?",
        paragraphs: [
          "Maxbudet är din egen gräns. Det är inte det du hoppas få bostaden för, och det är inte samma sak som lånelöftet. Banken säger hur mycket du får låna; maxbudet svarar på vad köpet är värt för dig och vad du klarar att bo i utan att ekonomin blir pressad.",
          "Maxbudet är också något annat än budstrategin. Strategin handlar om hur du lägger buden – öppningsbud, budsteg och tempo – och beskrivs i guiden om [budstrategi vid bostadsköp](/guider/budstrategi-bostadsratt). Maxbudet är siffran strategin vilar på.",
        ],
      },
      {
        id: "steg-1",
        heading: "Steg 1: Vad har liknande bostäder sålts för?",
        paragraphs: [
          "Leta upp slutpriser – inte utgångspriser – för bostäder med samma antal rum, ungefär samma storlek och läge, sålda det senaste året. Räkna om dem till [pris per kvm](/guider/pris-per-kvm-bostadsratt) för att kunna jämföra, och justera för skillnader i våningsplan, balkong, skick och avgift.",
          "Resultatet är ett spann för vad marknaden brukar betala – ditt marknadsvärde. Utgångspriset är ofta satt för att locka budgivare och säger mindre än slutpriserna.",
        ],
      },
      {
        id: "steg-2",
        heading: "Steg 2: Justera för föreningens ekonomi och skick",
        paragraphs: [
          "Två likadana lägenheter är inte värda lika mycket om föreningarna skiljer sig åt. Ett planerat stambyte utan finansiering, hög skuld per kvm, lågt sparande eller en avgift som troligen måste höjas betyder kostnader du tar över. Låt dem sänka ditt värde med en konkret summa.",
          "Omvänt kan ett nyss genomfört och finansierat stambyte eller en stark förening motivera att du ligger i den övre delen av spannet. Hur du läser av detta går vi igenom i [Analysera årsredovisning i BRF](/guider/analysera-brf-arsredovisning).",
        ],
        bullets: [
          "Skuld per kvm och räntekänslighet",
          "Sparande per kvm och kassa",
          "Stora projekt i underhållsplanen och hur de finansieras",
          "Avgiftens nivå och historik – se [för låg avgift i bostadsrätt](/guider/for-lag-avgift-bostadsratt)",
        ],
      },
      {
        id: "steg-3",
        heading: "Steg 3: Vad klarar din månadsbudget?",
        paragraphs: [
          "Räkna fram hela boendekostnaden: ränta, amortering, avgift och drift. Räkna med en ränta som är högre än dagens och med att avgiften kan höjas. Om marginalen redan är tunn vid dagens nivåer är beloppet för högt.",
          "Tänk också på kontantinsatsen och bankens krav på amortering och belåningsgrad. [Maxbud-kalkylatorn](/verktyg/maxbud) ger en snabb uppskattning utifrån kontantinsats, ränta och månadskostnad.",
        ],
      },
      {
        id: "steg-4",
        heading: "Steg 4: Välj det lägsta beloppet – och skriv ner det",
        paragraphs: [
          "Nu har du tre belopp: marknadsvärdet, det BRF-justerade värdet och det din budget klarar. Ditt maxbud är det lägsta av dem. Skriv ner beloppet och varför du landade där – det gör det mycket lättare att hålla gränsen när budgivningen drar iväg.",
        ],
        callout: {
          type: "remember",
          text: "Maxbudet är ett löfte till dig själv, inte ett mål att nå. Att sluta vid gränsen är att följa planen, inte att förlora.",
        },
      },
      {
        id: "exempel",
        heading: "Räkneexempel",
        paragraphs: [
          "Exemplet är påhittat och förenklat, men visar hur stegen fungerar. En tvåa på 60 kvm har utgångspris 4 400 000 kr. Liknande tvåor i området har sålts för 75 000–80 000 kr per kvm, alltså ungefär 4 500 000–4 800 000 kr. Det är marknadsvärdet.",
          "Föreningen planerar stambyte om tre år och har inte sparat till det. Du bedömer att det motsvarar ungefär 100 000 kr i framtida kostnader för lägenheten, och sänker därför det övre värdet till 4 700 000 kr.",
          "Din egen kalkyl, med marginal för högre ränta och avgift, visar att du klarar ett köp på upp till 4 650 000 kr. Maxbudet blir därför 4 650 000 kr – budgeten är den lägsta av de tre siffrorna.",
        ],
      },
      {
        id: "hall-fast",
        heading: "Håll fast vid maxbudet",
        paragraphs: [
          "Om budgivningen passerar ditt maxbud är det information om att någon annan värderar bostaden högre – inte ett misstag från din sida. Att höja gränsen i stunden för att inte missa är det vanligaste misstaget.",
          "Det enda goda skälet att ompröva maxbudet är ny information om bostaden eller föreningen. Gör det i så fall medvetet, inte mitt i ett budsteg.",
        ],
      },
    ],
    faq: [
      {
        q: "Vad är ett rimligt maxbud för bostadsrätt?",
        a: "Det lägsta av tre belopp: vad liknande bostäder sålts för, vad föreningens ekonomi och bostadens skick motiverar, och vad din månadsbudget klarar med marginal.",
      },
      {
        q: "Hur sätter man maxbud?",
        a: "Ta fram slutpriser för jämförbara bostäder, justera för föreningens ekonomi, räkna din månadskostnad med marginal och välj det lägsta beloppet. Gör det innan budgivningen börjar.",
      },
      {
        q: "Kan lånelöftet vara mitt maxbud?",
        a: "Nej. Lånelöftet visar hur mycket banken är beredd att låna ut, inte vad bostaden är värd eller vad du bekvämt klarar varje månad.",
      },
      {
        q: "Ska man berätta sitt maxbud för mäklaren?",
        a: "Nej. Mäklaren arbetar för säljaren. Att avslöja ditt maxbud ger dig ingen fördel.",
      },
    ],
    relatedSlugs: [
      "budstrategi-bostadsratt",
      "hur-mycket-ska-man-buda-over-utgangspris",
      "pris-per-kvm-bostadsratt",
    ],
    relatedToolSlugs: ["maxbud", "boendekostnad"],
    updated: "2026-09-29",
    cta: {
      title: "Få ett rekommenderat budtak för ditt objekt",
      text: "Klistra in länken från mäklarens hemsida så räknar vi fram rimligt värde, budtak och walk-away utifrån objektet och föreningens ekonomi. Just nu gratis under betan.",
    },
  },
  {
    slug: "budstrategi-bostadsratt",
    title: "Budstrategi vid bostadsköp – så lägger du bud och håller din gräns",
    metaTitle: "Budstrategi vid bostadsköp – öppningsbud, budsteg och maxbud | skajagbuda.se",
    metaDescription:
      "En budstrategi i fyra delar: maxbud innan budgivningen, ett genomtänkt öppningsbud, planerade budsteg och en tydlig punkt där du slutar. Plus vanliga taktiker och misstag.",
    intro:
      "En bra budstrategi bestäms innan budgivningen börjar: du vet ditt maxbud, hur du öppnar, hur mycket du höjer åt gången och när du slutar. Budgivningen är byggd för att få dig att agera snabbt – med en plan fattar du besluten i lugn och ro i stället för i stunden. Målet är inte att vinna till varje pris, utan att inte betala mer än bostaden är värd för dig.",
    quickAnswer: [
      "Bestäm ditt maxbud innan första budet – utifrån slutpriser, föreningens ekonomi och din månadskostnad.",
      "Öppna med ett seriöst bud, men aldrig med ditt maxbud.",
      "Höj i planerade steg och ta tid att tänka mellan buden.",
      "Sluta när du når maxbudet – att förlora en budgivning är inte ett misslyckande.",
      "Kom ihåg att inget är bindande förrän köpekontraktet är undertecknat.",
    ],
    internalLinks: [
      { href: "/guider/vad-ar-rimligt-maxbud", anchor: "vad är ett rimligt maxbud" },
      { href: "/verktyg/maxbud", anchor: "maxbud-kalkylator" },
      { href: "/guider/hur-mycket-ska-man-buda-over-utgangspris", anchor: "hur mycket över utgångspris" },
      { href: "/guider/pris-per-kvm-bostadsratt", anchor: "pris per kvm" },
    ],
    sections: [
      {
        id: "sa-fungerar",
        heading: "Så fungerar en budgivning",
        paragraphs: [
          "Budgivningen sköts av mäklaren, som tar emot buden och meddelar övriga spekulanter. Säljaren bestämmer själv vem hen säljer till och när – det behöver inte vara den som lagt högst bud, och säljaren kan avbryta försäljningen.",
          "Ett bud är inte juridiskt bindande, varken för dig eller säljaren. Affären blir bindande först när ni skrivit under köpekontraktet. Mäklaren ska föra en lista över buden och lämna den till både köpare och säljare när affären är klar.",
          "Det gör att budgivningen bygger på förtroende och tempo snarare än på regler. Lägg därför bara bud du står för – men låt inte tempot bestämma beloppen.",
        ],
      },
      {
        id: "fore-budgivningen",
        heading: "Före budgivningen: det här ska vara klart",
        paragraphs: [
          "Det mesta av strategin görs innan första budet. Har du inte gjort det här blir du reaktiv och följer andras bud i stället för din plan.",
        ],
        bullets: [
          "Ett [rimligt maxbud](/guider/vad-ar-rimligt-maxbud) utifrån slutpriser, föreningens ekonomi och din boendekostnad.",
          "Lånelöfte som täcker maxbudet – och en egen kalkyl med marginal för högre ränta och avgift.",
          "Genomläst årsredovisning och underhållsplan. Se [Analysera årsredovisning i BRF](/guider/analysera-brf-arsredovisning).",
          "Frågor till mäklaren om budläge, villkor och föreningen – se [frågor att ställa mäklaren](/guider/vad-ska-man-fraga-maklaren-innan-bud).",
          "Ett beslut om hur stora budsteg du tänker lägga och var du slutar.",
        ],
      },
      {
        id: "oppningsbud",
        heading: "Öppningsbudet: seriöst, men inte ditt max",
        paragraphs: [
          "Öppningsbudet ska visa att du är en seriös köpare. Ett bud nära utgångspriset, eller i nedre delen av vad jämförbara bostäder sålts för, brukar fungera. Ett bud långt under utgångspriset kan göra att säljaren prioriterar andra spekulanter.",
          "Öppna aldrig med ditt maxbud. Då har du inget utrymme kvar, och du signalerar att du är slutbudad. Tänk också på att [utgångspriset](/guider/hur-mycket-ska-man-buda-over-utgangspris) inte säger vad bostaden kommer att säljas för – slutpriser för liknande objekt gör det.",
        ],
      },
      {
        id: "budsteg",
        heading: "Budsteg och tempo",
        paragraphs: [
          "Hur stora budstegen är beror på prisnivån och hur många som budar. I en livlig budgivning är steg om några tiotusentals kronor vanliga; när det bara är två kvar blir stegen ofta mindre. Bestäm i förväg hur du höjer, så att du inte bränner av marginalen i början.",
          "Du behöver inte svara direkt när någon annan budar. Ta den tid du behöver för att se om nästa bud fortfarande ryms inom din plan. Några minuter spelar sällan roll – ett felaktigt belopp gör det.",
        ],
      },
      {
        id: "taktiker",
        heading: "Vanliga budtaktiker – och när de fungerar",
        paragraphs: [
          "Taktiker kan hjälpa i rätt läge, men ingen av dem ersätter ett genomtänkt maxbud.",
        ],
        bullets: [
          "Ett större hopp: ett tydligt högre bud kan få andra budgivare att ge upp. Fungerar bäst när du fortfarande har marginal kvar under ditt maxbud.",
          "Små, snabba steg: kan hålla budgivningen igång utan att du betalar mer än nödvändigt, men kan också driva upp priset i onödan.",
          "Vänta in: att inte svara direkt ger dig tid att tänka och visar att du inte agerar på impuls.",
          "Bud före visning eller med kort svarstid: kan ibland få säljaren att avsluta tidigt, men kräver att du redan har gått igenom föreningen och ditt maxbud.",
          "Villkorade bud, till exempel med förbehåll för besiktning eller lån: minskar din risk men kan göra budet mindre attraktivt för säljaren.",
        ],
      },
      {
        id: "sluta-buda",
        heading: "När ska du sluta buda?",
        paragraphs: [
          "När du når ditt maxbud. Det är hela poängen med att ha ett. Att lägga ett sista bud över gränsen utan ny information är det vanligaste misstaget i budgivningar.",
          "Det kan finnas skäl att ompröva gränsen – till exempel om du fått ny information om föreningens ekonomi eller om ett avgörande fel – men gör det medvetet och i lugn och ro, inte mitt i ett budsteg. Förlorar du budgivningen vet du att någon annan värderade bostaden högre, inte att du gjorde fel.",
        ],
        callout: {
          type: "remember",
          text: "Budstrategi handlar om disciplin, inte om psykologiska trick. Den viktigaste siffran är den du bestämt innan budgivningen började.",
        },
      },
      {
        id: "efter",
        heading: "Efter accepterat bud",
        paragraphs: [
          "När säljaren accepterat ditt bud är affären inte klar förrän köpekontraktet är undertecknat. Läs kontraktet noga innan du skriver under: tillträdesdag, handpenning och eventuella villkor, till exempel om besiktning.",
          "Om du förlorade: använd det du lärt dig om prisnivån till nästa objekt. Varje budgivning ger information om marknaden.",
        ],
      },
      {
        id: "misstag",
        heading: "Vanliga misstag i budgivningen",
        paragraphs: ["De flesta dyra misstag görs under tidspress."],
        bullets: [
          "Att bestämma maxbudet under budgivningen i stället för innan.",
          "Att låta lånelöftet bli maxbudet – banken säger vad du får låna, inte vad köpet är värt.",
          "Att jämföra med utgångspriset i stället för med slutpriser och [pris per kvm](/guider/pris-per-kvm-bostadsratt) för liknande bostäder.",
          "Att hoppa över årsredovisningen för att budgivningen går fort.",
          "Att höja maxbudet för att inte förlora mot en annan budgivare.",
        ],
      },
    ],
    faq: [
      {
        q: "Är ett bud på en bostad bindande?",
        a: "Nej. Varken köpare eller säljare är bundna av bud. Affären blir bindande först när köpekontraktet är undertecknat av båda.",
      },
      {
        q: "Hur mycket ska man höja i en budgivning?",
        a: "Det beror på prisnivå och antal budgivare. Bestäm stegen i förväg och låt dem rymmas inom ditt maxbud, så att du inte bränner marginalen tidigt.",
      },
      {
        q: "Måste säljaren välja det högsta budet?",
        a: "Nej. Säljaren väljer själv köpare och kan till exempel prioritera en köpare med färre villkor eller en viss tillträdesdag.",
      },
      {
        q: "Ska man lägga bud före visning?",
        a: "Bara om du redan har kontrollerat föreningens ekonomi och bestämt ditt maxbud. Annars riskerar du att binda upp dig känslomässigt vid ett pris du inte har underlag för.",
      },
    ],
    relatedSlugs: [
      "vad-ar-rimligt-maxbud",
      "hur-mycket-ska-man-buda-over-utgangspris",
      "budgivning-stockholm",
      "checklista-innan-budgivning",
    ],
    relatedToolSlugs: ["maxbud"],
    sources: [
      {
        label: "Konsumentverket – budgivning vid köp av bostad",
        href: "https://www.konsumentverket.se/varor-och-tjanster/budgivning-vid-kop-av-bostad/",
      },
    ],
    updated: "2026-09-29",
    cta: {
      title: "Se vad du borde buda på just det här objektet",
      text: "Klistra in länken från mäklarens hemsida så får du ett rimligt värde, ett rekommenderat budtak och en walk-away-nivå utifrån objektet och föreningens ekonomi. Just nu gratis under betan.",
    },
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
    title: "Analysera årsredovisning i BRF – så bedömer du föreningens ekonomi",
    metaTitle: "Analysera årsredovisning BRF – så bedömer du ekonomin | skajagbuda.se",
    metaDescription:
      "Så läser du en BRF:s årsredovisning innan köp: skuld per kvm, räntekänslighet, sparande, avgift, kassa och underhållsplan – med varningssignaler och checklista.",
    intro:
      "Årsredovisningen är det bästa underlaget du har för att bedöma en bostadsrättsförenings ekonomi innan du budar. Börja med de sju nyckeltal som alla föreningar numera måste redovisa, läs dem över flera år och koppla dem till underhållsplanen och föreningens lån. Ingen enskild siffra avgör om ekonomin är bra – det är helheten och trenden som gör det.",
    quickAnswer: [
      "Läs de senaste två–tre årsredovisningarna och jämför nyckeltalen över tid.",
      "Skuld per kvm och räntekänslighet visar hur sårbar avgiften är för räntor.",
      "Sparande per kvm säger mer än årets resultat, som ofta är negativt på grund av avskrivningar.",
      "Koppla stora planerade projekt i underhållsplanen till kassa, lån och sparande.",
      "Saknas svar på något av detta – fråga mäklaren eller styrelsen innan du budar.",
    ],
    internalLinks: [
      { href: "/guider/kassa-i-bostadsrattsforening", anchor: "kassa i bostadsrättsförening" },
      { href: "/ordlista/renoveringsfond", anchor: "renoveringsfond i BRF" },
      { href: "/guider/for-lag-avgift-bostadsratt", anchor: "för låg avgift i bostadsrätt" },
      { href: "/guider/vad-ar-hog-skuld-per-kvm-brf", anchor: "hög skuld per kvm i BRF" },
      { href: "/guider/underhallsplan-brf", anchor: "underhållsplan i BRF" },
    ],
    sections: [
      {
        id: "god-ekonomi",
        heading: "Hur vet man om en bostadsrättsförening har god ekonomi?",
        paragraphs: [
          "En förening med god ekonomi har en skuldsättning den klarar även om räntorna stiger, sparar tillräckligt till kommande underhåll, har pengar eller lånemöjligheter för det som planeras och en avgift som täcker kostnaderna utan att hållas konstlat låg. Du hittar underlaget för allt det i årsredovisningen.",
          "Det finns ingen enskild siffra som avgör saken. En hög skuld kan vara rimlig i en nybyggd förening som knappt behöver underhåll, medan en låg skuld kan vara ett problem om huset står inför ett stambyte som ingen sparat till. Titta därför på nyckeltalen tillsammans – och på hur de har utvecklats.",
        ],
        bullets: [
          "Skulden per kvm är stabil eller minskar, och föreningen amorterar.",
          "Räntekänsligheten är måttlig – en räntehöjning kräver ingen dramatisk avgiftshöjning.",
          "Föreningen sparar till underhåll varje år (sparande per kvm är positivt).",
          "Underhållsplanen är aktuell och stora projekt har en finansieringsplan.",
          "Avgiften har höjts i jämn takt snarare än i plötsliga språng.",
        ],
      },
      {
        id: "var-hittar-du",
        heading: "Var hittar du årsredovisningen och vad innehåller den?",
        paragraphs: [
          "Be mäklaren om de senaste årsredovisningarna – de ingår normalt i objektsbeskrivningen. Du kan också fråga föreningens styrelse; många föreningar publicerar dem på sin webbplats. Årsredovisningen är föreningens bokslut för räkenskapsåret, fastställd på föreningsstämman.",
          "Läs gärna i den här ordningen: förvaltningsberättelsen (med flerårsöversikt och nyckeltal), resultaträkningen, balansräkningen och noterna. I noterna står detaljerna om lånen, fastighetens värde och fonderna – det är ofta där de viktigaste uppgifterna finns.",
        ],
        bullets: [
          "Förvaltningsberättelse: årets händelser, genomfört och planerat underhåll, avgiftsändringar och nyckeltal för flera år.",
          "Resultaträkning: intäkter (främst årsavgifter) och kostnader, inklusive räntor och avskrivningar.",
          "Balansräkning: fastigheten, kassa och bank, eget kapital (där fonden för yttre underhåll ingår) och skulder.",
          "Noter: lånens räntor och villkorsändringsdagar, underhållsfond, eventuella tvister och händelser efter årets slut.",
        ],
      },
      {
        id: "nyckeltal",
        heading: "Börja med de sju obligatoriska nyckeltalen",
        paragraphs: [
          "Sedan räkenskapsåret 2023 ska alla bostadsrättsföreningar redovisa samma sju nyckeltal, beräknade på samma sätt enligt årsredovisningslagen och Bokföringsnämndens regler. Det gör det betydligt lättare att jämföra föreningar och år. Nyckeltalen står i förvaltningsberättelsen, ofta i en flerårsöversikt.",
        ],
        bullets: [
          "Årsavgift per kvm upplåten med bostadsrätt – vad medlemmarna i snitt betalar per kvadratmeter och år.",
          "Årsavgifternas andel av totala rörelseintäkter – hur beroende föreningen är av avgifterna jämfört med t.ex. hyror från lokaler.",
          "Skuldsättning per kvm – föreningens räntebärande skulder delat med hela fastighetens yta.",
          "Skuldsättning per kvm upplåten med bostadsrätt – samma skuld fördelad på bostadsrättsytan, alltså det som bärs av medlemmarna.",
          "Sparande per kvm – hur mycket föreningen sparar till framtida underhåll och amortering.",
          "Räntekänslighet – hur mycket avgifterna skulle behöva höjas om räntan steg med en procentenhet.",
          "Energikostnad per kvm – kostnader för värme, el och vatten.",
        ],
        callout: {
          type: "tip",
          text: "Äldre årsredovisningar (före 2023) saknar ofta dessa nyckeltal eller räknar dem på olika sätt. Jämför därför helst nyckeltal från 2023 och framåt med varandra.",
        },
      },
      {
        id: "skuld-per-kvm",
        heading: "Skuld per kvm: vad siffran säger – och inte säger",
        paragraphs: [
          "[Skuld per kvm](/ordlista/skuld-per-kvm) visar hur stora lån föreningen har i förhållande till ytan. Titta särskilt på skulden per kvm upplåten med bostadsrätt, eftersom det är den som i praktiken bärs av medlemmarnas avgifter.",
          "Siffran behöver sättas i sammanhang: byggår, genomförda renoveringar, om föreningen äger marken eller har tomträtt och vad som väntar i underhållsplanen. En förening som nyss lånat till ett stambyte kan ha hög skuld men låg framtida risk – en förening med låg skuld och eftersatt underhåll kan vara tvärtom. Läs mer i guiden om [hög skuld per kvm i BRF](/guider/vad-ar-hog-skuld-per-kvm-brf).",
        ],
      },
      {
        id: "rantekanslighet",
        heading: "Räntekänslighet och lånens villkor",
        paragraphs: [
          "Räntekänsligheten räknas som föreningens räntebärande skulder delat med årsavgifterna. Är den till exempel 10 procent innebär det att avgifterna skulle behöva höjas med ungefär 10 procent om föreningens genomsnittsränta steg med en procentenhet – allt annat lika.",
          "Läs också noten om fastighetslån: vilken ränta lånen har och när de ska villkorsändras eller omsättas. Om en stor del av lånen ska omförhandlas under det närmaste året påverkar nästa ränteläge avgiften snabbt. Lån som förfaller inom tolv månader redovisas ofta som kortfristiga skulder, vilket kan få likviditeten att se svagare ut än den är – det är en omsättning av lån, inte nödvändigtvis ett problem.",
          "Se också om föreningen amorterar. Stadiga amorteringar minskar räntekänsligheten över tid; en förening som aldrig amorterar skjuter skulden framåt till framtida medlemmar. Mer om detta i [belåning i BRF](/ordlista/belaning-brf).",
        ],
      },
      {
        id: "avgift",
        heading: "Årsavgift per kvm och avgiftens utveckling",
        paragraphs: [
          "Jämför årsavgiften per kvm med liknande föreningar i samma område och kontrollera vad som ingår – värme, vatten, bredband eller kabel-tv gör stor skillnad. Titta sedan på historiken i flerårsöversikten: har avgiften höjts i jämn takt, stått still länge eller höjts kraftigt på en gång?",
          "En låg avgift är inte automatiskt bra. Hålls den nere genom att föreningen skjuter upp underhåll eller inte sparar, kommer kostnaden senare – ofta som en kraftig höjning. Läs mer om [för låg avgift i bostadsrätt](/guider/for-lag-avgift-bostadsratt) och om vad en [avgiftshöjning i BRF](/guider/avgiftshojning-brf) betyder för dig.",
        ],
      },
      {
        id: "resultat-sparande",
        heading: "Resultat, sparande och kassaflöde",
        paragraphs: [
          "Många bostadsrättsföreningar redovisar ett negativt resultat år efter år, och det behöver inte vara ett problem. Avskrivningar på byggnaden är en stor kostnad i resultaträkningen men inga pengar som lämnar föreningen. Därför är resultatet ett dåligt mått på om föreningen klarar sig.",
          "Titta i stället på sparande per kvm och, om det finns, kassaflödesanalysen. Frågan är enkel: går föreningens löpande verksamhet ihop med pengar över till amortering och framtida underhåll? Ett sparande som är lågt eller negativt flera år i rad betyder att någon – ofta framtida medlemmar – får betala senare.",
        ],
      },
      {
        id: "kassa-fonder",
        heading: "Kassa, likviditet och underhållsfond",
        paragraphs: [
          "Kassan visar vilken buffert föreningen har för oväntade kostnader. Läs den tillsammans med kommande underhåll och lånens förfallodagar – en stor kassa kan vara öronmärkt för ett projekt som redan är beslutat. Mer i guiden [kassa i bostadsrättsförening](/guider/kassa-i-bostadsrattsforening).",
          "Fonden för yttre underhåll – ofta kallad [renoveringsfond](/ordlista/renoveringsfond) – är en post i det egna kapitalet, inte ett bankkonto. En stor fond betyder alltså inte automatiskt att pengarna finns på banken. Kontrollera de faktiska likvida medlen i balansräkningen och nyckeltal som [kassalikviditet](/ordlista/kassalikviditet) och [soliditet](/ordlista/soliditet).",
        ],
      },
      {
        id: "underhall",
        heading: "Underhållsplan och kommande stora projekt",
        paragraphs: [
          "Årsredovisningen berättar vad som har hänt; [underhållsplanen](/guider/underhallsplan-brf) berättar vad som väntar. Be om den och jämför: vilka stora åtgärder ligger de närmaste fem–tio åren, vad beräknas de kosta och hur ska de finansieras – med sparade medel, nya lån eller höjd avgift?",
          "Var extra uppmärksam på stambyte, tak, fasad, fönster och hissar i äldre hus. Ett planerat [stambyte](/guider/stambyte-bostadsratt-risk) utan finansieringsplan är en av de vanligaste orsakerna till kraftiga avgiftshöjningar eller [kapitaltillskott](/ordlista/kapitaltillskott).",
        ],
        callout: {
          type: "red-flag",
          text: "Stort planerat underhåll + lågt sparande + lite i kassan är den kombination som oftast leder till kraftigt höjd avgift inom några år.",
        },
      },
      {
        id: "lokaler-tomtratt",
        heading: "Lokaler, tomträtt och andra poster som kan ändras",
        paragraphs: [
          "Intäkter från lokaler kan hålla nere avgiften, men gör föreningen beroende av hyresgästerna. Andelen årsavgifter av de totala intäkterna visar hur stort beroendet är. Läs mer om [lokalfastigheter i BRF](/guider/lokalfastigheter-brf-risk).",
          "Har föreningen [tomträtt](/guider/tomtratt-bostadsratt) betalar den en avgäld till kommunen som omprövas med jämna mellanrum, ofta vart tionde eller tjugonde år. Kontrollera när nästa omprövning sker och vad avgälden är i dag.",
        ],
      },
      {
        id: "varningssignaler",
        heading: "Vanliga varningssignaler i årsredovisningen",
        paragraphs: [
          "Ingen av punkterna nedan betyder automatiskt att du ska avstå – men var och en är ett skäl att fråga mer innan du budar.",
        ],
        bullets: [
          "Sparandet är lågt eller negativt flera år i rad.",
          "Skulden per kvm ökar utan att det finns ett tydligt genomfört projekt bakom.",
          "Hög räntekänslighet i kombination med att stora lån ska omsättas snart.",
          "Stora projekt i underhållsplanen utan beslutad finansiering.",
          "Underhållsplanen saknas eller har inte uppdaterats på länge.",
          "Avgiften har legat still länge och sedan höjts kraftigt – eller sänkts nära en försäljning.",
          "Stort beroende av en enskild lokalhyresgäst, eller en tomträttsavgäld som snart omprövas.",
          "Revisorn har en anmärkning, eller noterna nämner tvister och oklara fordringar.",
        ],
      },
      {
        id: "checklista",
        heading: "Checklista: kontrollera BRF innan köp",
        paragraphs: [
          "Använd listan när du har årsredovisningen framför dig. Hittar du inte svaret – be mäklaren eller styrelsen om det skriftligt innan du lägger bud. Fler punkter om själva budgivningen finns i [checklistan inför budgivning](/guider/checklista-innan-budgivning).",
        ],
        bullets: [
          "Har jag läst minst två–tre årsredovisningar och jämfört nyckeltalen?",
          "Hur har skuld per kvm och räntekänslighet utvecklats?",
          "När ska lånen villkorsändras, och till vilken ränta ligger de i dag?",
          "Är sparandet per kvm positivt och stabilt?",
          "Vad säger underhållsplanen om de närmaste fem–tio åren, och hur finansieras det?",
          "Hur har avgiften utvecklats, och finns beslutade eller planerade höjningar?",
          "Finns tomträtt, stora lokaler eller andra särskilda risker?",
          "Hur påverkar allt detta min månadskostnad och mitt [rimliga maxbud](/guider/vad-ar-rimligt-maxbud)?",
        ],
      },
    ],
    faq: [
      {
        q: "Hur vet man om en bostadsrättsförening har god ekonomi?",
        a: "Titta på helheten i årsredovisningen: en skuld som föreningen klarar även vid högre räntor, ett positivt sparande till underhåll, en aktuell underhållsplan med finansiering och en avgift som höjts i jämn takt. Ingen enskild siffra räcker.",
      },
      {
        q: "Vilken skuld per kvm är bra?",
        a: "Det finns ingen gräns som gäller alla föreningar. Samma skuld kan vara rimlig i ett nybyggt hus och riskabel i ett äldre hus som står inför stora renoveringar. Jämför med liknande föreningar och se hur skulden utvecklas över tid.",
      },
      {
        q: "Varför går föreningen med förlust?",
        a: "Ofta beror det på avskrivningar, som är en bokföringsmässig kostnad och inte pengar som lämnar föreningen. Titta på sparande per kvm och kassaflödet för att se om föreningen faktiskt går ihop.",
      },
      {
        q: "Räcker det att läsa en årsredovisning?",
        a: "Nej. Läs två–tre år för att se trender – ett enskilt år kan påverkas av en engångshändelse.",
      },
      {
        q: "Vad är skillnaden mellan årsredovisning och bokslut i en BRF?",
        a: "Bokslutet är avslutningen av räkenskapsåret. Årsredovisningen är dokumentet där bokslutet presenteras, tillsammans med förvaltningsberättelse, nyckeltal och noter – det är den du ska läsa som köpare.",
      },
    ],
    relatedSlugs: [
      "kassa-i-bostadsrattsforening",
      "vad-ar-hog-skuld-per-kvm-brf",
      "underhallsplan-brf",
      "for-lag-avgift-bostadsratt",
    ],
    relatedToolSlugs: ["brf-skuld-per-kvm"],
    sources: [
      {
        label: "Bokföringsnämnden – vägledning om årsredovisning för bostadsrättsföreningar",
        href: "https://www.bfn.se/wp-content/uploads/vl23-1-brf.pdf",
      },
      {
        label: "Riksbyggen – sju nyckeltal för bostadsrättsföreningen",
        href: "https://www.riksbyggen.se/kunskapsbanken/lagar-och-regler/sju-nyckeltal/",
      },
    ],
    updated: "2026-09-29",
    cta: {
      title: "Låt oss läsa årsredovisningen med dig",
      text: "Klistra in länken från mäklarens hemsida – vi hämtar årsredovisningen om den finns där – eller ladda upp PDF:en i nästa steg. Du får en genomgång av föreningens ekonomi, risker och ett rimligt budintervall. Just nu gratis under betan.",
    },
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
          "[Skuld per kvm](/ordlista/skuld-per-kvm) är föreningens räntebärande skulder dividerat med ytan. Sedan räkenskapsåret 2023 redovisar alla föreningar två varianter: skuldsättning per kvm för hela fastigheten och per kvm upplåten med bostadsrätt – den senare visar vad som bärs av medlemmarnas avgifter.",
          "Siffran säger inget om lägenhetens skick men mycket om föreningens finansiella utrymme framåt.",
        ],
      },
      {
        id: "jamforelse",
        heading: "Hur jämför du med andra föreningar?",
        paragraphs: [
          "Jämför med föreningar i samma område och ungefär samma byggår. Nyare hus har ofta högre skuld efter nyproduktion; äldre kan ha lägre skuld eller stora kommande lån för renovering.",
          "En skuld på 8 000 kr/kvm kan vara normal i ett nybyggt område men hög i en äldre förening utan planerade investeringar. Läs skulden tillsammans med räntekänsligheten och sparandet – hur du gör det beskrivs i [Analysera årsredovisning i BRF](/guider/analysera-brf-arsredovisning).",
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
          "Jämför avgiften per kvm över minst fem år. Löpande höjningar i takt med kostnaderna är normalt; det som bör få dig att fråga mer är återkommande kraftiga höjningar utan förklaring, eller en avgift som stått still länge och sedan höjts mycket på en gång.",
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
      "Underhållsplanen är föreningens karta över framtida renoveringar och reparationer: vad som behöver göras, när och ungefär vad det kostar. Som köpare använder du den för att se vilka stora kostnader som väntar och om föreningen har en plan för att betala dem. Utan en aktuell plan vet föreningen inte vad som behöver göras – och du vet inte vad du kan få betala för.",
    quickAnswer: [
      "Be mäklaren eller styrelsen om underhållsplanen – den ingår sällan i annonsen.",
      "Titta på de närmaste fem–tio åren: stambyte, tak, fasad, fönster och hissar.",
      "Kontrollera hur de stora projekten ska finansieras: sparande, lån eller höjd avgift.",
      "Jämför med årsredovisningens sparande, kassa och fond för yttre underhåll.",
    ],
    internalLinks: [
      { href: "/guider/analysera-brf-arsredovisning", anchor: "analysera årsredovisning i BRF" },
      { href: "/ordlista/renoveringsfond", anchor: "renoveringsfond i BRF" },
      { href: "/guider/stambyte-bostadsratt-risk", anchor: "stambyte i bostadsrätt" },
    ],
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
          "Stora planerade åtgärder utan buffert i kassan leder nästan alltid till lån eller kapitaltillskott – och högre avgift.",
          "Läs planen tillsammans med skuld per kvm, [kassan](/guider/kassa-i-bostadsrattsforening) och avsättningen till [renoveringsfonden](/ordlista/renoveringsfond) för att få helheten. Hur du hittar siffrorna beskrivs i [Analysera årsredovisning i BRF](/guider/analysera-brf-arsredovisning).",
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
      "Hur mycket pengar bör en BRF ha i kassan? Så läser du kassa och likviditet i årsredovisningen, varför fonden inte är pengar på banken och när en låg kassa är en risk.",
    intro:
      "Kassan visar om föreningen har pengar att ta av när något går sönder – utan att höja avgiften eller ta nya lån direkt. Det finns ingen fast siffra för hur mycket som räcker: kassan ska bedömas mot föreningens storlek, kommande underhåll och när lånen ska omsättas. En stark årsredovisning kan ändå vara riskfylld om kassan är tom och stora projekt väntar.",
    quickAnswer: [
      "Kassa och bank hittar du i balansräkningen, under omsättningstillgångar.",
      "Det finns ingen fast gräns – jämför kassan med underhållsplanen och årsavgifterna.",
      "Fonden för yttre underhåll är inte pengar på banken, bara en post i eget kapital.",
      "Låg kassalikviditet kan bero på lån som ska omsättas inom ett år – kontrollera noterna.",
      "Tom kassa + planerat stambyte = hög risk för avgiftshöjning eller kapitaltillskott.",
    ],
    internalLinks: [
      { href: "/guider/analysera-brf-arsredovisning", anchor: "analysera årsredovisning i BRF" },
      { href: "/ordlista/renoveringsfond", anchor: "renoveringsfond i BRF" },
      { href: "/ordlista/kassalikviditet", anchor: "kassalikviditet" },
      { href: "/guider/underhallsplan-brf", anchor: "underhållsplan i BRF" },
    ],
    sections: [
      {
        id: "vad-ar-kassa",
        heading: "Vad menas med kassa i BRF?",
        paragraphs: [
          "Kassa och bankmedel i årsredovisningen visar föreningens likvida medel. Det inkluderar inte fastighetens värde – bara pengar som kan användas direkt.",
          "Jämför kassan med planerade utgifter i [underhållsplanen](/guider/underhallsplan-brf) för att se om bufferten räcker.",
        ],
      },
      {
        id: "hur-mycket",
        heading: "Hur mycket är tillräckligt?",
        paragraphs: [
          "Det finns ingen fast regel, men en förening bör ha buffert för oförutsedda utgifter och pågående underhåll. Om kassan är nära noll samtidigt som stora projekt planeras är risken hög.",
          "Ett enkelt sätt att få perspektiv är att jämföra kassan med föreningens årsavgifter: hur många månaders avgifter motsvarar den? Det är ingen officiell norm, men gör det lättare att jämföra föreningar och se om bufferten krymper år för år.",
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
          "Låg kassa leder ofta till [kapitaltillskott](/ordlista/kapitaltillskott) (engångsbelopp från varje ägare), nya lån eller kraftiga [avgiftshöjningar](/guider/avgiftshojning-brf) vid oförutsedda händelser.",
          "Du som ny ägare kan få en faktura kort efter tillträde om föreningen inte har marginal.",
        ],
        callout:
          "Tom kassa + planerat stambyte = hög risk för plötslig kostnad.",
      },
      {
        id: "kassa-fond-sparande",
        heading: "Kassa, underhållsfond och sparande – tre olika saker",
        paragraphs: [
          "Kassan är de pengar som faktiskt finns. [Renoveringsfonden](/ordlista/renoveringsfond) – fonden för yttre underhåll – är en reservering i föreningens egna kapital och behöver inte motsvaras av pengar på banken. Sparande per kvm är ett nyckeltal som visar hur mycket föreningen lägger undan varje år.",
          "Titta på alla tre. En stor fond med tom kassa betyder att pengarna redan använts, till exempel till amortering. En liten kassa i en förening med stabilt sparande och ett nyss genomfört stambyte kan vara helt rimligt.",
          "Tänk också på att lån som ska omsättas inom tolv månader redovisas som kortfristiga skulder. Det kan få [kassalikviditeten](/ordlista/kassalikviditet) att se mycket låg ut trots att det bara handlar om en planerad omförhandling av lånet.",
        ],
      },
      {
        id: "las-tillsammans",
        heading: "Läs kassa tillsammans med skuld",
        paragraphs: [
          "Hög skuld och låg kassa är en svag kombination. Hög skuld med god kassa och tydlig amorteringsplan kan vara hanterbart. Läs mer om hur du bedömer [skuld per kvm i BRF](/guider/vad-ar-hog-skuld-per-kvm-brf).",
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
      {
        q: "Hur vet man om en bostadsrättsförening har god ekonomi?",
        a: "Kassan är en del av svaret. Läs den tillsammans med skuld per kvm, räntekänslighet, sparande och underhållsplan – se guiden [Analysera årsredovisning i BRF](/guider/analysera-brf-arsredovisning).",
      },
    ],
    relatedSlugs: [
      "analysera-brf-arsredovisning",
      "underhallsplan-brf",
      "avgiftshojning-brf",
    ],
    relatedToolSlugs: ["boendekostnad"],
    updated: "2026-09-29",
  },
  {
    slug: "pris-per-kvm-bostadsratt",
    title: "Pris per kvm – så jämför du bostadspriser rätt",
    metaTitle: "Pris per kvm (kvm-pris) – så jämför du bostadspriser rätt | skajagbuda.se",
    metaDescription:
      "Kvm-priset är köpeskillingen delat med boytan. Så räknar du, jämför slutpriser på rätt sätt, undviker vanliga fällor och använder siffran när du sätter maxbud.",
    intro:
      "Pris per kvm används överallt i bostadsannonser – men siffran säger bara något om du jämför likvärdiga objekt på rätt sätt. Fel jämförelser ger falsk trygghet och kan få dig att betala för mycket. Här är hur du använder måttet utan att bli lurad.",
    sections: [
      {
        id: "vad-sager-siffran",
        heading: "Vad säger pris per kvm?",
        paragraphs: [
          "Pris per kvm är köpeskillingen dividerad med boytan. En lägenhet på 60 kvm som säljs för 4 500 000 kr har alltså ett kvm-pris på 75 000 kr. Det underlättar jämförelse mellan lägenheter av olika storlek i samma område.",
          "Det säger inget om föreningens ekonomi, läge i huset eller skick – bara om prisnivån per ytenhet. Två lägenheter med samma kvm-pris kan vara olika bra köp om den ena föreningen har hög skuld eller ett stambyte framför sig; se [Analysera årsredovisning i BRF](/guider/analysera-brf-arsredovisning).",
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
          "Använd siffran som kontroll – inte som facit på att lägenheten är bra. Multiplicera intervallet med lägenhetens boyta för att få ett marknadsvärde, och använd det som första steg när du sätter ett [rimligt maxbud](/guider/vad-ar-rimligt-maxbud).",
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
      "vad-ar-rimligt-maxbud",
      "budstrategi-bostadsratt",
      "hur-mycket-ska-man-buda-over-utgangspris",
      "kopa-bostadsratt-stockholm",
    ],
    relatedToolSlugs: ["maxbud"],
    updated: "2026-09-29",
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
          "Bestäm [maxbud](/guider/vad-ar-rimligt-maxbud) baserat på slutpriser och BRF-analys innan budgivningen. I Stockholm tenderar känslan att säga 'lite till' vid varje steg – en genomtänkt [budstrategi](/guider/budstrategi-bostadsratt) med planerade budsteg hjälper dig hålla emot.",
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
    title: "För låg avgift i bostadsrätt – fördel eller varningssignal?",
    metaTitle: "För låg avgift i bostadsrätt – fördel eller varningssignal? | skajagbuda.se",
    metaDescription:
      "Låg månadsavgift kan vara ett tecken på god ekonomi – eller på uppskjutet underhåll. Så jämför du avgiften rätt, vilka nyckeltal som avslöjar skillnaden och vad du bör fråga.",
    intro:
      "En låg avgift är bara en fördel om den är låg av rätt skäl: låg skuld, god förvaltning eller intäkter som är stabila. Är den låg för att föreningen inte sparar eller skjuter upp underhåll, flyttas kostnaden till framtiden – och då är det du som ny ägare som betalar. Du avgör skillnaden med några nyckeltal i årsredovisningen och underhållsplanen.",
    quickAnswer: [
      "Jämför årsavgift per kvm med liknande föreningar – och kontrollera vad som ingår.",
      "Titta på sparande per kvm: sparar föreningen till framtida underhåll?",
      "Läs underhållsplanen – stora projekt utan finansiering betyder framtida höjningar.",
      "Se över avgiftshistoriken: har avgiften stått still länge eller sänkts nära en försäljning?",
      "Räkna med en högre avgift i din kalkyl om den låga nivån inte har en tydlig förklaring.",
    ],
    internalLinks: [
      { href: "/guider/analysera-brf-arsredovisning", anchor: "analysera årsredovisning i BRF" },
      { href: "/guider/avgiftshojning-brf", anchor: "avgiftshöjning i BRF" },
      { href: "/ordlista/arsavgift", anchor: "årsavgift" },
      { href: "/verktyg/boendekostnad", anchor: "räkna boendekostnad" },
    ],
    sections: [
      {
        id: "varfor-lag",
        heading: "Varför kan avgiften vara låg?",
        paragraphs: [
          "Det finns både goda och dåliga förklaringar. Din uppgift är att avgöra vilken det är – inte att ta siffran i annonsen för given.",
        ],
        bullets: [
          "Goda skäl: låg skuld, nyligen genomfört och finansierat underhåll, stabila intäkter från lokaler eller effektiv förvaltning.",
          "Tveksamma skäl: föreningen sparar inte till underhåll, skjuter upp nödvändiga åtgärder eller har låga räntor som snart ska omförhandlas.",
          "Tillfälliga skäl: nyproduktion där avgiften är satt lågt de första åren, eller en avgift som hållits oförändrad länge trots stigande kostnader.",
        ],
      },
      {
        id: "jamfor-ratt",
        heading: "Så jämför du avgiften rätt",
        paragraphs: [
          "Använd nyckeltalet årsavgift per kvm upplåten med bostadsrätt, som alla föreningar redovisar i årsredovisningen sedan räkenskapsåret 2023. Jämför med föreningar i samma område med liknande byggår och storlek – inte med snittet för hela staden.",
          "Kontrollera sedan vad som ingår. Värme och vatten ingår ofta, men el, bredband och kabel-tv varierar. En avgift som ser låg ut kan i praktiken vara normal om du själv betalar värmen. Läs mer om vad som brukar ingå i [årsavgiften](/ordlista/arsavgift).",
          "Det finns ingen procentgräns för när en avgift är för låg. En tydlig avvikelse från jämförbara föreningar utan förklaring är däremot skäl att gräva vidare.",
        ],
      },
      {
        id: "nyckeltal",
        heading: "Nyckeltalen som avslöjar om avgiften håller",
        paragraphs: [
          "Avgiften ska täcka föreningens kostnader, räntor och ett sparande till framtida underhåll. Tre nyckeltal visar om den gör det:",
        ],
        bullets: [
          "Sparande per kvm: är det lågt eller negativt flera år i rad räcker avgiften troligen inte på sikt.",
          "Räntekänslighet: visar hur mycket avgiften skulle behöva höjas om räntan steg en procentenhet.",
          "Skuldsättning per kvm upplåten med bostadsrätt: hög skuld och låg avgift är en kombination som ofta leder till höjningar.",
        ],
        callout: {
          type: "tip",
          text: "Hur du hittar och tolkar nyckeltalen går vi igenom steg för steg i guiden Analysera årsredovisning i BRF.",
        },
      },
      {
        id: "uppskjutet-underhall",
        heading: "Tecken på uppskjutet underhåll",
        paragraphs: [
          "En [underhållsplan](/guider/underhallsplan-brf) som är gammal eller saknas, låg kassa, kända skador som inte åtgärdats och stämmoprotokoll där avgiften diskuteras men inte underhållet är typiska tecken.",
          "Mönstret slutar ofta med en kraftig avgiftshöjning eller ett [kapitaltillskott](/ordlista/kapitaltillskott) när underhållet inte längre går att skjuta upp.",
        ],
        callout: {
          type: "red-flag",
          text: "Låg avgift + lågt sparande + stort underhåll inom några år = räkna med höjd avgift.",
        },
      },
      {
        id: "nyproduktion",
        heading: "Nyproduktion och tillfälligt låga avgifter",
        paragraphs: [
          "I nybyggda föreningar sätts avgiften utifrån den ekonomiska planen och kan vara låg de första åren, medan räntor är bundna och underhållsbehovet litet. Läs planens prognos för avgiften kommande år och kontrollera när lånen ska villkorsändras.",
          "Hög skuld per kvm i kombination med låg avgift är en vanlig riskprofil i nyproduktion. Läs mer om [hög skuld per kvm i BRF](/guider/vad-ar-hog-skuld-per-kvm-brf).",
        ],
      },
      {
        id: "rakneexempel",
        heading: "Räkneexempel: vad en höjning betyder för dig",
        paragraphs: [
          "Exemplet är förenklat och bara till för att visa storleksordningen. Anta att avgiften för en lägenhet är 3 000 kr i månaden och föreningen höjer med 15 procent för att komma ikapp med sparandet. Då blir avgiften 3 450 kr – 450 kr mer i månaden och 5 400 kr mer om året, varje år framöver.",
          "Den kostnaden är lika verklig som en högre ränta på ditt bolån. Lägg in en rimlig framtida avgift i din kalkyl – till exempel med [boendekostnadskalkylatorn](/verktyg/boendekostnad) – innan du bestämmer ditt maxbud.",
        ],
      },
      {
        id: "budbeslut",
        heading: "Hur det påverkar ditt bud",
        paragraphs: [
          "Om den låga avgiften har en tydlig och hållbar förklaring är den en fördel och kan motivera ett något högre bud. Om den inte har det, räkna med en högre framtida avgift och låt det sänka ditt [rimliga maxbud](/guider/vad-ar-rimligt-maxbud).",
          "Låt underlaget styra – inte annonsens månadsavgift.",
        ],
      },
    ],
    faq: [
      {
        q: "Hur låg är för låg avgift?",
        a: "Det finns ingen fast gräns. Jämför årsavgift per kvm med liknande föreningar i området och kontrollera vad som ingår. En tydlig avvikelse utan förklaring motiverar extra granskning.",
      },
      {
        q: "Är låg avgift bra när man köper bostadsrätt?",
        a: "Ja, om föreningen ändå sparar till underhåll och har en skuld den klarar. Nej, om avgiften är låg för att underhåll skjuts upp – då kommer höjningen senare.",
      },
      {
        q: "Kan mäklaren garantera att avgiften inte höjs?",
        a: "Nej. Styrelsen beslutar om avgiften. Du behöver läsa historik, nyckeltal och planer själv – eller fråga styrelsen om planerade höjningar.",
      },
    ],
    relatedSlugs: [
      "avgiftshojning-brf",
      "analysera-brf-arsredovisning",
      "underhallsplan-brf",
    ],
    relatedToolSlugs: ["boendekostnad"],
    updated: "2026-09-29",
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
