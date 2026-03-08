import { render, screen } from "@testing-library/react";
import LoadingAnimation from "@/components/LoadingAnimation";

describe("LoadingAnimation", () => {
  it("renders the first progress message", () => {
    render(<LoadingAnimation />);
    expect(
      screen.getByText(/reading your dream narrative/i)
    ).toBeInTheDocument();
  });

  it("renders a progress bar", () => {
    const { container } = render(<LoadingAnimation />);
    const progressBar = container.querySelector("[style]");
    expect(progressBar).toBeInTheDocument();
  });
});
