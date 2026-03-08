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

  it("stays listening when recognition ends unexpectedly (auto-restarts)", () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.start());
    expect(result.current.isListening).toBe(true);

    // Simulate browser firing onend without user calling stop
    act(() => {
      mockInstance.onend?.();
    });

    // Should still be listening (auto-restarted)
    expect(result.current.isListening).toBe(true);
    // Recognition.start should have been called again
    expect(mockInstance.start).toHaveBeenCalledTimes(2);
  });

  it("stops listening when user explicitly calls stop", () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.start());
    act(() => result.current.stop());

    // Now onend fires after stop — should NOT restart
    expect(result.current.isListening).toBe(false);
    expect(mockInstance.start).toHaveBeenCalledTimes(1);
  });

  it("stays listening when a transient error fires followed by onend", () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.start());
    expect(result.current.isListening).toBe(true);

    // Browser fires onerror (e.g. "aborted") then onend
    act(() => {
      mockInstance.onerror?.({ error: "aborted" });
    });
    act(() => {
      mockInstance.onend?.();
    });

    // Should still be listening — auto-restarted
    expect(result.current.isListening).toBe(true);
    expect(mockInstance.start).toHaveBeenCalledTimes(2);
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
