import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCT_DOMAIN, SITE_URL } from "@/lib/brand";

const TITLE = "Att tänka på vid budgivning och köp av bostadsrätt";
const DESCRIPTION =
  "Den kompletta guiden inför budgivningen: budstrategier, föreningens ekonomi och årsredovisning, stambyte, tomträtt, omförhandling av lån, dolda fel, röda flaggor och frågor att ställa mäklaren.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "att tänka på vid budgivning",
    "budgivning tips",
    "budstrategi bostadsrätt",
    "köpa bostadsrätt checklista",
    "granska årsredovisning brf",
    "stambyte",
    "tomträtt",
    "omförhandling av lån brf",
    "räntekänslighet bostadsrättsförening",
    "dolda fel bostadsrätt",
    "röda flaggor bostadsköp",
    "frågor att ställa mäklaren",
  ],
  alternates: { canonical: "/att-tanka-pa" },
  openGraph: {
    type: "article",
    url: `${SITE_URL}/att-tanka-pa`,
    title: TITLE,
    description: DESCRIPTION,
  },
};

const TOC = [
  { id: "budgivning", label: "Så fungerar en budgivning" },
  { id: "budstrategi", label: "Budstrategier som används" },
  { id: "kontrakt", label: "Efter budgivningen" },
  { id: "ekonomi", label: "Förbered din egen ekonomi" },
  { id: "forening", label: "Föreningens ekonomi" },
  { id: "stambyte", label: "Stambyte och underhåll" },
  { id: "tomtratt", label: "Tomträtt" },
  { id: "lan", label: "Lån, ränta och omförhandling" },
  { id: "lagenheten", label: "Lägenheten, skick och dolda fel" },
  { id: "stadgar", label: "Stadgar, andelstal och regler" },
  { id: "rodaflaggor", label: "Röda flaggor" },
  { id: "fragor", label: "Frågor att ställa" },
  { id: "ordlista", label: "Ordlista" },
  { id: "faq", label: "Vanliga frågor" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Är ett bud bindande?",
    a: "Nej. Ett bud vid en bostadsaffär är inte juridiskt bindande förrän köpekontraktet är undertecknat av både köpare och säljare. I praktiken bör du ändå bara lägga bud du menar allvar med – att dra tillbaka bud utan anledning skadar din trovärdighet hos mäklaren.",
  },
  {
    q: "Vinner alltid det högsta budet?",
    a: "Nej. Säljaren väljer fritt vem den säljer till och är inte skyldig att acceptera det högsta budet. Faktorer som köparens ekonomi, finansieringssäkerhet och tillträdesdatum kan väga in.",
  },
  {
    q: "Vad är skillnaden på utgångspris, acceptpris och slutpris?",
    a: "Utgångspriset är mäklarens marknadsföringspris och kan vara satt lågt för att locka spekulanter. Acceptpriset är den lägsta nivå säljaren är beredd att acceptera. Slutpriset är det pris bostaden faktiskt såldes för. Jämför alltid med faktiska slutpriser för liknande objekt, inte med utgångspriser.",
  },
  {
    q: "Hur mycket över utgångspris brukar bostäder gå?",
    a: "Det varierar kraftigt med ort och efterfrågan. I attraktiva lägen i storstäderna är 5–20 % över utgångspris vanligt, medan objekt på mindre orter ibland säljs till eller under utgångspris. Kontrollera slutpriser på liknande objekt i samma område.",
  },
  {
    q: "Vad är ett lockpris?",
    a: "Lockpris är ett medvetet lågt satt utgångspris för att dra många spekulanter till visningen och få igång en budgivning. Det är inte olagligt, men gör att du bör värdera bostaden utifrån slutpriser i området snarare än utgångspriset.",
  },
  {
    q: "Bör jag begära budlistan?",
    a: "Ja. Mäklaren är skyldig att dokumentera budgivningen och ska kunna visa en budförteckning med bud, belopp och tidpunkter efter avslutad affär. Be om den om du är osäker på hur budgivningen gått till.",
  },
  {
    q: "Vad är ett stambyte och varför är det dyrt?",
    a: "Ett stambyte innebär att fastighetens vatten- och avloppsrör byts ut, ofta i samband med renovering av badrum. Det är ett av de mest kostsamma underhållsprojekten en förening kan ha och kan leda till avgiftshöjning eller engångsinsats om det inte är finansierat. Ta reda på om stambyte är gjort eller planerat.",
  },
  {
    q: "Vad innebär tomträtt?",
    a: "Tomträtt betyder att föreningen inte äger marken utan hyr den, oftast av kommunen, mot en årlig avgift (tomträttsavgäld). Avgälden omförhandlas med jämna mellanrum och kan höjas kraftigt, vilket direkt kan påverka månadsavgiften – oberoende av annat underhåll.",
  },
  {
    q: "Varför är föreningens lån viktiga?",
    a: "Föreningens lån betalas indirekt av medlemmarna via avgiften. Hög belåning per kvadratmeter och en stor andel rörliga lån gör föreningen räntekänslig – stiger räntan kan avgiften behöva höjas. Kolla skuld per kvm, räntebindning och när lånen ska omförhandlas.",
  },
  {
    q: "Hur granskar jag en bostadsrättsförenings ekonomi?",
    a: "Läs årsredovisningen: skuld per kvadratmeter, räntekostnader och räntekänslighet, kassaflöde och sparande till underhåll, underhållsplanen, samt om det är en äkta eller oäkta förening. En låg avgift behöver inte betyda god ekonomi – den kan dölja uppskjutet underhåll.",
  },
];

