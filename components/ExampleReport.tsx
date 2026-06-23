import {
  EXAMPLE_CONCLUSION,
  EXAMPLE_OBJECT_INFO,
  EXAMPLE_SCORECARD,
} from "@/lib/example-scorecard";
import { FullAnalysisReport } from "@/components/FullAnalysisReport";

export type ExampleReportProps = {
  /** Show landing CTA at bottom — used on homepage. */
  showFooterCta?: boolean;
};

/** Shared example report — same layout on /exempel, homepage and elsewhere. */
export function ExampleReport({ showFooterCta = false }: ExampleReportProps) {
  return (
    <FullAnalysisReport
      objectInfo={EXAMPLE_OBJECT_INFO}
      scorecard={EXAMPLE_SCORECARD}
      conclusionLine={EXAMPLE_CONCLUSION}
      showBetaBadge
      showFooterCta={showFooterCta}
    />
  );
}
