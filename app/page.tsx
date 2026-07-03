import Link from "next/link";
import { LandingExampleReport } from "@/components/LandingExampleReport";
import { HomeAnalytics } from "@/components/HomeAnalytics";
import { HomeHeroForm } from "@/components/HomeHeroForm";
import { BETA_TRUST_EXTENDED } from "@/lib/brand";

const ANSWER_ITEMS = [
  {
    title: "Verkar priset rimligt?",
    desc: "Jämförelse mot utgångspris, pris/kvm och liknande objekt i området.",
  },
  {
    title: "Finns risker i föreningen?",
    desc: "Skuld, avgift, stambyte och andra varningssignaler i årsredovisningen.",
  },
  {
    title: "Vad bör du fråga mäklaren?",
    desc: "Konkreta frågor innan du höjer — sådant som annonsen sällan svarar på.",
  },
  {
    title: "Vad talar för eller emot att höja budet?",
    desc: "Styrkor, svagheter och om priset motiveras av underlaget.",
  },
  {
    title: "Vilket budintervall verkar rimligt?",
    desc: "Rekommenderat budtak, stretch och walk-away utifrån objektets risker.",
  },
  {
    title: "När bör du vara försiktig?",
    desc: "Röda flaggor och osäkerheter som bör stoppa eller sakta ner budgivningen.",
  },
];

const WHEN_TO_USE = [
  "När du har hittat en bostadsrätt du överväger att buda på.",
  "När budgivningen är igång eller nära att starta.",
  "När du vill förstå pris, avgift och förening snabbt.",
  "När årsredovisningen känns svår att tolka.",
  "När du vill sätta ett budtak innan känslorna tar över.",
];

const TOPICS = [
  {
    title: "Ska jag buda på bostadsrätt?",
    desc: "Snabb kontroll av pris, BRF och risk innan första budet.",
    href: "/guider/ska-jag-buda-pa-bostadsratt",
  },
  {
    title: "Rimligt maxbud för bostadsrätt",
    desc: "Sätt en gräns utifrån slutpriser — inte utgångspris.",
    href: "/guider/vad-ar-rimligt-maxbud",
  },
  {
    title: "Hög skuld per kvm i BRF",
    desc: "Tolka skulden och vad som är riskabelt.",
    href: "/guider/vad-ar-hog-skuld-per-kvm-brf",
  },
  {
    title: "Frågor att ställa mäklaren",
    desc: "Konkreta frågor innan budgivningen.",
    href: "/guider/vad-ska-man-fraga-maklaren-innan-bud",
  },
  {
    title: "Stambyte i bostadsrätt",
    desc: "Risk, kostnad och vad du bör fråga om.",
    href: "/guider/stambyte-bostadsratt-risk",
  },
  {
    title: "Vad ska man kolla innan bud?",
    desc: "Checklista för pris, förening och maxbud.",
    href: "/guider/checklista-innan-budgivning",
  },
];

export default function HomePage() {
  return (
    <div className="home-page">
      <HomeAnalytics />

      <section className="home-hero home-hero--solo home-hero--editorial">
        <div className="home-hero-copy">
          <p className="home-eyebrow">Beslutsstöd inför budgivning</p>
          <h1 className="home-h1">Osäker på om du ska buda?</h1>
          <p className="home-lead">
            Klistra in objektlänken och få en genomgång av pris, förening, risker och rimligt
            budintervall — innan du höjer.
          </p>
          <p className="home-human-note">
            Byggd efter en ganska jobbig bostadsresa. Gratis under beta — vi lär oss av feedback.
          </p>
          <HomeHeroForm id="hero-analys" />
        </div>
      </section>

      <LandingExampleReport />

      <section className="home-answers home-answers--editorial" aria-labelledby="answers-heading">
        <div className="home-section-intro">
          <h2 id="answers-heading" className="home-section-title">
            Det här får du svar på innan du budar
          </h2>
          <p className="home-section-kicker">
            Sex frågor de flesta vill ha klarhet i innan budgivningen drar iväg.
          </p>
        </div>
        <ol className="home-answers-list">
          {ANSWER_ITEMS.map((item, index) => (
            <li key={item.title} className="home-answers-item">
              <span className="home-answers-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="home-answers-body">
                <h3 className="home-answers-q">{item.title}</h3>
                <p className="home-answers-a">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-when" aria-labelledby="when-heading">
        <div className="home-when-inner">
          <h2 id="when-heading" className="home-when-title">
            När passar skajagbuda.se?
          </h2>
          <ul className="home-when-list">
            {WHEN_TO_USE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-trust" aria-label="Beta och ansvarsfriskrivning">
        <div className="home-trust-inner">
          <p className="home-trust-beta">{BETA_TRUST_EXTENDED}</p>
          <p className="home-trust-disclaimer">
            Analysen är ett beslutsstöd, inte finansiell rådgivning. Kontrollera alltid uppgifter
            med mäklare, förening och bank innan du budar.
          </p>
        </div>
      </section>

      <section className="home-topics home-topics--secondary" aria-labelledby="topics-heading">
        <div className="home-section-intro home-section-intro--center">
          <p className="home-section-eyebrow">Guider och fördjupning</p>
          <h2 id="topics-heading" className="home-section-title">
            Vill du läsa mer innan budgivningen?
          </h2>
          <p className="home-section-kicker">
            Guiderna finns kvar för dig som vill fördjupa dig — börja gärna med en objektanalys om
            du står inför ett konkret bud.
          </p>
        </div>
        <ul className="home-topics-editorial">
          {TOPICS.map((topic) => (
            <li key={topic.href}>
              <Link href={topic.href} className="home-topics-editorial-link">
                <span className="home-topics-editorial-title">{topic.title}</span>
                <span className="home-topics-editorial-desc">{topic.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="home-topics-more">
          <Link href="/guider" className="home-topics-link">
            Se alla guider →
          </Link>
        </p>
      </section>

      <section className="home-bottom-cta" aria-labelledby="bottom-cta-heading">
        <div className="home-bottom-cta-inner">
          <h2 id="bottom-cta-heading" className="home-bottom-cta-title">
            Har du objektet framför dig?
          </h2>
          <p className="home-bottom-cta-lead">
            Klistra in länken nu — analysen tar cirka en minut och kräver ingen inloggning.
          </p>
          <HomeHeroForm id="bottom-analys" variant="compact" />
        </div>
      </section>
    </div>
  );
}