const ARTICLE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  inLanguage: "sv-SE",
  mainEntityOfPage: `${SITE_URL}/att-tanka-pa`,
  author: { "@type": "Organization", name: PRODUCT_DOMAIN },
  publisher: { "@type": "Organization", name: PRODUCT_DOMAIN },
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const BREADCRUMB_JSONLD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Start", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Att tänka på", item: `${SITE_URL}/att-tanka-pa` },
  ],
};

export default function AttTankaPaPage() {
  return (
    <div className="guide-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([ARTICLE_JSONLD, FAQ_JSONLD, BREADCRUMB_JSONLD]),
        }}
      />

      <p className="guide-eyebrow">Guide · Att tänka på</p>
      <h1 className="guide-h1">Att tänka på vid budgivning och köp av bostadsrätt</h1>
      <p className="guide-lead">
        Ett bostadsköp är ofta livets största affär – och det mesta som avgör om det blir en bra
        affär står inte i annonsen. Här går vi igenom allt du bör tänka på innan du budar: hur en
        budgivning fungerar, vilka budstrategier som faktiskt används, hur du granskar föreningens
        ekonomi och årsredovisning, samt vad stambyte, tomträtt, omförhandling av lån och dolda fel
        kan betyda för din plånbok.
      </p>

      {/* Table of contents */}
      <nav className="guide-toc" aria-label="Innehåll">
        <p className="guide-toc-title">Innehåll</p>
        <ul className="guide-toc-list">
          {TOC.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className="guide-toc-link">
                <span>{t.label}</span>
                <svg
                  className="guide-toc-arrow"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 1. Budgivning */}
      <section id="budgivning" className="guide-section">
        <h2 className="guide-h2">Så fungerar en budgivning</h2>
        <p>
          En budgivning startar oftast efter visningen när flera spekulanter vill köpa samma bostad.
          Mäklaren förmedlar buden mellan budgivarna och säljaren, vanligtvis via sms eller telefon.
          Den som har det bud säljaren väljer att acceptera vinner. Det finns ingen lagstadgad tid –
          en budgivning kan pågå allt från några timmar till flera dagar.
        </p>
        <h3 className="guide-h3">Reglerna du bör känna till</h3>
        <ul className="guide-list">
          <li>
            <strong>Bud är inte bindande</strong> förrän köpekontraktet är undertecknat. Lägg ändå
            bara bud du står för.
          </li>
          <li>
            <strong>Högsta budet vinner inte alltid.</strong> Säljaren väljer fritt och kan väga in
            din ekonomi, finansiering och tillträdesdatum.
          </li>
          <li>
            <strong>Utgångspriset är marknadsföring.</strong> Det kan vara satt lågt (lockpris) för
            att locka fler spekulanter. Värdera utifrån slutpriser i området.
          </li>
          <li>
            <strong>Begär budförteckningen.</strong> Mäklaren ska dokumentera budgivningen och kunna
            visa bud, belopp och tidpunkter i efterhand.
          </li>
          <li>
            <strong>Öppen eller dold budgivning.</strong> Vid öppen budgivning ser alla budgivare
            varandras bud; vid dold ser bara mäklaren och säljaren buden.
          </li>
        </ul>
      </section>

      {/* 2. Budstrategi */}
      <section id="budstrategi" className="guide-section">
        <h2 className="guide-h2">Budstrategier som faktiskt används</h2>
        <p>
          Ingen strategi vinner garanterat – utfallet beror på vilka andra som budar och på säljaren.
          Men det är bra att känna igen taktikerna, både för att kunna använda dem och för att förstå
          vad motbudgivarna gör.
        </p>
        <ul className="guide-list">
          <li>
            <strong>Maxbud direkt.</strong> Lägg det du faktiskt är beredd att betala redan från
            start för att signalera beslutsamhet och skrämma bort andra. Risk: du kan betala mer än
            nödvändigt.
          </li>
          <li>
            <strong>Små höjningar.</strong> Höj lite i taget för att inte avslöja ditt tak. Risk:
            budgivningen drar ut på tiden och fler hinner gå in.
          </li>
          <li>
            <strong>Trötta ut-taktiken.</strong> Lägg många snabba bud tätt inpå för att nöta ner
            motståndet.
          </li>
          <li>
            <strong>Återhållsam budgivare.</strong> Håll dig i bakgrunden och gå in sent, när få
            budgivare återstår.
          </li>
          <li>
            <strong>Bud över psykologiska gränser.</strong> Många har ett mentalt tak vid jämna
            summor. Ett bud på 3 010 000 kr i stället för 3 000 000 kr kan få andra att backa.
          </li>
          <li>
            <strong>Tidsbegränsat eller villkorat bud.</strong> Ett bud som bara gäller en viss tid
            kan sätta press på säljaren att bestämma sig.
          </li>
        </ul>
        <div className="guide-callout">
          <p>
            Sätt din maxgräns <strong>innan</strong> budgivningen börjar och skriv ner den. Det är
            den enskilt viktigaste regeln – den skyddar dig från att budstridens tempo och känslor
            tar över beslutet.
          </p>
        </div>
      </section>

      {/* 3. Efter budgivningen */}
      <section id="kontrakt" className="guide-section">
        <h2 className="guide-h2">Efter budgivningen: kontrakt och tillträde</h2>
        <p>
          När säljaren accepterat ditt bud är affären ännu inte klar – den blir bindande först när
          köpekontraktet är undertecknat av båda parter. Då gäller det att ha ekonomin och villkoren
          på plats så att inget faller mellan stolarna.
        </p>
        <ul className="guide-list">
          <li>
            <strong>Köpekontrakt.</strong> Affären blir bindande när både köpare och säljare skrivit
            under. Läs igenom alla villkor noga innan du signerar.
          </li>
          <li>
            <strong>Handpenning.</strong> Vanligen 10 % av köpeskillingen betalas i samband med
            kontraktet, ofta till mäklarens klientmedelskonto.
          </li>
          <li>
            <strong>Medlemskap i föreningen.</strong> Vid köp av bostadsrätt måste styrelsen godkänna
            dig som medlem innan affären kan slutföras.
          </li>
          <li>
            <strong>Tillträde.</strong> På tillträdesdagen betalas resten av köpeskillingen, lånen
            betalas ut och du får tillgång till bostaden.
          </li>
          <li>
            <strong>Lånet klart i tid.</strong> Säkerställ att bolånet är beviljat och
            utbetalningsklart till tillträdesdagen.
          </li>
          <li>
            <strong>Villkor i kontraktet.</strong> Eventuell besiktningsklausul eller lånevillkor bör
            skrivas in i kontraktet om de är aktuella.
          </li>
        </ul>
      </section>

      {/* 4. Ekonomi */}
      <section id="ekonomi" className="guide-section">
        <h2 className="guide-h2">Förbered din egen ekonomi</h2>
        <p>
          Innan du budar behöver du veta exakt vad du har råd med – inte bara vad banken lånar ut.
        </p>
        <ul className="guide-list">
          <li>
            <strong>Lånelöfte.</strong> Skaffa ett giltigt lånelöfte före visning så att du kan
            skriva kontrakt direkt om du vinner.
          </li>
          <li>
            <strong>Kontantinsats.</strong> Du behöver minst 15 % av köpeskillingen i kontantinsats;
            resten får lånas som bolån.
          </li>
          <li>
            <strong>Handpenning.</strong> Vanligen 10 % betalas vid kontraktsskrivning.
          </li>
          <li>
            <strong>Driftkostnad och avgift.</strong> Räkna in månadsavgift, el, och framtida
            avgiftshöjningar – inte bara själva köpeskillingen.
          </li>
          <li>
            <strong>Räkna med högre ränta.</strong> Banken stresstestar din ekonomi mot en
            kalkylränta som är högre än dagens. Gör samma sak själv.
          </li>
          <li>
            <strong>Amorteringskrav.</strong> Hög belåningsgrad och hög skuldkvot kan ge krav på
            högre amortering varje månad.
          </li>
        </ul>
      </section>

      {/* 4. Föreningen */}
      <section id="forening" className="guide-section">
        <h2 className="guide-h2">Granska föreningens ekonomi och årsredovisning</h2>
        <p>
          En låg månadsavgift betyder inte att ekonomin är bra – den kan dölja uppskjutet underhåll
          eller lån som snart ska omförhandlas. Läs föreningens senaste årsredovisning noga (eller be
          mäklaren om den). Det här är de viktigaste punkterna:
        </p>
        <ul className="guide-list">
          <li>
            <strong>Skuld per kvadratmeter.</strong> Under cirka 5 000–8 000 kr/kvm brukar anses
            sunt, medan över 10 000–15 000 kr/kvm kräver en närmare titt.
          </li>
          <li>
            <strong>Räntekänslighet.</strong> Hur mycket ökar föreningens kostnader om räntan stiger?
            Stora rörliga lån gör avgiften sårbar.
          </li>
          <li>
            <strong>Sparande till underhåll.</strong> Sätter föreningen av tillräckligt per kvm och
            år i förhållande till husets ålder och kommande projekt?
          </li>
          <li>
            <strong>Kassa och kassaflöde.</strong> Finns pengar för planerat underhåll eller måste
            nya lån tas?
          </li>
          <li>
            <strong>Äkta eller oäkta förening.</strong> En oäkta förening kan ge sämre skattevillkor
            för dig som medlem.
          </li>
          <li>
            <strong>Liten förening.</strong> Färre lägenheter innebär att stora kostnader – som ett
            stambyte – slås ut på färre hushåll och slår hårdare per medlem.
          </li>
          <li>
            <strong>Lokal- och hyresintäkter.</strong> Är föreningen beroende av en enda
            lokalhyresgäst? Då blir intäkten sårbar om avtalet inte förnyas.
          </li>
          <li>
            <strong>Avgiftshistorik.</strong> En nyligen sänkt avgift kan vara kosmetisk inför
            försäljningar snarare än ett tecken på styrka.
          </li>
        </ul>
      </section>

      {/* 5. Stambyte */}
      <section id="stambyte" className="guide-section">
        <h2 className="guide-h2">Stambyte och underhåll</h2>
        <p>
          Stambyte – att byta fastighetens vatten- och avloppsstammar – är ett av de dyraste
          projekt en förening kan ha. Det görs ofta i kombination med renovering av badrum. Är det
          inte finansierat kan det landa som avgiftshöjning eller en engångsinsats för medlemmarna.
        </p>
        <ul className="guide-list">
          <li>Ta reda på om stambyte är gjort, och i så fall när.</li>
          <li>Om det är planerat: finns en kostnadskalkyl och hur ska det finansieras?</li>
          <li>
            Kolla underhållsplanen för andra stora poster: tak, fasad, fönster, hiss och balkonger.
          </li>
          <li>
            Nyligen genomförda renoveringar minskar framtida risk; uppskjutet underhåll ökar den.
          </li>
        </ul>
      </section>

      {/* 6. Tomträtt */}
      <section id="tomtratt" className="guide-section">
        <h2 className="guide-h2">Tomträtt</h2>
        <p>
          Tomträtt innebär att föreningen inte äger marken huset står på utan hyr den, oftast av
          kommunen, mot en årlig tomträttsavgäld. Avgälden omförhandlas med jämna mellanrum och kan
          höjas kraftigt – framför allt i Stockholm, Göteborg och Malmö. En höjd avgäld kan tvinga
          fram en avgiftshöjning helt oberoende av övrigt underhåll.
        </p>
        <ul className="guide-list">
          <li>Äger föreningen marken eller är det tomträtt?</li>
          <li>Hur stor är dagens avgäld och när omförhandlas den nästa gång?</li>
          <li>
            Har föreningen köpt loss marken har de oftast i stället högre lån – väg in räntekostnaden.
          </li>
        </ul>
      </section>

      {/* 7. Lån */}
      <section id="lan" className="guide-section">
        <h2 className="guide-h2">Föreningens lån, ränta och omförhandling</h2>
        <p>
          Föreningens lån betalas indirekt av dig via avgiften. Två saker avgör risken: hur stora
          lånen är och hur de är räntesäkrade.
        </p>
        <ul className="guide-list">
          <li>
            <strong>Belåning.</strong> Hög skuld per kvm betyder att en större del av din avgift går
            till räntor och amortering.
          </li>
          <li>
            <strong>Räntebindning.</strong> En stor andel rörliga lån gör föreningen känslig för
            räntehöjningar. Ta reda på hur lånen är fördelade på bunden och rörlig ränta.
          </li>
          <li>
            <strong>Omförhandling.</strong> När löper bindningarna ut? Lån som ska omförhandlas snart
            till en högre ränta kan tvinga fram avgiftshöjning.
          </li>
          <li>
            <strong>Räkneexempel.</strong> Stiger räntan på ett stort rörligt lån med ett par
            procentenheter kan det motsvara en tvåsiffrig procentuell avgiftshöjning.
          </li>
        </ul>
      </section>

      {/* 8. Lägenheten */}
      <section id="lagenheten" className="guide-section">
        <h2 className="guide-h2">Lägenheten, skick och dolda fel</h2>
        <p>
          Som köpare har du undersökningsplikt. Det du kunde ha upptäckt vid en noggrann
          undersökning räknas inte som dolt fel i efterhand.
        </p>
        <ul className="guide-list">
          <li>
            <strong>Våtrum och kök.</strong> Är badrum och kök renoverade, och när? Titta under
            diskbänken efter fukt vid vattenledningar och avlopp.
          </li>
          <li>
            <strong>Ventilation.</strong> Dålig ventilation kan ge fukt och mögel. Kolla att fläktar
            och frånluftsventiler fungerar.
          </li>
          <li>
            <strong>Fukt och lukt.</strong> Luften ska kännas frisk. Instängd lukt kan tyda på
            fuktproblem.
          </li>
          <li>
            <strong>Besiktning.</strong> Vid mer osäkra objekt (särskilt hus) kan en besiktning vara
            värd pengarna.
          </li>
        </ul>
      </section>

      {/* 9. Stadgar */}
      <section id="stadgar" className="guide-section">
        <h2 className="guide-h2">Stadgar, andelstal och regler</h2>
        <p>
          Stadgarna styr dina rättigheter och skyldigheter som medlem. Läs dem innan du budar.
        </p>
        <ul className="guide-list">
          <li>
            <strong>Andelstal.</strong> Bestämmer hur stor del av föreningens kostnader du betalar.
            Stämmer det med lägenhetens andel av total boyta, eller betalar du oproportionerligt
            mycket?
          </li>
          <li>
            <strong>Andrahandsuthyrning.</strong> Vad gäller om du behöver hyra ut?
          </li>
          <li>
            <strong>Renoveringar.</strong> Vilka ändringar kräver styrelsens tillstånd?
          </li>
          <li>
            <strong>Kapitaltillskott.</strong> Kan föreningen kräva engångsinsatser vid stora projekt?
          </li>
        </ul>
      </section>

      {/* 10. Röda flaggor */}
      <section id="rodaflaggor" className="guide-section">
        <h2 className="guide-h2">Röda flaggor</h2>
        <p>Saker som bör få dig att gräva djupare innan du budar vidare:</p>
        <ul className="guide-list guide-redflags">
          <li>Stambyte planerat utan bekräftad finansiering och tunn kassa.</li>
          <li>Tomträtt med omförhandling nära i tiden.</li>
          <li>Stor andel rörliga föreningslån inför ett ränteläge på väg upp.</li>
          <li>Avgiften nyligen sänkt utan tydlig förklaring.</li>
          <li>En enda lokalhyresgäst som står för en stor del av intäkterna.</li>
          <li>Misstänkt låg avgift jämfört med liknande föreningar i området.</li>
          <li>Litet underhållssparande i ett gammalt hus.</li>
          <li>Ditt andelstal är högre än lägenhetens andel av total boyta.</li>
        </ul>
      </section>

      {/* 11. Frågor */}
      <section id="fragor" className="guide-section">
        <h2 className="guide-h2">Frågor att ställa mäklare och förening</h2>
        <ul className="guide-list">
          <li>Är stambyte gjort eller planerat, och hur ska det i så fall finansieras?</li>
          <li>Äger föreningen marken eller är det tomträtt – och när omförhandlas avgälden?</li>
          <li>Hur är föreningens lån fördelade på bunden och rörlig ränta?</li>
          <li>Vilka större underhållsprojekt finns i planen de kommande åren?</li>
          <li>Planerar styrelsen några avgiftshöjningar?</li>
          <li>Varför har avgiften ändrats senaste åren?</li>
          <li>Stämmer lägenhetens andelstal med boytan?</li>
          <li>Får jag se budförteckningen efter avslutad budgivning?</li>
        </ul>
      </section>

      {/* 12. Ordlista */}
      <section id="ordlista" className="guide-section">
        <h2 className="guide-h2">Ordlista</h2>
        <dl className="guide-glossary">
          {[
            ["Utgångspris", "Mäklarens marknadsföringspris, ibland satt lågt som lockpris."],
            ["Acceptpris", "Den lägsta nivå säljaren är beredd att acceptera."],
            ["Slutpris", "Det pris bostaden faktiskt såldes för – jämför alltid mot detta."],
            ["Lockpris", "Medvetet lågt utgångspris för att locka fler spekulanter."],
            ["Kontantinsats", "Minst 15 % av köpeskillingen som du betalar med egna pengar."],
            ["Handpenning", "Vanligen 10 % som betalas vid kontraktsskrivning."],
            ["Lånelöfte", "Bankens förhandsbesked om hur mycket du får låna."],
            ["Andelstal", "Din andel av föreningens kostnader och tillgångar."],
            ["Tomträttsavgäld", "Årlig avgift föreningen betalar för att hyra marken."],
            ["Stambyte", "Byte av fastighetens vatten- och avloppsrör."],
            ["Räntebindning", "Hur länge en låneränta är låst innan den omförhandlas."],
            ["Kapitaltillskott", "Engångsinsats medlemmar kan behöva betala vid stora projekt."],
            ["Äkta/oäkta förening", "Skattemässig klassning som påverkar dina villkor som medlem."],
          ].map(([term, def]) => (
            <div key={term} className="guide-term">
              <dt>{term}</dt>
              <dd>{def}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 13. FAQ */}
      <section id="faq" className="guide-section">
        <h2 className="guide-h2">Vanliga frågor</h2>
        {FAQ.map((item) => (
          <div key={item.q} className="guide-faq-item">
            <p className="guide-faq-q">{item.q}</p>
            <p className="guide-faq-a">{item.a}</p>
          </div>
        ))}
      </section>

      <div className="guide-cta">
        <h2>Slipp läsa hela årsredovisningen själv</h2>
        <p>
          Klistra in annons, budhistorik och årsredovisning så får du en preliminär risknivå gratis –
          och en full analys med maxbud, budstrategi och röda flaggor.
        </p>
        <Link
          href="/new"
          style={{
            display: "inline-block",
            fontSize: "14px",
            fontWeight: 600,
            padding: "11px 26px",
            background: "var(--brand)",
            color: "#fff",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Starta analys
        </Link>
      </div>
    </div>
  );
}
