import { render, screen } from "@testing-library/react";
import DreamMap from "@/components/DreamMap";

// ReactFlow needs ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver as unknown as typeof global.ResizeObserver;

const mockSymbols = [
  {
    id: "forest",
    label: "Dark Forest",
    quote: "running through a dark forest",
    interpretation: "Reflects a period of uncertainty.",
    groundedIn: {
      jungian: "Unconscious territory",
      cognitive: "Threat simulation",
      clinical: "Ambiguity or transition",
    },
  },
  {
    id: "pursuer",
    label: "Unseen Pursuer",
    quote: "something was chasing me",
    interpretation: "Something pressing or unresolved.",
    groundedIn: {
      jungian: "The shadow",
      cognitive: "Threat detection",
      clinical: "Avoidance patterns",
    },
  },
];

const mockConnections = [
  {
    from: "forest",
    to: "pursuer",
    relationship: "The forest obscures the threat",
  },
];

describe("DreamMap", () => {
  it("renders without crashing", () => {
    render(
      <DreamMap symbols={mockSymbols} connections={mockConnections} />
    );
    // ReactFlow renders in a container — verify it exists
    expect(document.querySelector(".react-flow")).toBeInTheDocument();
  });

  it("renders symbol labels as nodes", () => {
    render(
      <DreamMap symbols={mockSymbols} connections={mockConnections} />
    );
    expect(screen.getByText("Dark Forest")).toBeInTheDocument();
    expect(screen.getByText("Unseen Pursuer")).toBeInTheDocument();
  });
});
