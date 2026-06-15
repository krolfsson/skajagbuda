import { ExampleReport } from "@/components/ExampleReport";
import { EXAMPLE_PROPERTY } from "@/lib/example-scorecard";

export function LandingExampleReport() {
  return (
    <section id="exempelanalys" className="home-example-proof-section" aria-labelledby="example-analysis-heading">
      <div className="home-example-proof-inner">
        <div className="home-example-section-head">
          <p className="home-section-eyebrow">Exempelanalys</p>
          <h2 id="example-analysis-heading" className="home-example-section-title">
            Så ser en full analys ut
          </h2>
          <p className="home-example-section-lead">
            Så här kan en full analys se ut efter upplåsning — med score, risknivå, budstrategi och
            viktiga risker bakom objektet.
          </p>
        </div>

        <div className="home-example-object">
          <p className="home-example-object-label">Exempelobjekt</p>
          <h3 className="home-example-object-title">{EXAMPLE_PROPERTY.title}</h3>
          <p className="home-example-object-meta">{EXAMPLE_PROPERTY.metaShort}</p>
        </div>

        <div className="home-example-report-wrap">
          <ExampleReport showHeading={false} />
        </div>
      </div>
    </section>
  );
}
