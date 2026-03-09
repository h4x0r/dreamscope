"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  error: string;
  status: string;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const wantsListeningRef = useRef(false);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    const SR =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    setIsSupported(!!SR);

    if (!SR) return;

    const recognition = new (SR as new () => SpeechRecognition)();
    const rec = recognition as unknown as Record<string, unknown>;

    // Helper: configure before EVERY start() call
    function configure() {
      // Use non-continuous mode + auto-restart (more reliable than continuous)
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;
    }

    // --- Event handlers (registered BEFORE any start() call) ---

    rec.onstart = () => {
      setStatus("Listening — speak now...");
    };

    rec.onaudiostart = () => {
      setStatus("Microphone active — listening...");
    };

    rec.onspeechstart = () => {
      setStatus("Speech detected — transcribing...");
    };

    rec.onspeechend = () => {
      setStatus("Processing speech...");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript((finalTranscriptRef.current + interim).trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);

      switch (event.error) {
        case "not-allowed":
          setError(
            "Microphone access denied. Please allow microphone permission and reload."
          );
          wantsListeningRef.current = false;
          setIsListening(false);
          break;
        case "audio-capture":
          setError(
            "No microphone found. Check your audio input device."
          );
          wantsListeningRef.current = false;
          setIsListening(false);
          break;
        case "network":
          setError(
            "Network error. Chrome requires internet for speech recognition."
          );
          // Let onend auto-restart — network may recover
          break;
        case "no-speech":
          // Transient: no speech heard, onend will auto-restart
          break;
        case "aborted":
          // Transient: browser aborted, onend will auto-restart
          break;
        default:
          if (!wantsListeningRef.current) {
            setIsListening(false);
          }
      }
    };

    recognition.onend = () => {
      if (wantsListeningRef.current) {
        // Auto-restart with delay to avoid rapid restart loops
        setTimeout(() => {
          if (!wantsListeningRef.current) {
            setIsListening(false);
            return;
          }
          try {
            configure();
            recognition.start();
          } catch {
            wantsListeningRef.current = false;
            setIsListening(false);
            setStatus("");
          }
        }, 100);
      } else {
        setIsListening(false);
        setStatus("");
      }
    };

    // Store ref for start/stop callbacks
    recognitionRef.current = recognition;

    // Store configure function on the recognition object for start() to use
    (recognition as unknown as Record<string, () => void>)._configure =
      configure;
  }, []);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || isListening) return;

    // Configure before every start
    const configure = (recognition as unknown as Record<string, () => void>)
      ._configure;
    configure?.();

    wantsListeningRef.current = true;
    finalTranscriptRef.current = "";
    setTranscript("");
    setError("");
    setStatus("Starting recognition...");

    try {
      recognition.start();
      setIsListening(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(`Failed to start: ${msg}`);
      wantsListeningRef.current = false;
    }
  }, [isListening]);

  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      wantsListeningRef.current = false;
      recognitionRef.current.stop();
      setIsListening(false);
      setStatus("");
    }
  }, [isListening]);

  const reset = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    status,
    start,
    stop,
    reset,
  };
}
