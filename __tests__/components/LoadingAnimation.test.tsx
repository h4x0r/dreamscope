import { render, screen } from "@testing-library/react";
import LoadingAnimation from "@/components/LoadingAnimation";

describe("LoadingAnimation", () => {
  it("renders the analyzing message", () => {
    render(<LoadingAnimation />);
    expect(
      screen.getByText(/analyzing through 3 psychological frameworks/i)
    ).toBeInTheDocument();
  });
});
