import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";

// Mock fetch for API calls
global.fetch = jest.fn();

describe("Home page", () => {
  it("renders the headline", () => {
    render(<Home />);
    expect(
      screen.getByText("What did you dream last night?")
    ).toBeInTheDocument();
  });

  it("renders the subheading", () => {
    render(<Home />);
    expect(
      screen.getByText(/speak your dream.*see what it means/i)
    ).toBeInTheDocument();
  });

  it("shows fallback message when speech API is unavailable", () => {
    render(<Home />);
    expect(
      screen.getByText(/voice recording is not supported/i)
    ).toBeInTheDocument();
  });

  it("renders the record button when speech API is available", () => {
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition =
      jest.fn().mockImplementation(() => ({
        continuous: false,
        interimResults: false,
        lang: "",
        maxAlternatives: 1,
        start: jest.fn(),
        stop: jest.fn(),
        abort: jest.fn(),
        onresult: null,
        onerror: null,
        onend: null,
      }));

    render(<Home />);
    expect(
      screen.getByRole("button", { name: /start recording/i })
    ).toBeInTheDocument();

    delete (window as unknown as Record<string, unknown>)
      .webkitSpeechRecognition;
  });

  it("renders example dreams", () => {
    render(<Home />);
    expect(screen.getByText("Chase dream")).toBeInTheDocument();
  });

  it("shows textarea toggle", () => {
    render(<Home />);
    expect(screen.getByText(/or type it out/i)).toBeInTheDocument();
  });

  it("reveals textarea when toggle is clicked", async () => {
    render(<Home />);
    await userEvent.click(screen.getByText(/or type it out/i));
    expect(
      screen.getByPlaceholderText(/describe your dream/i)
    ).toBeInTheDocument();
  });

  it("shows analyze button when example dream is selected", async () => {
    render(<Home />);
    await userEvent.click(screen.getByText("Chase dream"));
    expect(
      screen.getByRole("button", { name: /analyze dream/i })
    ).toBeInTheDocument();
  });

  it("renders the disclaimer", () => {
    render(<Home />);
    expect(
      screen.getByText(/not therapy, diagnosis, or a substitute/i)
    ).toBeInTheDocument();
  });
});
