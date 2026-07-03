import { AnalysisPreview } from "@/components/AnalysisPreview";

const PREVIEW_HIGHLIGHTS = [
  "Slutsats och rekommenderat budintervall",
  "Prisbild och jämförelse",
  "Föreningsrisk",
  "Röda flaggor",
  "Frågor till mäklaren",
  "Nästa steg innan bud",
];

export function LandingExampleReport() {
  return (
    <section id="exempelanalys" className="home-example-proof-section" aria-labelledby="example-analysis-heading">
      <div className="home-example-proof-inner">
        <header className="home-example-section-head">
          <p className="home-section-eyebrow">Exempelanalys</p>
          <h2 id="example-analysis-heading" className="home-example-section-title">
            Så ser en objektspecifik analys ut
          </h2>
          <p className="home-example-section-lead">
            Inte en generell guide — utan en genomgång av ett konkret objekt med pris, förening,
            risker och budstrategi.
          </p>
        </header>

        <ul className="home-example-highlights" aria-label="Det här ingår i analysen">
          {PREVIEW_HIGHLIGHTS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="analysis-report-shell analysis-report-shell--full home-example-report-wrap">
          <AnalysisPreview />
        </div>
      </div>
    </section>
  );
}
