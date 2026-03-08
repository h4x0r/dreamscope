import { renderHook, act } from "@testing-library/react";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";

// Mock SpeechRecognition
class MockSpeechRecognition {
  continuous = false;
  interimResults = false;
  lang = "";
  maxAlternatives = 1;
  onresult: ((event: unknown) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  onend: (() => void) | null = null;

  start = jest.fn();
  stop = jest.fn().mockImplementation(() => {
    this.onend?.();
  });
  abort = jest.fn();
}

describe("useSpeechRecognition", () => {
  let mockInstance: MockSpeechRecognition;

  beforeEach(() => {
    mockInstance = new MockSpeechRecognition();
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition =
      jest.fn().mockImplementation(() => mockInstance);
  });

  afterEach(() => {
    delete (window as unknown as Record<string, unknown>)
      .webkitSpeechRecognition;
    delete (window as unknown as Record<string, unknown>).SpeechRecognition;
  });

  it("reports speech recognition as supported when API exists", () => {
    const { result } = renderHook(() => useSpeechRecognition());
    expect(result.current.isSupported).toBe(true);
  });

  it("reports speech recognition as unsupported when API missing", () => {
    delete (window as unknown as Record<string, unknown>)
      .webkitSpeechRecognition;
    const { result } = renderHook(() => useSpeechRecognition());
    expect(result.current.isSupported).toBe(false);
  });

  it("starts listening when start is called", () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.start());
    expect(result.current.isListening).toBe(true);
    expect(mockInstance.start).toHaveBeenCalled();
  });

  it("stops listening when stop is called", () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.start());
    act(() => result.current.stop());
    expect(result.current.isListening).toBe(false);
    expect(mockInstance.stop).toHaveBeenCalled();
  });

  it("resets transcript when reset is called", () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.start());

    // Simulate a speech result
    act(() => {
      mockInstance.onresult?.({
        resultIndex: 0,
        results: {
          length: 1,
          0: { isFinal: true, 0: { transcript: "hello world" }, length: 1 },
        },
      });
    });

    expect(result.current.transcript).toBe("hello world");

    act(() => result.current.reset());
    expect(result.current.transcript).toBe("");
  });
});
