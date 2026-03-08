"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const wantsListeningRef = useRef(false);

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

      let finalTranscript = "";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript + " ";
          } else {
            interim += result[0].transcript;
          }
        }
        setTranscript((finalTranscript + interim).trim());
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        if (wantsListeningRef.current) {
          // Browser ended recognition unexpectedly — auto-restart
          recognition.start();
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
      setTranscript("");
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

  return { isSupported, isListening, transcript, start, stop, reset };
}
