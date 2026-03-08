import { render, screen } from "@testing-library/react";
import AssessmentPanel from "@/components/AssessmentPanel";

const mockAssessment = {
  dominantTheme: "Navigating change",
  stressIndicators: ["instability imagery", "limited visibility"],
  normalization: "Dreams like this are very common during times of transition.",
  strengthsNote:
    "The fact that you were actively crossing suggests willingness to move forward.",
  gentleInquiry:
    "You might find it helpful to reflect on whether there's a transition in your life.",
  clinicalNote: "No indicators of acute distress.",
};

const mockSummary = "Your dream centers on navigating an unstable transition.";

describe("AssessmentPanel", () => {
  it("renders the dominant theme", () => {
    render(
      <AssessmentPanel assessment={mockAssessment} summary={mockSummary} />
    );
    expect(screen.getByText("Navigating change")).toBeInTheDocument();
  });

  it("renders the summary", () => {
    render(
      <AssessmentPanel assessment={mockAssessment} summary={mockSummary} />
    );
    expect(
      screen.getByText(/navigating an unstable transition/i)
    ).toBeInTheDocument();
  });

  it("renders stress indicators", () => {
    render(
      <AssessmentPanel assessment={mockAssessment} summary={mockSummary} />
    );
    expect(screen.getByText("instability imagery")).toBeInTheDocument();
    expect(screen.getByText("limited visibility")).toBeInTheDocument();
  });

  it("renders normalization statement", () => {
    render(
      <AssessmentPanel assessment={mockAssessment} summary={mockSummary} />
    );
    expect(
      screen.getByText(/very common during times of transition/i)
    ).toBeInTheDocument();
  });

  it("renders the gentle inquiry in italic", () => {
    render(
      <AssessmentPanel assessment={mockAssessment} summary={mockSummary} />
    );
    expect(
      screen.getByText(/might find it helpful to reflect/i)
    ).toBeInTheDocument();
  });

  it("renders clinical note", () => {
    render(
      <AssessmentPanel assessment={mockAssessment} summary={mockSummary} />
    );
    expect(
      screen.getByText(/no indicators of acute distress/i)
    ).toBeInTheDocument();
  });
});
