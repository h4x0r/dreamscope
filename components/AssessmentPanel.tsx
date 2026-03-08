import { OverallAssessment } from "@/lib/types";

interface AssessmentPanelProps {
  assessment: OverallAssessment;
  summary: string;
}

export default function AssessmentPanel({
  assessment,
  summary,
}: AssessmentPanelProps) {
  return (
    <div className="bg-dream-surface border-l-4 border-dream-clinical rounded-r-xl p-6 space-y-5">
      <div>
        <p className="text-dream-muted text-xs uppercase tracking-wider mb-1">
          Dominant Theme
        </p>
        <p className="text-xl font-semibold text-dream-text">
          {assessment.dominantTheme}
        </p>
      </div>

      <p className="text-dream-text leading-relaxed">{summary}</p>

      {assessment.stressIndicators.length > 0 && (
        <div>
          <p className="text-dream-muted text-xs uppercase tracking-wider mb-2">
            Indicators
          </p>
          <div className="flex flex-wrap gap-2">
            {assessment.stressIndicators.map((indicator) => (
              <span
                key={indicator}
                className="px-3 py-1 bg-dream-bg rounded-full text-xs text-dream-muted border border-dream-muted/20"
              >
                {indicator}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-dream-bg/50 rounded-lg p-4 space-y-3">
        <p className="text-dream-text text-sm leading-relaxed">
          {assessment.normalization}
        </p>
        <p className="text-dream-text text-sm leading-relaxed">
          {assessment.strengthsNote}
        </p>
        <p className="text-dream-primary text-sm leading-relaxed italic">
          {assessment.gentleInquiry}
        </p>
      </div>

      <p className="text-dream-muted text-xs italic">
        {assessment.clinicalNote}
      </p>
    </div>
  );
}
