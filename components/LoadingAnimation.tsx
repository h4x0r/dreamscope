"use client";

import { useEffect, useState } from "react";

const PROGRESS_MESSAGES = [
  "Reading your dream narrative...",
  "Identifying key symbols...",
  "Applying Jungian framework...",
  "Analyzing cognitive patterns...",
  "Evaluating clinical indicators...",
  "Mapping symbol connections...",
  "Synthesizing across frameworks...",
  "Crafting trauma-informed language...",
  "Preparing your analysis...",
];

export default function LoadingAnimation() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) =>
        prev < PROGRESS_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center py-16">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-2 border-dream-primary/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-dream-primary/40 animate-ping [animation-delay:200ms]" />
        <div className="absolute inset-4 rounded-full border-2 border-dream-primary/60 animate-ping [animation-delay:400ms]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-dream-primary animate-pulse" />
        </div>
      </div>
      <p className="mt-8 text-dream-muted text-sm transition-opacity duration-500">
        {PROGRESS_MESSAGES[messageIndex]}
      </p>
      <div className="mt-4 w-64 h-1 bg-dream-surface rounded-full overflow-hidden">
        <div
          className="h-full bg-dream-primary rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${((messageIndex + 1) / PROGRESS_MESSAGES.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
