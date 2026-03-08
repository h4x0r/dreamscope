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

    if (SR) {
      const recognition = new (SR as new () => SpeechRecognition)();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      const rec = recognition as unknown as Record<string, unknown>;

      rec.onaudiostart = () => {
        setStatus("Microphone active — listening...");
      };

      rec.onspeechstart = () => {
        setStatus("Speech detected — transcribing...");
      };

      rec.onspeechend = () => {
        setStatus("Speech ended — processing...");
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
        if (event.error === "not-allowed") {
          setError("Microphone access was denied. Please allow microphone permission.");
          wantsListeningRef.current = false;
          setIsListening(false);
        } else if (event.error === "no-speech") {
          // Transient — ignored, auto-restart will handle it
        } else if (event.error === "audio-capture") {
          setError("No microphone detected. Please check your audio input.");
          wantsListeningRef.current = false;
          setIsListening(false);
        } else if (!wantsListeningRef.current) {
          setIsListening(false);
        }
        // Other transient errors (aborted, network) — let onend auto-restart
      };

      recognition.onend = () => {
        if (wantsListeningRef.current) {
          // Browser ended recognition unexpectedly — auto-restart
          try {
            recognition.start();
          } catch {
            // start() can throw if called too rapidly
            wantsListeningRef.current = false;
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const start = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      wantsListeningRef.current = true;
      finalTranscriptRef.current = "";
      setTranscript("");
      setError("");
      setStatus("Starting recognition...");
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      wantsListeningRef.current = false;
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const reset = useCallback(() => {
    setTranscript("");
  }, []);

  return { isSupported, isListening, transcript, error, status, start, stop, reset };
}
