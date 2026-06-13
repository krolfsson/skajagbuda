import { ExampleReport } from "@/components/ExampleReport";
import { EXAMPLE_PROPERTY } from "@/lib/example-scorecard";

export function LandingExampleReport() {
  return (
    <section id="exempelrapport" className="home-example-section">
      <div className="home-example-section-head">
        <p className="home-section-eyebrow">Exempelanalys</p>
        <h2 className="home-example-section-title">Så ser en full analys ut</h2>
        <p className="home-example-section-lead">
          Ett exempel på en full analys med score, risknivå, budstrategi och viktiga
          risker bakom objektet.
        </p>
      </div>

      <div className="home-example-object">
        <p className="home-example-object-label">Exempelobjekt</p>
        <h3 className="home-example-object-title">{EXAMPLE_PROPERTY.title}</h3>
        <p className="home-example-object-meta">{EXAMPLE_PROPERTY.metaShort}</p>
      </div>

      <ExampleReport showHeading={false} />
    </section>
  );
}
