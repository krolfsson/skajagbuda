import { EXAMPLE_PROPERTY, EXAMPLE_SCORECARD, EXAMPLE_CONCLUSION } from "@/lib/example-scorecard";
import { AnalysisReport } from "@/components/AnalysisReport";

/** Homepage example — compact full report with start-analysis CTA. */
export function AnalysisPreview() {
  return (
    <AnalysisReport
      title={EXAMPLE_PROPERTY.title}
      meta={EXAMPLE_PROPERTY.metaShort}
      scorecard={EXAMPLE_SCORECARD}
      conclusionLine={EXAMPLE_CONCLUSION}
      eyebrow="Preview av upplåst analys"
      titleAs="h3"
      footer="landing"
      compact
    />
  );
}
