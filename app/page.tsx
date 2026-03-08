"use client";

import { useState } from "react";
import RecordButton from "@/components/RecordButton";
import ExampleDreams from "@/components/ExampleDreams";
import LoadingAnimation from "@/components/LoadingAnimation";
import DreamMap from "@/components/DreamMap";
import SymbolCard from "@/components/SymbolCard";
import AssessmentPanel from "@/components/AssessmentPanel";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import { DreamAnalysis } from "@/lib/types";

export default function Home() {
  const {
    isSupported,
    isListening,
    transcript: speechTranscript,
    error: speechError,
    start,
    stop,
    reset,
  } = useSpeechRecognition();

  const [manualTranscript, setManualTranscript] = useState("");
  const [showTextarea, setShowTextarea] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DreamAnalysis | null>(null);
  const [error, setError] = useState("");

  const transcript = speechTranscript || manualTranscript;

  async function handleAnalyze() {
    if (!transcript.trim()) return;

    setIsLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcript.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Analysis failed. Please try again.");
        return;
      }

      setAnalysis(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setAnalysis(null);
    setManualTranscript("");
    setError("");
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <LoadingAnimation />
      </main>
    );
  }

  if (analysis) {
    return (
      <main className="min-h-screen flex flex-col items-center px-4 py-12 md:py-20">
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {analysis.title}
          </h2>

          <DreamMap
            symbols={analysis.symbols}
            connections={analysis.connections}
          />

          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-dream-muted">Symbols</h3>
            {analysis.symbols.map((symbol) => (
              <SymbolCard key={symbol.id} symbol={symbol} />
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-dream-muted mb-4">
              Assessment
            </h3>
            <AssessmentPanel
              assessment={analysis.overallAssessment}
              summary={analysis.summary}
            />
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-dream-primary text-dream-primary rounded-xl hover:bg-dream-primary/10 transition-colors"
            >
              Analyze another dream
            </button>
          </div>

          <footer className="mt-12 text-center text-dream-muted text-xs max-w-md mx-auto">
            <p>
              DreamScope applies psychological frameworks for educational
              insight and personal reflection. It is not therapy, diagnosis, or a
              substitute for professional support.
            </p>
          </footer>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12 md:py-20">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          What did you dream last night?
        </h1>
        <p className="text-dream-muted text-lg md:text-xl mb-12">
          Speak your dream. See what it means — through science, not mysticism.
        </p>

        {isSupported ? (
          <RecordButton
            isRecording={isListening}
            onRecordingChange={(recording) => {
              if (recording) {
                setManualTranscript("");
                start();
              } else {
                stop();
              }
            }}
            onTranscript={setManualTranscript}
          />
        ) : (
          <p className="text-dream-muted text-sm mb-4">
            Voice recording is not supported in this browser. Type your dream
            instead.
          </p>
        )}

        {speechError && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {speechError}
          </div>
        )}

        {!isListening && (
          <button
            onClick={() => setShowTextarea(!showTextarea)}
            className="mt-6 text-dream-muted text-sm hover:text-dream-text transition-colors"
          >
            {showTextarea ? "Hide text input" : "Or type it out"}
          </button>
        )}

        {showTextarea && !isListening && (
          <textarea
            value={manualTranscript}
            onChange={(e) => setManualTranscript(e.target.value)}
            placeholder="Describe your dream in as much detail as you can remember..."
            className="mt-4 w-full h-40 bg-dream-surface border border-dream-muted/20 rounded-xl p-4 text-dream-text placeholder:text-dream-muted/50 resize-none focus:outline-none focus:ring-2 focus:ring-dream-primary/50"
            maxLength={5000}
          />
        )}

        {isListening && transcript && (
          <div className="mt-8">
            <h3 className="text-sm text-dream-muted mb-2 text-left">
              Live transcript:
            </h3>
            <p className="w-full bg-dream-surface border border-dream-muted/20 rounded-xl p-4 text-dream-text text-left text-sm min-h-[4rem]">
              {transcript}
            </p>
          </div>
        )}

        {transcript && !isListening && (
          <div className="mt-8">
            <h3 className="text-sm text-dream-muted mb-2 text-left">
              Your transcript (edit if needed):
            </h3>
            <textarea
              value={transcript}
              onChange={(e) => setManualTranscript(e.target.value)}
              className="w-full h-32 bg-dream-surface border border-dream-muted/20 rounded-xl p-4 text-dream-text resize-none focus:outline-none focus:ring-2 focus:ring-dream-primary/50"
              maxLength={5000}
            />
            <button
              onClick={handleAnalyze}
              className="mt-4 px-8 py-3 bg-dream-primary hover:bg-dream-primary/80 text-white font-semibold rounded-xl transition-colors"
            >
              Analyze Dream
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <ExampleDreams
          onSelect={(text) => {
            setManualTranscript(text);
            setShowTextarea(false);
          }}
        />
      </div>

      <footer className="mt-auto pt-12 text-center text-dream-muted text-xs max-w-md">
        <p>
          DreamScope applies psychological frameworks for educational insight
          and personal reflection. It is not therapy, diagnosis, or a substitute
          for professional support.
        </p>
        <p className="mt-2">Built by Albert Hui</p>
      </footer>
    </main>
  );
}
