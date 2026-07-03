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
        <header className="home-example-section-head home-section-intro">
          <p className="home-section-eyebrow">Exempelanalys</p>
          <h2 id="example-analysis-heading" className="home-section-title">
            Så ser en objektspecifik analys ut
          </h2>
          <p className="home-section-kicker">
            Ett riktigt objekt — med slutsats, prisbild, föreningsrisk och budintervall. Inte en
            generell guide.
          </p>
        </header>

        <ol className="home-example-checklist" aria-label="Det här ingår i analysen">
          {PREVIEW_HIGHLIGHTS.map((item, index) => (
            <li key={item}>
              <span className="home-example-checklist-index" aria-hidden="true">
                {index + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>

        <div className="analysis-report-shell analysis-report-shell--full home-example-report-wrap home-example-report-document">
          <AnalysisPreview />
        </div>
      </div>
    </section>
  );
}
