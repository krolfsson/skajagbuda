import type { GlossaryTerm } from "./types";

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "skuld-per-kvm",
    term: "Skuld per kvm",
    metaTitle: "Skuld per kvm i BRF – vad betyder det? | skajagbuda.se",
    metaDescription:
      "Skuld per kvm visar föreningens totala skuld delat med boytan. Lär dig tolka siffran och vad den säger om framtida avgiftsrisk.",
    definition:
      "Skuld per kvm är föreningens totala räntebärande skuld dividerad med föreningens totala boyta i kvadratmeter. Siffran ger en grov bild av hur mycket belåning som belastar varje kvadratmeter bostadsyta i föreningen.",
    whyItMatters:
      "En hög skuld per kvm innebär att föreningen betalar mer ränta, vilket kan leda till högre avgifter – särskilt när ränteläget stiger. Siffran ensam räcker inte för att bedöma en förening, men den är en viktig startpunkt innan budgivning.",
    checkPoints: [
      "Jämför skulden per kvm med föreningens egen historik – har den ökat kraftigt?",
      "Kontrollera om skulden är kopplad till genomförda renoveringar eller planerade projekt.",
      "Läs noterna i årsredovisningen om lånevillkor och förfallotider.",
      "Sätt siffran i relation till föreningens kassa, intäkter och underhållsplan.",
    ],
    relatedGuideSlugs: [
      "vad-ar-hog-skuld-per-kvm-brf",
      "analysera-brf-arsredovisning",
    ],
    relatedToolSlugs: ["brf-skuld-per-kvm"],
  },
  {
    slug: "arsavgift",
    term: "Årsavgift",
    metaTitle: "Årsavgift i bostadsrätt – vad ingår och varför stiger den? | skajagbuda.se",
    metaDescription:
      "Årsavgiften är din månatliga kostnad till föreningen. Förstå vad den täcker, varför den varierar och hur du bedömer om den är hållbar.",
    definition:
      "Årsavgiften (ofta kallad månadsavgift) är den summa du betalar till bostadsrättsföreningen varje månad. Den finansierar föreningens gemensamma kostnader – drift, underhåll, räntor, försäkring och förvaltning – och fördelas mellan medlemmarna enligt föreningens stadgar.",
    whyItMatters:
      "Avgiften är en central del av din boendekostnad och kan stiga om föreningens skuldräntor ökar, underhåll behövs eller intäkter minskar. En låg avgift idag är inte automatiskt bra om den bygger på uppskjutet underhåll.",
    checkPoints: [
      "Be om avgiftshistorik – hur har avgiften utvecklats de senaste fem till tio åren?",
      "Kontrollera om avgiften inkluderar el, värme, kabel-tv eller bredband.",
      "Jämför med liknande föreningar i samma område, inte bara utgångspriset på lägenheten.",
      "Fråga om planerade avgiftsförändringar eller tillfälliga uttaxeringar.",
    ],
    relatedGuideSlugs: [
      "avgiftshojning-brf",
      "for-lag-avgift-bostadsratt",
      "analysera-brf-arsredovisning",
    ],
    relatedToolSlugs: ["boendekostnad"],
  },
  {
    slug: "underhallsplan",
    term: "Underhållsplan",
    metaTitle: "Vad är en underhållsplan? Förklaring för bostadsköpare | skajagbuda.se",
    metaDescription:
      "En underhållsplan visar vad föreningen planerar renovera och när. Lär dig läsa den och bedöma om planen är realistisk.",
    definition:
      "En underhållsplan är föreningens långsiktiga plan för underhåll och reinvesteringar i fastigheten – tak, fasad, stammar, hissar, gemensamma utrymmen med mera. Den anger typiskt vad som behöver göras, ungefärlig tidpunkt och beräknad kostnad.",
    whyItMatters:
      "Utan en aktuell underhållsplan är det svårt att förutse framtida kostnader och avgiftshöjningar. En plan som inte följs upp kan innebära att stora projekt dyker upp utan förberedelse.",
    checkPoints: [
      "Finns det en skriftlig underhållsplan – och när uppdaterades den senast?",
      "Stämmer planerade projekt med renoveringsfondens storlek?",
      "Har redan genomförda åtgärder dokumenterats och följts upp?",
      "Fråga styrelsen om avvikelser mellan plan och verklighet.",
    ],
    relatedGuideSlugs: [
      "underhallsplan-brf",
      "stambyte-bostadsratt-risk",
      "analysera-brf-arsredovisning",
    ],
  },
  {
    slug: "stambyte",
    term: "Stambyte",
    metaTitle: "Vad är stambyte? Förklaring för bostadsköpare | skajagbuda.se",
    metaDescription:
      "Stambyte innebär utbyte av rör och avlopp i en fastighet. Förstå vad det betyder för dig som köpare och hur föreningen finansierar det.",
    definition:
      "Stambyte är utbyte av stammar – de vatten-, avlopps- och värmrör som går genom fastigheten. I äldre hus behövs det typiskt var 40–50:e år. Arbetet omfattar ofta badrum och kök i berörda lägenheter och kan påverka både avgift och boendekomfort under tiden.",
    whyItMatters:
      "Ett stambyte är ett av de dyraste underhållsprojekten en förening kan genomföra. Om det redan är gjort minskar en viktig risk; om det ligger framför utan finansiering kan det ge höga tillfälliga avgifter eller lån som höjer den ordinarie avgiften.",
    checkPoints: [
      "Har stambytet redan genomförts – och i så fall, när?",
      "Om det planeras: hur ska det finansieras – fond, lån eller tillfällig avgift?",
      "Kontrollera om stambytet omfattar el, ventilation eller bara vatten och avlopp.",
      "Fråga om lägenheten berörs direkt och vilka renoveringskrav som gäller.",
    ],
    relatedGuideSlugs: [
      "stambyte-bostadsratt-risk",
      "underhallsplan-brf",
      "analysera-brf-arsredovisning",
    ],
  },
  {
    slug: "tomtratt",
    term: "Tomträtt",
    metaTitle: "Vad är tomträtt? Förklaring för bostadsköpare | skajagbuda.se",
    metaDescription:
      "Tomträtt innebär att föreningen hyr marken. Lär dig hur tomträttsavtalet påverkar avgift, risk och framtida kostnader.",
    definition:
      "Tomträtt innebär att bostadsrättsföreningen inte äger marken under fastigheten utan innehar den med tomträtt – ett långsiktigt arrendeavtal med markägaren (ofta kommunen). Föreningen betalar en årlig avgäld som finansieras via medlemmarnas avgifter.",
    whyItMatters:
      "Tomträttsavtalets villkor – särskilt hur avgälden indexeras – kan ge stigande avgifter över tid. Vid avtalets slut kan förhandlingar om nytt avtal påverka föreningens ekonomi avsevärt.",
    checkPoints: [
      "Finns det tomträtt – och vem är markägaren?",
      "Hur ser avgälden ut idag och hur har den indexeras historiskt?",
      "När löper avtalet ut och vad säger avtalet om förlängning?",
      "Ingår tomträttskostnaden i den ordinarie avgiften eller redovisas separat?",
    ],
    relatedGuideSlugs: ["tomtratt-bostadsratt", "analysera-brf-arsredovisning"],
  },
  {
    slug: "andrahandsuthyrning",
    term: "Andrahandsuthyrning",
    metaTitle: "Andrahandsuthyrning i bostadsrätt – regler och risker | skajagbuda.se",
    metaDescription:
      "Andrahandsuthyrning regleras av föreningens stadgar och hyresnämnden. Förstå vad som gäller innan du köper eller hyr ut.",
    definition:
      "Andrahandsuthyrning innebär att du hyr ut din bostadsrätt till någon annan medan du behåller bostadsrätten. Föreningen kan enligt bostadsrättslagen neka uthyrning om det finns skälig anledning, och de flesta föreningar har regler i sina stadgar.",
    whyItMatters:
      "Om du planerar att hyra ut – tillfälligt eller långsiktigt – behöver du veta föreningens regler innan köp. Begränsningar kan påverka din flexibilitet. Hög andel andrahandsuthyrning i föreningen kan också påverka trivsel och styrelsearbete.",
    checkPoints: [
      "Läs stadgarnas regler om andrahandsuthyrning – tillåts den och under vilka villkor?",
      "Fråga styrelsen hur många lägenheter som hyrs ut i andra hand.",
      "Kontrollera om föreningen kräver godkännande och tidsbegränsning.",
      "Tänk igenom ditt eget behov av flexibilitet innan köp.",
    ],
    relatedGuideSlugs: ["roda-flaggor-bostadsratt"],
  },
  {
    slug: "lokalintakter",
    term: "Lokalintakter",
    metaTitle: "Lokalintakter i BRF – intäkter, risker och vad du ska kolla | skajagbuda.se",
    metaDescription:
      "Lokalintäkter från butiker och kontor kan stabilisera en förenings ekonomi – eller skapa beroenden. Så bedömer du dem.",
    definition:
      "Lokalintäkter är hyresintäkter som föreningen får från kommersiella lokaler i fastigheten – butiker, kontor, restauranger med mera. Intäkterna går till föreningens gemensamma kostnader och kan sänka bostadsrättsinnehavarnas avgifter.",
    whyItMatters:
      "Lokalintäkter kan vara en stabil intäktskälla, men de skapar också beroende av hyresgästers solvens och konjunktur. Om en stor lokal står tom eller hyresgästen går i konkurs kan avgiften behöva höjas.",
    checkPoints: [
      "Hur stor andel av föreningens intäkter kommer från lokaler?",
      "Vilka typer av hyresgäster finns – och hur långa är kontrakten?",
      "Finns det vakans eller planerade ombyggnationer av lokaler?",
      "Läs noter i årsredovisningen om hyresavtal och eventuella tvister.",
    ],
    relatedGuideSlugs: ["lokalfastigheter-brf-risk", "analysera-brf-arsredovisning"],
  },
  {
    slug: "soliditet",
    term: "Soliditet",
    metaTitle: "Soliditet i bostadsrättsförening – vad siffran betyder | skajagbuda.se",
    metaDescription:
      "Soliditet visar hur stor andel av tillgångarna som finansierats med eget kapital. Lär dig tolka nyckeltalet i årsredovisningen.",
    definition:
      "Soliditet (soliditet i procent) anger hur stor andel av föreningens totala tillgångar som finansierats med eget kapital, det vill säga inte med lån. Formeln är eget kapital dividerat med totala tillgångar, multiplicerat med 100.",
    whyItMatters:
      "En högre soliditet innebär generellt att föreningen har mer ekonomiskt utrymme att hantera oförutsedda kostnader utan att ta nya lån. Låg soliditet i kombination med hög skuld kan vara en varningssignal.",
    checkPoints: [
      "Hitta soliditeten i årsredovisningens nyckeltal – och jämför med föregående år.",
      "Kontrollera om eget kapital minskat på grund av investeringar eller förluster.",
      "Sätt soliditeten i relation till planerade underhållsprojekt.",
      "Läs revisorskommentarer om föreningens ekonomiska ställning.",
    ],
    relatedGuideSlugs: [
      "analysera-brf-arsredovisning",
      "kassa-i-bostadsrattsforening",
    ],
  },
  {
    slug: "kassalikviditet",
    term: "Kassalikviditet",
    metaTitle: "Kassalikviditet i BRF – varför likviditet spelar roll | skajagbuda.se",
    metaDescription:
      "Kassalikviditet visar om föreningen kan betala kortfristiga skulder. Förstå nyckeltalet innan du budar.",
    definition:
      "Kassalikviditet (likviditet i procent) mäter föreningens förmåga att betala sina kortfristiga skulder med omsättningstillgångar. Formeln är omsättningstillgångar dividerat med kortfristiga skulder, multiplicerat med 100. En siffra över 100 procent innebär att tillgångarna täcker skulderna.",
    whyItMatters:
      "Låg kassalikviditet kan innebära att föreningen har svårt att hantera oväntade utgifter utan att ta ny belåning eller höja avgiften. Det är särskilt relevant inför större underhållsprojekt.",
    checkPoints: [
      "Kontrollera kassalikviditeten i årsredovisningen – och trenden över flera år.",
      "Titta på storleken på föreningens kassa och kortfristiga placeringar.",
      "Fråga om planerade utgifter som kan belasta likviditeten kommande år.",
      "Jämför med föreningens underhållsplan och renoveringsfond.",
    ],
    relatedGuideSlugs: ["kassa-i-bostadsrattsforening", "analysera-brf-arsredovisning"],
  },
  {
    slug: "belaning-brf",
    term: "Belåning BRF",
    metaTitle: "Belåning i bostadsrättsförening – lån, ränta och risk | skajagbuda.se",
    metaDescription:
      "Föreningens belåning påverkar din avgift. Lär dig tolka lånen i årsredovisningen och bedöma ränterisken.",
    definition:
      "Belåning i en bostadsrättsförening avser de lån föreningen har tagit för att finansiera fastigheten, renoveringar eller andra investeringar. Räntekostnaderna betalas via medlemmarnas avgifter. Belåningen redovisas i balansräkningen och påverkar nyckeltal som skuld per kvm.",
    whyItMatters:
      "Hög belåning gör föreningen känsligare för ränteförändringar. När räntan stiger kan en betydande del av avgiften gå till räntekostnader istället för underhåll – eller så måste avgiften höjas.",
    checkPoints: [
      "Läs lånenoterna i årsredovisningen – räntesats, bindningstid och förfallodatum.",
      "Kontrollera om lån är bundna eller rörliga.",
      "Fråga om planerade omsättningar av lån och vilken ränteeffekt det kan ge.",
      "Sätt belåningen i relation till föreningens intäkter och kassaflöde.",
    ],
    relatedGuideSlugs: [
      "vad-ar-hog-skuld-per-kvm-brf",
      "avgiftshojning-brf",
      "analysera-brf-arsredovisning",
    ],
    relatedToolSlugs: ["brf-skuld-per-kvm"],
  },
  {
    slug: "driftskostnad",
    term: "Driftskostnad",
    metaTitle: "Driftskostnad i bostadsrätt – vad du betalar utöver avgiften | skajagbuda.se",
    metaDescription:
      "Driftskostnader täcker el, värme och vatten i lägenheten. Förstå vad som ingår i avgiften och vad du betalar separat.",
    definition:
      "Driftskostnader i en bostadsrätt avser de löpande kostnader som uppstår för att driva lägenheten – el, värme, vatten, hemförsäkring och ibland bredband. Vissa kostnader ingår i föreningens avgift (till exempel värme i centralt system), andra betalar du direkt.",
    whyItMatters:
      "Driftskostnaderna kommer ovanpå avgiften och påverkar din totala boendekostnad. De varierar med lägenhetens storlek, energiprestanda och hur du bor. Att bara räkna på avgiften ger en ofullständig bild.",
    checkPoints: [
      "Fråga vad som ingår i avgiften – el, värme, vatten, kabel-tv?",
      "Be om faktiska driftkostnader från nuvarande ägare, inte bara schablon.",
      "Kontrollera energideklarationen för att bedöma uppvärmningskostnader.",
      "Räkna driftkostnader tillsammans med ränta, amortering och avgift.",
    ],
    relatedGuideSlugs: ["pris-per-kvm-bostadsratt"],
    relatedToolSlugs: ["boendekostnad"],
  },
  {
    slug: "pantsattning",
    term: "Pantsättning",
    metaTitle: "Pantsättning av bostadsrätt – vad det innebär vid köp | skajagbuda.se",
    metaDescription:
      "Pantsättning ger banken säkerhet för ditt lån. Lär dig hur det fungerar och vad som krävs vid bostadsrättsköp.",
    definition:
      "Pantsättning innebär att du som bostadsrättsinnehavare skriftligen medger att banken får panträtt i bostadsrätten som säkerhet för ditt lån. Pantsättningen registreras hos föreningen och måste beviljas enligt föreningens stadgar – normalt utan problem om du sköter dina åtaganden.",
    whyItMatters:
      "Utan pantsättning kan banken inte bevilja bostadslån. Vid köp behöver du se till att tidigare pantsättningar löses och att din egen registreras. Föreningen tar ofta ut en administrativ avgift för detta.",
    checkPoints: [
      "Kontrollera att säljarens lån och pantsättning kan lösas vid tillträde.",
      "Fråga föreningen om avgift och handläggningstid för ny pantsättning.",
      "Se till att banken skickar pantsättningshandlingar i god tid före tillträde.",
      "Läs stadgarna – finns särskilda krav vid pantsättning?",
    ],
    relatedGuideSlugs: ["checklista-innan-budgivning"],
  },
  {
    slug: "kapitaltillskott",
    term: "Kapitaltillskott",
    metaTitle: "Kapitaltillskott i bostadsrätt – extra avgift du bör känna till | skajagbuda.se",
    metaDescription:
      "Kapitaltillskott är en tillfällig extra avgift till föreningen. Förstå när det krävs och hur det skiljer sig från ordinarie avgift.",
    definition:
      "Kapitaltillskott (ibland kallat tillfällig avgift eller uttaxering) är en extra engångs- eller tillfällig betalning som föreningen beslutar att ta ut från medlemmarna utöver den ordinarie avgiften. Det sker typiskt för att finansiera större renoveringar, minska belåning eller fylla på renoveringsfonden.",
    whyItMatters:
      "Ett kapitaltillskott kan bli en betydande utgift utöver köpeskillingen och din ordinarie boendekostnad. Om föreningen planerar ett kapitaltillskott bör du veta det innan budgivning – det påverkar din totala ekonomiska belastning.",
    checkPoints: [
      "Fråga om planerade eller nyligen beslutade kapitaltillskott.",
      "Kontrollera storlek, betalningstid och om det kan finansieras med lån.",
      "Läs protokoll från senaste stämma om beslut om uttaxeringar.",
      "Räkna in eventuellt kapitaltillskott i din totala kostnadsbild.",
    ],
    relatedGuideSlugs: [
      "stambyte-bostadsratt-risk",
      "avgiftshojning-brf",
      "analysera-brf-arsredovisning",
    ],
  },
  {
    slug: "renoveringsfond",
    term: "Renoveringsfond",
    h1: "Renoveringsfond i BRF – vad betyder den för dig som köpare?",
    metaTitle: "Renoveringsfond i BRF – vad betyder den för dig som köpare? | skajagbuda.se",
    metaDescription:
      "Renoveringsfond kan betyda föreningens fond för yttre underhåll eller lägenhetens inre fond. Så läser du fonden i årsredovisningen – och varför den inte är pengar på banken.",
    shortAnswer:
      "Renoveringsfond är ett vardagligt namn på två olika saker: föreningens fond för yttre underhåll, som är en post i föreningens egna kapital, och den inre fonden, som tillhör en enskild lägenhet och följer med till köparen. Den yttre fonden visar hur mycket föreningen reserverat för underhåll i bokföringen – inte hur mycket pengar som finns på banken. Läs den därför alltid tillsammans med kassa, sparande och underhållsplan.",
    definition:
      "En renoveringsfond är pengar som reserveras för framtida renoveringar och underhåll. I en bostadsrättsförening avses oftast fonden för yttre underhåll – föreningens reservering för fastighetens gemensamma delar som tak, fasad och stammar. Ibland avses i stället den inre reparationsfonden, som är knuten till en viss lägenhet.",
    sections: [
      {
        id: "tva-fonder",
        heading: "Två olika fonder: yttre underhållsfond och inre fond",
        paragraphs: [
          "Fonden för yttre underhåll (även kallad underhållsfond eller yttre reparationsfond) gäller föreningens ansvar: byggnaden, gemensamma utrymmen och installationer. Hur mycket som ska avsättas varje år styrs av föreningens stadgar och bör följa underhållsplanen.",
          "Den inre fonden (inre reparationsfond) finns bara i vissa föreningar. Den är kopplad till en specifik lägenhet och kan användas för renovering inne i den, till exempel kök eller badrum. När du köper lägenheten tar du över det som finns kvar i den inre fonden – fråga mäklaren om saldot, eftersom det i praktiken är pengar som följer med köpet.",
        ],
      },
      {
        id: "arsredovisningen",
        heading: "Så syns renoveringsfonden i årsredovisningen",
        paragraphs: [
          "Fonden för yttre underhåll redovisas under eget kapital i balansräkningen, oftast som en del av det bundna egna kapitalet. I noten eller i förändringen av eget kapital ser du hur mycket som avsatts under året och hur mycket som tagits i anspråk för genomfört underhåll.",
          "Från och med räkenskapsåret 2023 redovisar föreningarna också nyckeltalet sparande per kvm, som ofta säger mer om föreningens faktiska sparande än fondens storlek. Läs mer om nyckeltalen i guiden [Analysera årsredovisning i BRF](/guider/analysera-brf-arsredovisning).",
        ],
      },
      {
        id: "vad-den-sager",
        heading: "Vad fonden säger – och inte säger",
        paragraphs: [
          "Fonden visar hur mycket av föreningens egna kapital som reserverats för underhåll. Den visar inte att pengarna finns på ett bankkonto. Föreningen kan ha använt likviderna till amortering eller investeringar, och då ligger värdet i fastigheten i stället för i kassan.",
          "Den viktiga frågan är därför inte bara hur stor fonden är, utan om föreningen har pengar eller realistiska lånemöjligheter när underhållet ska göras. Svaret hittar du i kassan, i [kassalikviditeten](/ordlista/kassalikviditet) och i underhållsplanen.",
        ],
      },
      {
        id: "stor-eller-liten",
        heading: "Stor eller liten fond – varför det inte är automatiskt bra eller dåligt",
        paragraphs: [
          "En stor fond kan betyda att föreningen länge avsatt enligt en god plan – men också att ett stort projekt snart ska genomföras, så att fonden strax tas i anspråk. En liten fond kan betyda att föreningen nyss genomfört ett stort projekt, att den finansierar underhåll med lån, eller att den helt enkelt inte sparar tillräckligt.",
          "Jämför därför fonden med underhållsplanens kostnader för de närmaste åren och med hur fonden har utvecklats över tid. Det är trenden och kopplingen till planen som säger något – inte beloppet ensamt.",
        ],
      },
      {
        id: "underhallsplan",
        heading: "Renoveringsfonden och underhållsplanen hör ihop",
        paragraphs: [
          "Avsättningen till fonden bör bygga på [underhållsplanen](/guider/underhallsplan-brf): vad som behöver göras, när och till vilken kostnad. Saknas en aktuell plan är det svårt att veta om avsättningen är rimlig.",
          "Om planen visar ett stort projekt – till exempel ett [stambyte](/guider/stambyte-bostadsratt-risk) – inom några år, kontrollera hur det ska finansieras. Kommer pengarna från sparade medel, nya lån eller höjd avgift? Det påverkar din framtida månadskostnad direkt.",
        ],
      },
    ],
    whyItMatters:
      "Fonden påverkar inte priset direkt, men den hjälper dig bedöma om föreningen är förberedd på kommande underhåll. Är den liten samtidigt som stora projekt väntar och [kassan i föreningen](/guider/kassa-i-bostadsrattsforening) är tunn, är risken större för avgiftshöjningar eller kapitaltillskott – och då bör du räkna med det i ditt maxbud.",
    checkPoints: [
      "Hur stor är fonden för yttre underhåll – och hur har den förändrats de senaste åren?",
      "Hur mycket avsätts per år, och följer avsättningen underhållsplanen?",
      "Vad säger underhållsplanen om de närmaste fem–tio åren, och hur ska det finansieras?",
      "Hur stor är kassan och hur ser sparande per kvm ut – fonden i sig är inte pengar på banken.",
      "Finns en inre fond för lägenheten? Fråga mäklaren om saldot, eftersom den följer med till dig.",
    ],
    faq: [
      {
        q: "Är renoveringsfonden pengar på banken?",
        a: "Inte nödvändigtvis. Fonden för yttre underhåll är en post i föreningens egna kapital. Hur mycket pengar som faktiskt finns ser du under kassa och bank i balansräkningen.",
      },
      {
        q: "Vad är skillnaden mellan yttre och inre fond?",
        a: "Den yttre fonden gäller föreningens gemensamma underhåll. Den inre fonden är knuten till en enskild lägenhet och kan användas för renovering inne i den.",
      },
      {
        q: "Följer den inre fonden med när jag köper?",
        a: "Ja, den inre fonden hör till lägenheten och tas över av köparen. Be mäklaren om aktuellt saldo innan du budar.",
      },
      {
        q: "Är en stor renoveringsfond alltid bra?",
        a: "Nej. Den kan vara stor för att ett dyrt projekt är på väg. Jämför alltid med underhållsplanen och föreningens kassa.",
      },
    ],
    sources: [
      {
        label: "Bokföringsnämnden – vägledning om årsredovisning för bostadsrättsföreningar",
        href: "https://www.bfn.se/wp-content/uploads/vl23-1-brf.pdf",
      },
    ],
    updated: "2026-09-29",
    relatedGuideSlugs: [
      "analysera-brf-arsredovisning",
      "underhallsplan-brf",
      "kassa-i-bostadsrattsforening",
      "stambyte-bostadsratt-risk",
    ],
  },
  {
    slug: "energideklaration",
    term: "Energideklaration",
    metaTitle: "Energideklaration vid bostadsrättsköp – vad den säger | skajagbuda.se",
    metaDescription:
      "Energideklarationen visar fastighetens energiprestanda. Lär dig tolka den och bedöma framtida driftkostnader.",
    definition:
      "En energideklaration är ett dokument som visar fastighetens energiprestanda på en skala från A till G. Den krävs vid försäljning av bostadsrätter och baseras på byggnadens uppvärmning, ventilation och energiförbrukning. Deklarationen gäller i tio år.",
    whyItMatters:
      "Energideklarationen ger en indikation på framtida uppvärmningskostnader och hur energieffektiv fastigheten är. Låg energiklass kan innebära högre driftkostnader och ibland kommande krav på energieffektivisering.",
    checkPoints: [
      "Be om energideklarationen – när utfärdades den och vilket klassificeringsbetyg har fastigheten?",
      "Jämför energiklassen med liknande fastigheter i området.",
      "Fråga om planerade energieffektiviseringsåtgärder och hur de finansieras.",
      "Sätt energiprestandan i relation till faktiska driftkostnader från nuvarande ägare.",
    ],
    relatedGuideSlugs: ["besiktning-bostadsratt"],
  },
];

export function getGlossaryBySlug(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((term) => term.slug === slug);
}

export function getAllGlossarySlugs(): string[] {
  return GLOSSARY.map((term) => term.slug);
}
