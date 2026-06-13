import type { Area } from "./types";

export const AREAS: Area[] = [
  {
    slug: "sodermalm",
    name: "Södermalm",
    metaTitle: "Köpa bostadsrätt på Södermalm – det här bör du veta | skajagbuda.se",
    metaDescription:
      "Södermalm lockar med centralt läge och varierat bestånd. Lär dig vad som skiljer föreningar och kvarter åt innan du budar – utan att lita på generella prisbilder.",
    intro:
      "Södermalm är ett av Stockholms mest efterfrågade områden, men utbudet spänner från äldre sekelskifteshus till nyproduktion och ombyggda industrifastigheter. Prisnivåer och föreningarnas ekonomi kan variera kraftigt även inom samma område. Innan du budar är det klokt att jämföra liknande objekt i samma del av Södermalm och läsa årsredovisningen noggrant.",
    considerations: [
      "Läget inom Södermalm påverkar både buller, ljus och tillgång till kollektivtrafik – jämför objekt i samma kvarter.",
      "Många föreningar har äldre byggnader med planerade eller genomförda stambyten; kontrollera status och finansiering.",
      "Tomträtt förekommer i vissa föreningar – det kan påverka avgiften långsiktigt.",
      "Andel hyresrätter och andrahandsuthyrning varierar mellan föreningar och kan påverka trivsel och styrelsearbete.",
      "Parkering och bilplats är ofta begränsat; räkna inte med att det ingår utan att kontrollera.",
    ],
    risks: [
      "Hög skuld per kvm i föreningen kan leda till avgiftshöjningar även om lägenheten verkar billig.",
      "Planerade underhåll utan tydlig finansiering kan ge oväntade tillfälliga avgifter.",
      "Buller från restaurang- och utelivsområden kan påverka boendekvaliteten mer än man tror vid dagtidsvisning.",
      "Föreningar med stora lokaler kan ha mer komplex ekonomi och högre driftskostnader.",
      "Snabb budgivning är vanlig – risken att buda utan full kontroll av BRF och kostnad ökar.",
    ],
    questions: [
      "Vilka större underhållsprojekt är planerade de närmaste fem till tio åren?",
      "Har föreningen tomträtt eller äger marken, och hur ser avtalet ut?",
      "Hur har avgiften utvecklats de senaste åren?",
      "Finns det begränsningar för andrahandsuthyrning i föreningen?",
    ],
    relatedGuideSlugs: [
      "kopa-bostadsratt-stockholm",
      "budgivning-stockholm",
      "analysera-brf-arsredovisning",
    ],
  },
  {
    slug: "vasastan",
    name: "Vasastan",
    metaTitle: "Köpa bostadsrätt i Vasastan – kontroller innan bud | skajagbuda.se",
    metaDescription:
      "Vasastan erbjuder klassiska fastigheter och centralt boende. Så bedömer du förening, avgift och läge innan du lägger bud på bostadsrätt.",
    intro:
      "Vasastan domineras av äldre flerbostadshus med ofta generösa planlösningar och närhet till innerstadens service. Prisnivåer och föreningarnas ekonomi kan variera kraftigt även inom samma område. Skillnaderna mellan kvarter – och mellan enskilda föreningar – är ofta större än man först tror.",
    considerations: [
      "Byggnadsålder varierar; vissa föreningar har redan genomfört stambyte, andra har det framför sig.",
      "Gårdshus och vindsombyggnader kan ha andra kostnadsstrukturer än huvudbyggnaden.",
      "Vindriktning och våning påverkar ljus och buller från innergårdar och gator.",
      "Energideklaration och uppvärmningssystem skiljer sig – fråga efter faktiska driftkostnader.",
      "Närhet till Odenplan och Sankt Eriksplan ger bra kommunikationer men också olika bullernivåer.",
    ],
    risks: [
      "Äldre föreningar kan bära hög belåning kopplad till genomförda eller kommande renoveringar.",
      "Underhållsplaner som inte följs upp kan ge dyra akuta ingrepp.",
      "Lokaler i bottenplan kan ge intäkter men också ökad komplexitet i föreningens ekonomi.",
      "Avgiften kan verka låg om stora renoveringar skjutits upp – kontrollera underhållsplanen.",
      "Konkurrens om objekt kan pressa dig att buda innan du hunnit analysera årsredovisningen.",
    ],
    questions: [
      "När genomfördes senaste stambytet, och vad planeras härnäst?",
      "Finns det särskilda avgifter för gårdshus eller vinds lägenheter?",
      "Hur ser föreningens kassa och soliditet ut enligt senaste årsredovisning?",
      "Vilka lokaler finns i fastigheten och hur stor andel av intäkterna kommer de från?",
    ],
    relatedGuideSlugs: [
      "kopa-bostadsratt-stockholm",
      "stambyte-bostadsratt-risk",
      "underhallsplan-brf",
    ],
  },
  {
    slug: "kungsholmen",
    name: "Kungsholmen",
    metaTitle: "Köpa bostadsrätt på Kungsholmen – guide innan budgivning | skajagbuda.se",
    metaDescription:
      "Kungsholmen kombinerar stadsliv och vattennärhet. Lär dig bedöma BRF, avgift och läge innan du budar på bostadsrätt i området.",
    intro:
      "Kungsholmen har utvecklats kraftigt med både äldre bestånd och nyproduktion längs vattnet. Prisnivåer och föreningarnas ekonomi kan variera kraftigt även inom samma område. Skillnaden mellan ett objekt nära Fridhemsplan och ett vid Norr Mälarstrand kan vara stor – både i läge och i föreningens ekonomi.",
    considerations: [
      "Nyproduktion och äldre föreningar har helt olika riskprofiler – jämför inte äpplen med päron.",
      "Lägenheter mot vattnet kan ha annorlunda buller- och solförhållanden än de mot innergård.",
      "Vissa föreningar har båtplatser, garage eller andra tillgångar som påverkar ekonomin.",
      "Kollektivtrafik och cykelavstånd till city är bra, men vissa delar har mer trafikbuller.",
      "Tomträtt förekommer – särskilt i äldre föreningar.",
    ],
    risks: [
      "Nybyggda föreningar kan ha låg avgift initialt som senare behöver justeras upp.",
      "Hög skuld per kvm efter nyproduktion eller stambyte kan ge framtida avgiftshöjningar.",
      "Föreningar med många investorägda lägenheter kan ha annorlunda beslutsdynamik.",
      "Planerade exploateringar i närområdet kan påverka utsikt och ljus över tid.",
      "Budgivning kan gå snabbt – risk att köpa utan att ha räknat hela boendekostnaden.",
    ],
    questions: [
      "Är föreningen nybildad eller etablerad, och hur ser ekonomin ut?",
      "Finns det planerade avgiftsförändringar eller särskilda uttaxeringar?",
      "Hur är föreningen finansierad – egen förvärvsfinansiering eller extern belåning?",
      "Vilka gemensamma utrymmen ingår och hur finansieras deras underhåll?",
    ],
    relatedGuideSlugs: [
      "kopa-bostadsratt-stockholm",
      "pris-per-kvm-bostadsratt",
      "tomtratt-bostadsratt",
    ],
  },
  {
    slug: "ostermalm",
    name: "Östermalm",
    metaTitle: "Köpa bostadsrätt på Östermalm – det här ska du kolla | skajagbuda.se",
    metaDescription:
      "Östermalm har prestige och varierat bestånd. Så analyserar du förening, avgift och objekt innan du budar – praktiskt och utan överdrivna löften.",
    intro:
      "Östermalm är känt för centralt läge och ett bestånd som spänner från sekelskiftesfastigheter till moderna bostadshus. Prisnivåer och föreningarnas ekonomi kan variera kraftigt även inom samma område. Ett dyrt utgångspris säger ingenting om föreningens ekonomi är sund.",
    considerations: [
      "Stora sekelskiftesfastigheter kan ha omfattande underhållsbehov – läs underhållsplanen noggrant.",
      "Vissa föreningar har lokalintäkter från butiker och kontor som stabiliserar ekonomin.",
      "Våning och hiss påverkar tillgänglighet och ofta efterfrågan.",
      "Parkering och förråd varierar kraftigt – kontrollera vad som faktiskt ingår.",
      "Föreningar med få lägenheter kan ha högre kostnad per medlem vid större projekt.",
    ],
    risks: [
      "Hög skuld per kvm dold bakom låg nuvarande avgift om renoveringar skjutits fram.",
      "Stambyte i äldre fastigheter kan bli kostsamma – kontrollera om det redan är genomfört.",
      "Tomträttsavtal med indexhöjning kan ge stigande avgifter över tid.",
      "Lokalfastigheter i samma byggnad kan medföra mer komplex förvaltning.",
      "Prestigeläge kan leda till budgivning som överstiger ditt faktiska maxbud.",
    ],
    questions: [
      "Vad är föreningens skuld per kvm och hur har den utvecklats?",
      "Finns det planerade kapitaltillskott eller extra avgifter?",
      "Hur ser tomträttsavtalet ut, om det finns?",
      "Vilka renoveringar har gjorts i lägenheten och i föreningens gemensamma utrymmen?",
    ],
    relatedGuideSlugs: [
      "kopa-bostadsratt-stockholm",
      "vad-ar-hog-skuld-per-kvm-brf",
      "lokalfastigheter-brf-risk",
    ],
  },
  {
    slug: "hagersten",
    name: "Hägersten",
    metaTitle: "Köpa bostadsrätt i Hägersten – vägledning innan bud | skajagbuda.se",
    metaDescription:
      "Hägersten erbjuder familjevänligt boende söder om city. Lär dig bedöma förening, läge och boendekostnad innan du budar på bostadsrätt.",
    intro:
      "Hägersten lockar med grönområden, goda kommunikationer och ett varierat bostadsbestånd från flera epoker. Prisnivåer och föreningarnas ekonomi kan variera kraftigt även inom samma område. Närhet till tunnelbana och service skiljer sig mellan olika delar av Hägersten.",
    considerations: [
      "Avstånd till tunnelbana varierar – räkna med promenadtid i vardagen, inte bara karta.",
      "Många föreningar byggdes på 60- och 70-talet och kan ha stambyte framför sig.",
      "Balkonger och uteplatser är eftertraktade men underhållsbehov skiljer sig.",
      "Vissa områden har mer biltrafik och buller än andra – besök vid olika tider.",
      "Föreningar med pool, bastu eller stora gemensamma ytor har högre driftskostnader.",
    ],
    risks: [
      "Kommande stambyte utan tillräcklig renoveringsfond kan ge höga tillfälliga avgifter.",
      "Föreningar med låg avgift idag kan ha uppskjutet underhåll.",
      "Hög andel hyresrätter i vissa fastigheter kan ge annorlunda föreningsdynamik.",
      "Planerad infrastruktur eller byggnation i närområdet kan påverka boendemiljön.",
      "Budgivning utan att ha läst årsredovisningen ger en ofullständig riskbild.",
    ],
    questions: [
      "Har föreningen en aktuell underhållsplan och följs den?",
      "Hur stor är renoveringsfonden och räcker den till planerade projekt?",
      "Finns det planerade avgiftshöjningar eller särskilda uttaxeringar?",
      "Hur långt är det till närmaste tunnelbanestation och busshållplats?",
    ],
    relatedGuideSlugs: [
      "kopa-bostadsratt-stockholm",
      "stambyte-bostadsratt-risk",
      "avgiftshojning-brf",
    ],
  },
  {
    slug: "aspudden",
    name: "Aspudden",
    metaTitle: "Köpa bostadsrätt i Aspudden – kontroller innan bud | skajagbuda.se",
    metaDescription:
      "Aspudden kombinerar småstadskänsla och närhet till city. Så bedömer du BRF, avgift och läge innan du budar på bostadsrätt.",
    intro:
      "Aspudden har utvecklats till ett populärt område med tunnelbana, grönområden och ett blandat bostadsbestånd. Prisnivåer och föreningarnas ekonomi kan variera kraftigt även inom samma område. Skillnaderna mellan föreningar vid stationen och de längre bort kan vara betydande.",
    considerations: [
      "Närhet till Aspudden station påverkar både värde och bullernivå.",
      "Många föreningar har äldre installationer – fråga om stambyte och el-renovering.",
      "Liljeholmen och Mälaren ger närhet till service men också områden med mer trafik.",
      "Föreningar med få lägenheter delar kostnader på färre medlemmar.",
      "Balkong och uteplats är inte standard i alla hus – kontrollera vad som ingår.",
    ],
    risks: [
      "Stigande räntor kan slå hårdare mot föreningar med hög extern belåning.",
      "Planerade stambyten i 60-talsfastigheter kan ge oväntade kostnader.",
      "Låg avgift kan vara tecken på uppskjutet underhåll snarare än bra ekonomi.",
      "Snabb prisutveckling i området kan locka till bud utan tillräcklig analys.",
      "Föreningar utan tydlig underhållsplan har svårare att förutse framtida kostnader.",
    ],
    questions: [
      "Vilka underhållsprojekt planeras enligt senaste underhållsplan?",
      "Hur har avgiften förändrats de senaste tre till fem åren?",
      "Finns det begränsningar eller krav vid andrahandsuthyrning?",
      "Hur ser föreningens kassalikviditet och soliditet ut?",
    ],
    relatedGuideSlugs: [
      "budgivning-stockholm",
      "underhallsplan-brf",
      "kassa-i-bostadsrattsforening",
    ],
  },
  {
    slug: "liljeholmen",
    name: "Liljeholmen",
    metaTitle: "Köpa bostadsrätt i Liljeholmen – det här bör du veta | skajagbuda.se",
    metaDescription:
      "Liljeholmen har både äldre bestånd och nyproduktion. Lär dig bedöma förening, avgift och läge innan du budar på bostadsrätt.",
    intro:
      "Liljeholmen har förändrats markant med ny bebyggelse, shopping och förbättrade kommunikationer. Prisnivåer och föreningarnas ekonomi kan variera kraftigt även inom samma område. Nyproduktion och äldre föreningar sida vid sida kräver olika typer av analys.",
    considerations: [
      "Nyproduktion har ofta annorlunda avgiftsstruktur än äldre föreningar i samma område.",
      "Närhet till Liljeholmen centrum och vatten ger olika boendemiljöer.",
      "Vissa föreningar har insynsskydd och balkonger som påverkar trivsel.",
      "Trafik och byggaktivitet kan vara mer påtaglig i vissa delar.",
      "Pendling till city är smidig men kollektivtrafikens kapacitet varierar vid rusningstid.",
    ],
    risks: [
      "Nya föreningar kan ha låg avgift som senare behöver höjas när garantier löper ut.",
      "Hög skuld per kvm i nyproduktion kan ge framtida avgiftspåslag.",
      "Exploatering i närområdet kan påverka utsikt och ljus under byggperiod.",
      "Föreningar med kommersiella lokaler kan ha mer volatil intäktsbas.",
      "Budgivning kan drivas av områdets popularitet snarare än objektets faktiska kvalitet.",
    ],
    questions: [
      "Är föreningen nybildad – och hur ser budget och ekonomisk plan ut?",
      "Vilka garantier gäller fortfarande för byggnaden och installationerna?",
      "Finns det planerade kommande uttaxeringar eller avgiftsjusteringar?",
      "Hur stor andel av intäkterna kommer från lokaler i fastigheten?",
    ],
    relatedGuideSlugs: [
      "kopa-bostadsratt-stockholm",
      "for-lag-avgift-bostadsratt",
      "roda-flaggor-bostadsratt",
    ],
  },
  {
    slug: "solna",
    name: "Solna",
    metaTitle: "Köpa bostadsrätt i Solna – guide innan budgivning | skajagbuda.se",
    metaDescription:
      "Solna erbjuder närhet till Stockholm city och varierat bestånd. Så analyserar du förening, avgift och läge innan du budar.",
    intro:
      "Solna kombinerar närhet till Stockholm med egna centrum, grönområden och ett brett utbud av bostadsrätter. Prisnivåer och föreningarnas ekonomi kan variera kraftigt även inom samma område. Skillnaderna mellan exempelvis Råsunda, Hagalund och Huvudsta är stora.",
    considerations: [
      "Kommungränsen ger tillgång till både Solnas och Stockholms service – men skatt och avgifter följer Solna.",
      "Närhet till pendeltåg, tvärbanan och tunnelbana varierar kraftigt mellan områden.",
      "Nyproduktion i Arenastaden och andra delar har annorlunda riskprofil än äldre bestånd.",
      "Vissa föreningar har tomträtt med Solna kommun eller privata markägare.",
      "Bostadsrättsföreningar i Solna kan ha olika storlek – från få lägenheter till stora komplex.",
    ],
    risks: [
      "Stora föreningar med hög belåning kan vara känsliga för ränteförändringar.",
      "Planerad stadsutveckling kan ge byggstörningar under lång tid.",
      "Tomträttsavgäld som indexeras kan öka avgiften gradvis.",
      "Föreningar med lokalintäkter kan vara beroende av hyresgästers solvens.",
      "Budgivning utan att ha jämfört med liknande objekt i samma del av Solna ger sämre beslutsunderlag.",
    ],
    questions: [
      "Vilket avtal gäller för tomträtt, om det finns?",
      "Hur ser föreningens skuld per kvm ut jämfört med liknande föreningar?",
      "Finns det planerade större renoveringar eller nybyggnation i föreningen?",
      "Hur lång är restiden till dina vardagliga destinationer med kollektivtrafik?",
    ],
    relatedGuideSlugs: [
      "kopa-bostadsratt-stockholm",
      "tomtratt-bostadsratt",
      "analysera-brf-arsredovisning",
    ],
  },
  {
    slug: "sundbyberg",
    name: "Sundbyberg",
    metaTitle: "Köpa bostadsrätt i Sundbyberg – det här ska du kolla | skajagbuda.se",
    metaDescription:
      "Sundbyberg är en egen kommun med citykänsla. Lär dig bedöma BRF, avgift och läge innan du budar på bostadsrätt.",
    intro:
      "Sundbyberg har vuxit kraftigt och erbjuder kort avstånd till city, eget centrum och ett varierat bostadsbestånd. Prisnivåer och föreningarnas ekonomi kan variera kraftigt även inom samma område. Centrala Sundbyberg skiljer sig markant från Ursvik och andra nyare områden.",
    considerations: [
      "Centrala Sundbyberg har hög efterfrågan men också mer buller och trängsel.",
      "Nyare områden som Ursvik har ofta nyproduktion med särskilda avgiftsstrukturer.",
      "Närhet till pendeltåg och tunnelbana är en stor fördel – men varierar per adress.",
      "Föreningar med få lägenheter kan få högre kostnad per medlem vid renoveringar.",
      "Grönområden och skolor skiljer sig mellan olika delar av kommunen.",
    ],
    risks: [
      "Snabb omvandling av området kan ge byggstörningar och förändrad miljö.",
      "Nyproduktion med låg initial avgift kan behöva justeras upp efter några år.",
      "Hög skuld per kvm i föreningen kan ge framtida avgiftshöjningar.",
      "Tomträtt i vissa föreningar kan medföra stigande avgifter.",
      "Konkurrens om objekt kan leda till bud utan tillräcklig BRF-analys.",
    ],
    questions: [
      "Hur gammal är föreningen och vilken erfarenhet har styrelsen av större projekt?",
      "Finns det planerade underhåll som inte är fullt finansierade?",
      "Hur ser andelen hyresrätter och andrahandsuthyrning ut i föreningen?",
      "Vilka planer finns för fortsatt utveckling i närområdet?",
    ],
    relatedGuideSlugs: [
      "budgivning-stockholm",
      "pris-per-kvm-bostadsratt",
      "checklista-innan-budgivning",
    ],
  },
  {
    slug: "goteborg",
    name: "Göteborg",
    metaTitle: "Köpa bostadsrätt i Göteborg – vägledning innan bud | skajagbuda.se",
    metaDescription:
      "Göteborg har varierande stadsdelar och föreningar. Så bedömer du BRF, avgift och läge innan du budar – utan generella prislöften.",
    intro:
      "Göteborg erbjuder allt från centrala lägenheter till boende i ytterområden med goda kommunikationer. Prisnivåer och föreningarnas ekonomi kan variera kraftigt även inom samma område. Skillnaderna mellan exempelvis Majorna, Hisingen och Örgryte är stora – både i läge och i föreningsstruktur.",
    considerations: [
      "Stadsdel påverkar både kommunikationer, service och typ av bostadsbestånd.",
      "Äldre landshövdingehus och nyproduktion kräver helt olika due diligence.",
      "Vissa föreningar har tomträtt – vanligt i äldre göteborgska föreningar.",
      "Vindriktning och närhet till vatten påverkar fukt, buller och upplevd trivsel.",
      "Kollektivtrafik med spårvagn, buss och pendeltåg varierar i täthet per område.",
    ],
    risks: [
      "Hög skuld per kvm kan ge avgiftshöjningar oavsett hur attraktivt läget verkar.",
      "Planerade stambyten i äldre fastigheter kan bli kostsamma utan tillräcklig fond.",
      "Föreningar med stora lokaler har mer komplex ekonomi att bedöma.",
      "Tomträttsavtal med indexhöjning kan ge gradvis stigande avgifter.",
      "Budgivning utan att ha läst årsredovisningen och räknat boendekostnad är en onödig risk.",
    ],
    questions: [
      "Vilka större underhållsprojekt planeras enligt föreningens underhållsplan?",
      "Hur ser föreningens skuld per kvm och soliditet ut?",
      "Finns det tomträtt – och i så fall, hur ser avtalet ut?",
      "Hur har avgiften utvecklats de senaste åren?",
    ],
    relatedGuideSlugs: [
      "analysera-brf-arsredovisning",
      "vad-ar-hog-skuld-per-kvm-brf",
      "checklista-innan-budgivning",
    ],
  },
];

export function getAreaBySlug(slug: string): Area | undefined {
  return AREAS.find((area) => area.slug === slug);
}

export function getAllAreaSlugs(): string[] {
  return AREAS.map((area) => area.slug);
}
