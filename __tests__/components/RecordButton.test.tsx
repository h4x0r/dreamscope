import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecordButton from "@/components/RecordButton";

describe("RecordButton", () => {
  const defaultProps = {
    isRecording: false,
    onRecordingChange: jest.fn(),
    onTranscript: jest.fn(),
  };

  it("renders mic button when not recording", () => {
    render(<RecordButton {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /start recording/i })
    ).toBeInTheDocument();
  });

  it("renders stop button when recording", () => {
    render(<RecordButton {...defaultProps} isRecording={true} />);
    expect(
      screen.getByRole("button", { name: /stop recording/i })
    ).toBeInTheDocument();
  });

  it("calls onRecordingChange when clicked", async () => {
    const onRecordingChange = jest.fn();
    render(
      <RecordButton {...defaultProps} onRecordingChange={onRecordingChange} />
    );

    await userEvent.click(
      screen.getByRole("button", { name: /start recording/i })
    );
    expect(onRecordingChange).toHaveBeenCalledWith(true);
  });

  it("shows recording status text", () => {
    render(<RecordButton {...defaultProps} />);
    expect(screen.getByText(/tap to speak/i)).toBeInTheDocument();
  });

  it("shows recording indicator when active", () => {
    render(<RecordButton {...defaultProps} isRecording={true} />);
    expect(screen.getByText(/recording/i)).toBeInTheDocument();
  });
});
