import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SymbolCard from "@/components/SymbolCard";

const mockSymbol = {
  id: "bridge",
  label: "Bridge",
  quote: "I was crossing this huge bridge",
  interpretation: "This represents a transition you're navigating.",
  groundedIn: {
    jungian: "Threshold between conscious and unconscious",
    cognitive: "Threat-simulation of unstable transition",
    clinical: "Correlates with decision anxiety",
  },
};

describe("SymbolCard", () => {
  it("renders the symbol label", () => {
    render(<SymbolCard symbol={mockSymbol} />);
    expect(screen.getByText("Bridge")).toBeInTheDocument();
  });

  it("renders the dream quote", () => {
    render(<SymbolCard symbol={mockSymbol} />);
    expect(
      screen.getByText(/I was crossing this huge bridge/i)
    ).toBeInTheDocument();
  });

  it("does not show interpretation initially", () => {
    render(<SymbolCard symbol={mockSymbol} />);
    expect(
      screen.queryByText(/transition you're navigating/i)
    ).not.toBeInTheDocument();
  });

  it("shows interpretation when expanded", async () => {
    render(<SymbolCard symbol={mockSymbol} />);
    await userEvent.click(screen.getByText("Bridge"));
    expect(
      screen.getByText(/transition you're navigating/i)
    ).toBeInTheDocument();
  });

  it("shows framework citations when expanded", async () => {
    render(<SymbolCard symbol={mockSymbol} />);
    await userEvent.click(screen.getByText("Bridge"));
    expect(screen.getByText("Jungian")).toBeInTheDocument();
    expect(screen.getByText("Cognitive")).toBeInTheDocument();
    expect(screen.getByText("Clinical")).toBeInTheDocument();
  });
});
