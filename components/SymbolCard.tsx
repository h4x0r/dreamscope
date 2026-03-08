"use client";

import { useState } from "react";
import { DreamSymbol } from "@/lib/types";

interface SymbolCardProps {
  symbol: DreamSymbol;
}

export default function SymbolCard({ symbol }: SymbolCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-dream-surface border border-dream-muted/20 rounded-xl p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-dream-text">
            {symbol.label}
          </h3>
          <span className="text-dream-muted text-sm ml-4">
            {isExpanded ? "−" : "+"}
          </span>
        </div>
        <p className="text-dream-muted text-sm italic mt-2">
          &ldquo;{symbol.quote}&rdquo;
        </p>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <p className="text-dream-text leading-relaxed">
            {symbol.interpretation}
          </p>

          <div className="pt-3 border-t border-dream-muted/10">
            <p className="text-dream-muted text-xs uppercase tracking-wider mb-2">
              Grounded in
            </p>
            <div className="space-y-1.5">
              <p className="text-xs">
                <span className="text-dream-jungian">Jungian</span>
                <span className="text-dream-muted">
                  {" — "}
                  {symbol.groundedIn.jungian}
                </span>
              </p>
              <p className="text-xs">
                <span className="text-dream-cognitive">Cognitive</span>
                <span className="text-dream-muted">
                  {" — "}
                  {symbol.groundedIn.cognitive}
                </span>
              </p>
              <p className="text-xs">
                <span className="text-dream-clinical">Clinical</span>
                <span className="text-dream-muted">
                  {" — "}
                  {symbol.groundedIn.clinical}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
