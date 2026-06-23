import { AnalysisPreview } from "@/components/AnalysisPreview";

export function LandingExampleReport() {
  return (
    <section id="exempelanalys" className="home-example-proof-section" aria-labelledby="example-analysis-heading">
      <div className="home-example-proof-inner">
        <header className="home-example-section-head">
          <p className="home-section-eyebrow">Exempelanalys</p>
          <h2 id="example-analysis-heading" className="home-example-section-title">
            Så ser en full analys ut
          </h2>
          <p className="home-example-section-lead">
            Det här är ett exempel på vad du får efter upplåsning — en full analys där AI hjälper till
            att väga pris, förening, risk och budstrategi.
          </p>
        </header>

        <div className="analysis-report-shell analysis-report-shell--full home-example-report-wrap">
          <AnalysisPreview />
        </div>
      </div>
    </section>
  );
}
