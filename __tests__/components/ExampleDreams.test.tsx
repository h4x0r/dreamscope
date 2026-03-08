import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExampleDreams from "@/components/ExampleDreams";

describe("ExampleDreams", () => {
  it("renders three example dream buttons", () => {
    render(<ExampleDreams onSelect={jest.fn()} />);
    expect(screen.getByText("Chase dream")).toBeInTheDocument();
    expect(screen.getByText("Teeth falling out")).toBeInTheDocument();
    expect(screen.getByText("Flying dream")).toBeInTheDocument();
  });

  it("calls onSelect with dream text when clicked", async () => {
    const onSelect = jest.fn();
    render(<ExampleDreams onSelect={onSelect} />);

    await userEvent.click(screen.getByText("Chase dream"));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(expect.stringContaining("running"));
  });
});
