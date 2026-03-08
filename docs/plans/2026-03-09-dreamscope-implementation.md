# DreamScope Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a voice-first dream analysis web app that transcribes spoken dreams in-browser and renders AI-generated psychological analysis as an interactive dream map.

**Architecture:** Single-page Next.js 14 app. Browser-side Web Speech API captures voice and transcribes on-device. Transcript is POST'd to `/api/analyze`, which calls Claude Haiku with a 3-framework trauma-informed system prompt. Structured JSON response drives a ReactFlow node graph and symbol cards. Stateless, no database, no auth.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, ReactFlow, Web Speech API, Claude Haiku (via `@anthropic-ai/sdk`), Vercel, Vercel KV (rate limiting)

**Design Doc:** `docs/plans/2026-03-09-dreamscope-design.md`

---

## Task 1: Scaffold Next.js Project

**Files:**
- Create: project root (Next.js scaffold)
- Create: `tailwind.config.ts` (custom theme colors)
- Modify: `app/globals.css` (dark theme base styles)
- Modify: `app/layout.tsx` (metadata, font, dark background)

**Step 1: Create Next.js app**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

Expected: Project scaffolded in current directory with App Router, TypeScript, Tailwind.

**Step 2: Configure Tailwind theme colors**

Add DreamScope palette to `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dream: {
          bg: "#0a0a12",
          surface: "#12121f",
          primary: "#8b5cf6",
          jungian: "#f59e0b",
          cognitive: "#3b82f6",
          clinical: "#10b981",
          text: "#e2e8f0",
          muted: "#64748b",
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

**Step 3: Set dark theme base in globals.css**

Replace `app/globals.css` content:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #0a0a12;
  color: #e2e8f0;
}
```

**Step 4: Update layout.tsx**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DreamScope — Speak Your Dream",
  description:
    "Speak your dream. See what it means — through science, not mysticism.",
  openGraph: {
    title: "DreamScope — Speak Your Dream",
    description:
      "AI-powered dream analysis grounded in real psychological frameworks.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-dream-bg text-dream-text`}>
        {children}
      </body>
    </html>
  );
}
```

**Step 5: Verify scaffold runs**

Run:
```bash
npm run dev
```

Expected: Dev server starts on localhost:3000, dark background visible.

**Step 6: Commit**

```bash
git init && git add -A && git commit -m "feat: scaffold Next.js project with DreamScope theme"
```

---

## Task 2: Landing Page UI

**Files:**
- Create: `app/page.tsx`
- Create: `components/RecordButton.tsx`
- Create: `components/ExampleDreams.tsx`

**Step 1: Build the landing page**

Create `app/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import RecordButton from "@/components/RecordButton";
import ExampleDreams from "@/components/ExampleDreams";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showTextarea, setShowTextarea] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12 md:py-20">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          What did you dream last night?
        </h1>
        <p className="text-dream-muted text-lg md:text-xl mb-12">
          Speak your dream. See what it means — through science, not mysticism.
        </p>

        <RecordButton
          isRecording={isRecording}
          onRecordingChange={setIsRecording}
          onTranscript={setTranscript}
        />

        {!isRecording && (
          <button
            onClick={() => setShowTextarea(!showTextarea)}
            className="mt-6 text-dream-muted text-sm hover:text-dream-text transition-colors"
          >
            {showTextarea ? "Hide text input" : "Or type it out"}
          </button>
        )}

        {showTextarea && !isRecording && (
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Describe your dream in as much detail as you can remember..."
            className="mt-4 w-full h-40 bg-dream-surface border border-dream-muted/20 rounded-xl p-4 text-dream-text placeholder:text-dream-muted/50 resize-none focus:outline-none focus:ring-2 focus:ring-dream-primary/50"
            maxLength={5000}
          />
        )}

        {transcript && !isRecording && (
          <div className="mt-8">
            <h3 className="text-sm text-dream-muted mb-2 text-left">
              Your transcript (edit if needed):
            </h3>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full h-32 bg-dream-surface border border-dream-muted/20 rounded-xl p-4 text-dream-text resize-none focus:outline-none focus:ring-2 focus:ring-dream-primary/50"
              maxLength={5000}
            />
            <button
              onClick={() => {
                // TODO: Task 5 — wire up to /api/analyze
              }}
              className="mt-4 px-8 py-3 bg-dream-primary hover:bg-dream-primary/80 text-white font-semibold rounded-xl transition-colors"
            >
              Analyze Dream
            </button>
          </div>
        )}

        <ExampleDreams onSelect={setTranscript} />
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
```

**Step 2: Build the RecordButton component**

Create `components/RecordButton.tsx` (visual only for now, speech wired in Task 3):

```tsx
"use client";

interface RecordButtonProps {
  isRecording: boolean;
  onRecordingChange: (recording: boolean) => void;
  onTranscript: (transcript: string) => void;
}

export default function RecordButton({
  isRecording,
  onRecordingChange,
}: RecordButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => onRecordingChange(!isRecording)}
        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
          isRecording
            ? "bg-red-500 scale-110 shadow-[0_0_40px_rgba(239,68,68,0.4)]"
            : "bg-dream-primary shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] hover:scale-105"
        }`}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? (
          <div className="w-8 h-8 bg-white rounded-sm" />
        ) : (
          <svg
            className="w-10 h-10 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>
      <p className="mt-4 text-dream-muted text-sm">
        {isRecording ? "Recording... tap to stop" : "Tap to speak your dream"}
      </p>
      {isRecording && (
        <div className="mt-4 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-dream-primary rounded-full animate-pulse"
              style={{
                height: `${12 + Math.random() * 20}px`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 3: Build the ExampleDreams component**

Create `components/ExampleDreams.tsx`:

```tsx
"use client";

const EXAMPLE_DREAMS = [
  {
    label: "Chase dream",
    text: "I was running through a city I didn't recognize. The streets kept changing direction. Someone was chasing me but I couldn't see who. I kept trying to find a door to hide behind but every door was locked. My legs felt heavy, like I was running through water. I finally found an alley and hid behind a dumpster, and then I woke up with my heart pounding.",
  },
  {
    label: "Teeth falling out",
    text: "I was at a dinner party with people from work. I was talking and suddenly felt something loose in my mouth. I reached in and pulled out a tooth. Then another one came loose. I tried to keep talking normally but teeth kept falling out into my hand. Nobody else seemed to notice. I went to the bathroom and looked in the mirror and my mouth was full of gaps. I felt this deep sense of shame.",
  },
  {
    label: "Flying dream",
    text: "I was standing on a hill overlooking the ocean at sunset. I realized I could fly. I just leaned forward and lifted off the ground. It felt completely natural, like I'd always known how. I flew over the water and could see dolphins below. The wind was warm. I kept going higher and could see the whole coastline. I felt completely free and peaceful. I didn't want to come down.",
  },
];

interface ExampleDreamsProps {
  onSelect: (text: string) => void;
}

export default function ExampleDreams({ onSelect }: ExampleDreamsProps) {
  return (
    <div className="mt-12">
      <p className="text-dream-muted text-sm mb-3">Try an example:</p>
      <div className="flex flex-wrap justify-center gap-2">
        {EXAMPLE_DREAMS.map((dream) => (
          <button
            key={dream.label}
            onClick={() => onSelect(dream.text)}
            className="px-4 py-2 bg-dream-surface border border-dream-muted/20 rounded-full text-sm text-dream-muted hover:text-dream-text hover:border-dream-primary/50 transition-colors"
          >
            {dream.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 4: Verify landing page renders**

Run:
```bash
npm run dev
```

Expected: Dark page with headline, record button (pulsing purple glow), example pills. Record button toggles visual state. Example pills populate transcript.

**Step 5: Commit**

```bash
git add app/page.tsx components/RecordButton.tsx components/ExampleDreams.tsx
git commit -m "feat: landing page with record button and example dreams"
```

---

## Task 3: Web Speech API Integration

**Files:**
- Create: `lib/useSpeechRecognition.ts`
- Modify: `components/RecordButton.tsx` (wire up hook)

**Step 1: Create the speech recognition hook**

Create `lib/useSpeechRecognition.ts`:

```typescript
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

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
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
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const start = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const reset = useCallback(() => {
    setTranscript("");
  }, []);

  return { isSupported, isListening, transcript, start, stop, reset };
}
```

**Step 2: Add Web Speech API type declarations**

Create `types/speech.d.ts`:

```typescript
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}
```

**Step 3: Wire hook into RecordButton**

Update `components/RecordButton.tsx` to accept and use the hook outputs from the parent page. The parent (`page.tsx`) will own the hook, passing `isRecording`, `onRecordingChange`, and `onTranscript` as props.

Update `app/page.tsx` to use the hook:

```tsx
// Add at top of page.tsx, after existing imports:
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";

// Replace the existing useState lines for transcript/isRecording:
const {
  isSupported,
  isListening,
  transcript: speechTranscript,
  start,
  stop,
  reset,
} = useSpeechRecognition();
const [manualTranscript, setManualTranscript] = useState("");
const [showTextarea, setShowTextarea] = useState(false);

const transcript = speechTranscript || manualTranscript;

// Update RecordButton usage:
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
  isSupported={isSupported}
/>
```

Add `isSupported` prop to `RecordButton` — if `false`, hide the record button and show textarea only with message: "Voice recording is not supported in this browser. Type your dream instead."

**Step 4: Verify speech recognition works**

Run dev server, open in Chrome, click record, speak, verify transcript appears in real-time. Click stop, verify transcript is editable.

**Step 5: Commit**

```bash
git add lib/useSpeechRecognition.ts types/speech.d.ts components/RecordButton.tsx app/page.tsx
git commit -m "feat: Web Speech API integration with live transcription"
```

---

## Task 4: API Route Stub

**Files:**
- Create: `app/api/analyze/route.ts`

**Step 1: Write test for the API route**

Create `__tests__/api/analyze.test.ts`:

```typescript
import { POST } from "@/app/api/analyze/route";
import { NextRequest } from "next/server";

function makeRequest(body: object): NextRequest {
  return new NextRequest("http://localhost:3000/api/analyze", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("/api/analyze", () => {
  it("returns 400 for empty transcript", async () => {
    const req = makeRequest({ transcript: "" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing transcript", async () => {
    const req = makeRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for transcript under 20 characters", async () => {
    const req = makeRequest({ transcript: "short dream" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 200 with valid transcript", async () => {
    const req = makeRequest({
      transcript:
        "I was running through a dark forest and something was chasing me but I could not see what it was",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("title");
    expect(data).toHaveProperty("symbols");
    expect(data).toHaveProperty("connections");
    expect(data).toHaveProperty("overallAssessment");
    expect(data).toHaveProperty("summary");
  });
});
```

**Step 2: Install test dependencies**

Run:
```bash
npm install -D jest @types/jest ts-jest @jest/globals
```

Create `jest.config.ts`:

```typescript
import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default createJestConfig(config);
```

**Step 3: Run test to verify it fails**

Run:
```bash
npx jest __tests__/api/analyze.test.ts --verbose
```

Expected: FAIL — module not found.

**Step 4: Write the API route stub with mock data**

Create `app/api/analyze/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

const MIN_TRANSCRIPT_LENGTH = 20;

const MOCK_RESPONSE = {
  title: "The Dark Forest Chase",
  symbols: [
    {
      id: "forest",
      label: "Dark Forest",
      quote: "running through a dark forest",
      interpretation:
        "Dense, unfamiliar environments in dreams often reflect a period where you may be navigating something that feels unclear or uncertain. Many people experience this kind of imagery when they're working through a situation where the path forward isn't fully visible yet.",
      groundedIn: {
        jungian: "The forest as the unconscious — unexplored psychic territory",
        cognitive:
          "Threat-simulation in low-visibility environments rehearses real-world uncertainty",
        clinical:
          "Dark or enclosed spaces commonly appear during periods of ambiguity or transition",
      },
    },
    {
      id: "pursuer",
      label: "Unseen Pursuer",
      quote: "something was chasing me but I could not see what it was",
      interpretation:
        "Being chased by something you can't identify is one of the most common dream experiences. It often reflects something in waking life that feels pressing or unresolved — not necessarily dangerous, but something your mind is trying to process. The fact that you couldn't see it may suggest the source of the pressure isn't fully clear to you yet.",
      groundedIn: {
        jungian:
          "The shadow — an unintegrated aspect of self that seeks acknowledgment",
        cognitive:
          "Ancestral threat-detection activated by unresolved waking-life stressor",
        clinical:
          "Chase dreams correlate with avoidance patterns and unprocessed stress",
      },
    },
  ],
  connections: [
    {
      from: "forest",
      to: "pursuer",
      relationship: "The forest obscures the source of what feels threatening",
    },
  ],
  overallAssessment: {
    dominantTheme: "Processing uncertainty",
    stressIndicators: [
      "pursuit imagery",
      "low visibility",
      "inability to identify threat",
    ],
    normalization:
      "Chase dreams are among the most universally reported dream experiences. They typically reflect your mind's natural way of processing situations that feel urgent or unresolved — this is a very normal response.",
    strengthsNote:
      "The fact that you were actively running — not frozen — may suggest a strong instinct to engage with challenges rather than shut down when things feel uncertain.",
    gentleInquiry:
      "You might find it worth reflecting on whether there's something in your life right now that feels pressing but hard to pin down.",
    clinicalNote:
      "No indicators of acute distress. This dream reflects common stress-processing patterns.",
  },
  summary:
    "Your dream centers on navigating uncertainty — moving through something you can't fully see, with a sense of urgency you can't fully identify. All three frameworks point to your mind actively processing a situation that feels unresolved. This is a very common and healthy pattern.",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transcript } = body;

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    if (transcript.trim().length < MIN_TRANSCRIPT_LENGTH) {
      return NextResponse.json(
        {
          error:
            "Please describe your dream in more detail — richer detail means deeper analysis.",
        },
        { status: 400 }
      );
    }

    // TODO: Task 5 — replace with real Claude Haiku call
    return NextResponse.json(MOCK_RESPONSE);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
```

**Step 5: Run tests to verify they pass**

Run:
```bash
npx jest __tests__/api/analyze.test.ts --verbose
```

Expected: All 4 tests PASS.

**Step 6: Commit**

```bash
git add app/api/analyze/route.ts __tests__/api/analyze.test.ts jest.config.ts
git commit -m "feat: /api/analyze route stub with mock data and input validation"
```

---

## Task 5: Claude Haiku Integration

**Files:**
- Create: `lib/systemPrompt.ts`
- Modify: `app/api/analyze/route.ts` (replace mock with real Claude call)

**Step 1: Install Anthropic SDK**

Run:
```bash
npm install @anthropic-ai/sdk
```

**Step 2: Set API key environment variable**

Create `.env.local`:

```
ANTHROPIC_API_KEY=your-key-here
```

Verify `.env.local` is in `.gitignore` (Next.js scaffold includes it by default).

**Step 3: Write the system prompt**

Create `lib/systemPrompt.ts`:

```typescript
export const DREAM_ANALYSIS_SYSTEM_PROMPT = `You are DreamScope, a dream analysis system built by an MSc Psychology student. You analyze dreams through three established psychological frameworks, then synthesize your findings into plain-English interpretations using trauma-informed language.

## Your Frameworks
1. **Jungian** — archetypes, shadow self, collective unconscious, individuation
2. **Cognitive/Neuroscience** — threat simulation theory, memory consolidation, emotional regulation
3. **Clinical** — stress indicators, anxiety markers, trauma processing, recurring patterns

## Output Rules

### Trauma-Informed Language (MANDATORY)
- Use invitational, tentative language: "may," "can," "sometimes," "often"
- NEVER use definitive diagnostic language like "you are anxious" or "this reveals your fear of"
- ALWAYS normalize first: "this is a very common dream experience" before any interpretation
- Find strengths: what does the dream say about the dreamer's resilience, awareness, or processing?
- Frame gently: "you might find it helpful to reflect on..." not "you need to address..."
- NEVER pathologize normal experiences
- NEVER imply the dreamer is broken, disordered, or traumatized

### Language Substitutions
- Instead of "You are anxious about..." → "This may reflect a sense of uncertainty about..."
- Instead of "reveals fear of abandonment" → "sometimes appears when someone is navigating feelings around connection and loss"
- Instead of "indicates unresolved trauma" → "can emerge during periods of processing difficult experiences"
- Instead of "You have control issues" → "There may be a need for safety or predictability showing up here"

### Symbol Extraction
- Extract 3-6 key symbols from the dream
- Each symbol gets ONE unified interpretation (synthesize all 3 frameworks into plain English)
- Each symbol also gets short "groundedIn" citations for each framework (1 sentence each)
- Quote the dreamer's own words for each symbol

### Connections
- Identify meaningful relationships between symbols
- Express as plain-English descriptions of how symbols relate

### Overall Assessment
- dominantTheme: 2-4 word theme label
- stressIndicators: array of brief indicators (or empty if dream is positive)
- normalization: ALWAYS present, ALWAYS reassuring. "Dreams like this are very common..."
- strengthsNote: Find something positive about the dreamer from their dream
- gentleInquiry: An open invitation to reflect, not a directive
- clinicalNote: Brief professional-sounding note. Default to "No indicators of acute distress" unless dream content is genuinely concerning

## Response Format
Respond ONLY with valid JSON matching this exact schema:

{
  "title": "A Short Evocative Title",
  "symbols": [
    {
      "id": "snake_id",
      "label": "Display Label",
      "quote": "exact words from the dream",
      "interpretation": "Plain-English synthesis of all 3 frameworks. Trauma-informed. 2-3 sentences.",
      "groundedIn": {
        "jungian": "One sentence",
        "cognitive": "One sentence",
        "clinical": "One sentence"
      }
    }
  ],
  "connections": [
    {
      "from": "symbol_id",
      "to": "symbol_id",
      "relationship": "How these symbols relate"
    }
  ],
  "overallAssessment": {
    "dominantTheme": "2-4 word theme",
    "stressIndicators": ["indicator1", "indicator2"],
    "normalization": "Reassuring normalization statement",
    "strengthsNote": "Positive observation about the dreamer",
    "gentleInquiry": "Open reflective question",
    "clinicalNote": "Professional assessment note"
  },
  "summary": "2-3 sentence synthesis of the entire dream's meaning. Trauma-informed."
}`;
```

**Step 4: Wire Claude into the API route**

Update `app/api/analyze/route.ts` — replace the mock response with a real Claude call:

```typescript
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { DREAM_ANALYSIS_SYSTEM_PROMPT } from "@/lib/systemPrompt";

const MIN_TRANSCRIPT_LENGTH = 20;
const MAX_TRANSCRIPT_LENGTH = 5000;

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transcript } = body;

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    const trimmed = transcript.trim();

    if (trimmed.length < MIN_TRANSCRIPT_LENGTH) {
      return NextResponse.json(
        {
          error:
            "Please describe your dream in more detail — richer detail means deeper analysis.",
        },
        { status: 400 }
      );
    }

    if (trimmed.length > MAX_TRANSCRIPT_LENGTH) {
      return NextResponse.json(
        {
          error:
            "Dream description is too long. Please keep it under 5000 characters.",
        },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-latest",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Analyze this dream:\n\n${trimmed}`,
        },
      ],
      system: DREAM_ANALYSIS_SYSTEM_PROMPT,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected response from analysis engine" },
        { status: 500 }
      );
    }

    try {
      const analysis = JSON.parse(content.text);
      return NextResponse.json(analysis);
    } catch {
      return NextResponse.json(
        {
          error:
            "We couldn't analyze this dream — try describing it differently.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
```

**Step 5: Test manually with curl**

Run dev server, then:
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"transcript": "I was running through a dark forest and something was chasing me but I could not see what it was"}'
```

Expected: Valid JSON response with symbols, connections, overallAssessment, summary.

**Step 6: Commit**

```bash
git add lib/systemPrompt.ts app/api/analyze/route.ts .env.local
git commit -m "feat: Claude Haiku integration with trauma-informed system prompt"
```

---

## Task 6: Wire Frontend to API

**Files:**
- Create: `lib/types.ts`
- Modify: `app/page.tsx` (add analysis state, loading, results flow)
- Create: `components/LoadingAnimation.tsx`

**Step 1: Define TypeScript types**

Create `lib/types.ts`:

```typescript
export interface GroundedIn {
  jungian: string;
  cognitive: string;
  clinical: string;
}

export interface DreamSymbol {
  id: string;
  label: string;
  quote: string;
  interpretation: string;
  groundedIn: GroundedIn;
}

export interface SymbolConnection {
  from: string;
  to: string;
  relationship: string;
}

export interface OverallAssessment {
  dominantTheme: string;
  stressIndicators: string[];
  normalization: string;
  strengthsNote: string;
  gentleInquiry: string;
  clinicalNote: string;
}

export interface DreamAnalysis {
  title: string;
  symbols: DreamSymbol[];
  connections: SymbolConnection[];
  overallAssessment: OverallAssessment;
  summary: string;
}
```

**Step 2: Create loading animation**

Create `components/LoadingAnimation.tsx`:

```tsx
export default function LoadingAnimation() {
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
      <p className="mt-8 text-dream-muted text-sm animate-pulse">
        Analyzing through 3 psychological frameworks...
      </p>
    </div>
  );
}
```

**Step 3: Update page.tsx with analysis flow**

Add to `app/page.tsx`:
- `isLoading` state
- `analysis` state (type: `DreamAnalysis | null`)
- `error` state
- `analyzeDream` async function that POSTs to `/api/analyze`
- Wire "Analyze Dream" button to `analyzeDream`
- Show `LoadingAnimation` when loading
- Show results when analysis is available (results components built in later tasks)
- Show error messages

**Step 4: Verify end-to-end flow**

Run dev server. Type/paste a dream, click Analyze. Verify loading animation shows, then results JSON appears (raw for now — visual components in Tasks 7-9).

**Step 5: Commit**

```bash
git add lib/types.ts components/LoadingAnimation.tsx app/page.tsx
git commit -m "feat: wire frontend to /api/analyze with loading state"
```

---

## Task 7: Dream Map (ReactFlow)

**Files:**
- Create: `components/DreamMap.tsx`
- Modify: `app/page.tsx` (render DreamMap in results)

**Step 1: Install ReactFlow**

Run:
```bash
npm install @xyflow/react
```

**Step 2: Build the DreamMap component**

Create `components/DreamMap.tsx`:

```tsx
"use client";

import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DreamSymbol, SymbolConnection } from "@/lib/types";

interface DreamMapProps {
  symbols: DreamSymbol[];
  connections: SymbolConnection[];
}

function buildNodes(symbols: DreamSymbol[]): Node[] {
  const angleStep = (2 * Math.PI) / symbols.length;
  const radius = 200;
  const centerX = 400;
  const centerY = 300;

  return symbols.map((symbol, i) => ({
    id: symbol.id,
    position: {
      x: centerX + radius * Math.cos(angleStep * i - Math.PI / 2),
      y: centerY + radius * Math.sin(angleStep * i - Math.PI / 2),
    },
    data: {
      label: (
        <div className="text-center px-2">
          <div className="font-semibold text-dream-text text-sm">
            {symbol.label}
          </div>
          <div className="text-dream-muted text-xs mt-1 max-w-[180px] leading-snug">
            {symbol.interpretation.split(".")[0]}.
          </div>
        </div>
      ),
    },
    style: {
      background: "#12121f",
      border: "2px solid #8b5cf6",
      borderRadius: "16px",
      padding: "12px",
      width: 220,
    },
  }));
}

function buildEdges(connections: SymbolConnection[]): Edge[] {
  return connections.map((conn, i) => ({
    id: `edge-${i}`,
    source: conn.from,
    target: conn.to,
    label: conn.relationship,
    style: { stroke: "#64748b" },
    labelStyle: {
      fill: "#64748b",
      fontSize: 11,
    },
    labelBgStyle: {
      fill: "#0a0a12",
    },
    type: "default",
  }));
}

export default function DreamMap({ symbols, connections }: DreamMapProps) {
  const nodes = buildNodes(symbols);
  const edges = buildEdges(connections);

  return (
    <div className="w-full h-[500px] rounded-xl border border-dream-muted/20 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e1e2f" gap={20} />
        <Controls
          style={{
            background: "#12121f",
            borderColor: "#64748b33",
          }}
        />
      </ReactFlow>
    </div>
  );
}
```

**Step 3: Render DreamMap in results section of page.tsx**

Add to the results section of `app/page.tsx`:

```tsx
{analysis && (
  <div className="mt-12 w-full">
    <h2 className="text-2xl font-bold mb-6">{analysis.title}</h2>
    <DreamMap
      symbols={analysis.symbols}
      connections={analysis.connections}
    />
  </div>
)}
```

**Step 4: Verify dream map renders**

Run dev server. Analyze a dream. Verify nodes appear in a circle with edges connecting them. Verify text is readable on dark background.

**Step 5: Commit**

```bash
git add components/DreamMap.tsx app/page.tsx
git commit -m "feat: ReactFlow dream map with symbol nodes and connections"
```

---

## Task 8: Symbol Cards

**Files:**
- Create: `components/SymbolCard.tsx`
- Modify: `app/page.tsx` (render cards below map)

**Step 1: Build SymbolCard component**

Create `components/SymbolCard.tsx`:

```tsx
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
```

**Step 2: Render cards in page.tsx**

Add below the DreamMap in the results section:

```tsx
<div className="mt-8 space-y-4">
  <h3 className="text-lg font-semibold text-dream-muted">Symbols</h3>
  {analysis.symbols.map((symbol) => (
    <SymbolCard key={symbol.id} symbol={symbol} />
  ))}
</div>
```

**Step 3: Verify cards render and expand**

Run dev server. Analyze a dream. Verify symbol cards appear below the map. Click to expand — verify interpretation and grounded-in citations appear.

**Step 4: Commit**

```bash
git add components/SymbolCard.tsx app/page.tsx
git commit -m "feat: expandable symbol cards with framework citations"
```

---

## Task 9: Overall Assessment Panel

**Files:**
- Create: `components/AssessmentPanel.tsx`
- Modify: `app/page.tsx` (render panel below cards)

**Step 1: Build AssessmentPanel**

Create `components/AssessmentPanel.tsx`:

```tsx
import { OverallAssessment } from "@/lib/types";

interface AssessmentPanelProps {
  assessment: OverallAssessment;
  summary: string;
}

export default function AssessmentPanel({
  assessment,
  summary,
}: AssessmentPanelProps) {
  return (
    <div className="bg-dream-surface border-l-4 border-dream-clinical rounded-r-xl p-6 space-y-5">
      <div>
        <p className="text-dream-muted text-xs uppercase tracking-wider mb-1">
          Dominant Theme
        </p>
        <p className="text-xl font-semibold text-dream-text">
          {assessment.dominantTheme}
        </p>
      </div>

      <p className="text-dream-text leading-relaxed">{summary}</p>

      {assessment.stressIndicators.length > 0 && (
        <div>
          <p className="text-dream-muted text-xs uppercase tracking-wider mb-2">
            Indicators
          </p>
          <div className="flex flex-wrap gap-2">
            {assessment.stressIndicators.map((indicator) => (
              <span
                key={indicator}
                className="px-3 py-1 bg-dream-bg rounded-full text-xs text-dream-muted border border-dream-muted/20"
              >
                {indicator}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-dream-bg/50 rounded-lg p-4 space-y-3">
        <p className="text-dream-text text-sm leading-relaxed">
          {assessment.normalization}
        </p>
        <p className="text-dream-text text-sm leading-relaxed">
          {assessment.strengthsNote}
        </p>
        <p className="text-dream-primary text-sm leading-relaxed italic">
          {assessment.gentleInquiry}
        </p>
      </div>

      <p className="text-dream-muted text-xs italic">
        {assessment.clinicalNote}
      </p>
    </div>
  );
}
```

**Step 2: Render in page.tsx**

Add below the symbol cards:

```tsx
<div className="mt-8">
  <h3 className="text-lg font-semibold text-dream-muted mb-4">
    Assessment
  </h3>
  <AssessmentPanel
    assessment={analysis.overallAssessment}
    summary={analysis.summary}
  />
</div>
```

Also add an "Analyze another dream" button below the assessment:

```tsx
<button
  onClick={() => {
    setAnalysis(null);
    setManualTranscript("");
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }}
  className="mt-8 px-6 py-3 border border-dream-primary text-dream-primary rounded-xl hover:bg-dream-primary/10 transition-colors"
>
  Analyze another dream
</button>
```

**Step 3: Verify full results flow**

Run dev server. Analyze a dream. Verify: loading animation → dream map → symbol cards → assessment panel → "analyze another" button. Full flow works end-to-end.

**Step 4: Commit**

```bash
git add components/AssessmentPanel.tsx app/page.tsx
git commit -m "feat: overall assessment panel with trauma-informed display"
```

---

## Task 10: Rate Limiting

**Files:**
- Modify: `app/api/analyze/route.ts` (add rate limiting)

**Step 1: Evaluate rate limiting approach**

Two options for Vercel serverless:
- **Vercel KV** — proper distributed rate limiting, requires Vercel KV setup
- **Upstash Redis via `@upstash/ratelimit`** — works identically, free tier available

If Vercel KV is not set up, use a simpler approach: header-based rate limiting with `x-forwarded-for` and a lightweight in-API check using Upstash, OR skip rate limiting for the hackathon demo and add a TODO.

**Step 2: Install rate limiting package**

Run:
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Step 3: Add rate limiting to the API route**

Add to the top of `app/api/analyze/route.ts`:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only enable rate limiting if env vars are set (skip for local dev)
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, "1 h"),
        analytics: false,
      })
    : null;
```

Add rate limit check at the beginning of the POST handler, before transcript validation:

```typescript
if (ratelimit) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "You've reached the analysis limit. Please try again later." },
      { status: 429 }
    );
  }
}
```

Add to `.env.local`:
```
UPSTASH_REDIS_REST_URL=your-url-here
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

**Step 4: Commit**

```bash
git add app/api/analyze/route.ts
git commit -m "feat: rate limiting via Upstash Redis (10 req/IP/hour)"
```

---

## Task 11: Mobile Polish & Error States

**Files:**
- Modify: `app/page.tsx` (error display, mobile tweaks)
- Modify: various components (responsive fixes)

**Step 1: Add error display to page.tsx**

Show error messages above the Analyze button when API returns an error. Style as a red-bordered card.

```tsx
{error && (
  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
    {error}
  </div>
)}
```

**Step 2: Mobile responsive pass**

- Verify headline scales: `text-4xl md:text-6xl`
- Verify dream map is scrollable on mobile (ReactFlow handles this)
- Verify symbol cards don't overflow
- Verify record button is thumb-reachable (centered, large enough)
- Test at 375px width (iPhone SE)

**Step 3: Add OG meta tags**

Update `app/layout.tsx` metadata:

```typescript
export const metadata: Metadata = {
  title: "DreamScope — Speak Your Dream",
  description:
    "Speak your dream. See what it means — through science, not mysticism. AI-powered dream analysis grounded in real psychological frameworks.",
  openGraph: {
    title: "DreamScope — What did you dream last night?",
    description:
      "AI-powered dream analysis using Jungian, Cognitive, and Clinical psychology. Voice-first. Trauma-informed. Built by an MSc Psychology student.",
    type: "website",
    siteName: "DreamScope",
  },
  twitter: {
    card: "summary_large_image",
    title: "DreamScope — Speak Your Dream",
    description:
      "AI-powered dream analysis grounded in real psychological frameworks.",
  },
};
```

**Step 4: Commit**

```bash
git add app/page.tsx app/layout.tsx
git commit -m "feat: error states, mobile polish, OG meta tags"
```

---

## Task 12: Deploy to Vercel

**Step 1: Deploy**

Run:
```bash
vercel --prod
```

**Step 2: Set environment variables in Vercel dashboard**

- `ANTHROPIC_API_KEY`
- `UPSTASH_REDIS_REST_URL` (if using rate limiting)
- `UPSTASH_REDIS_REST_TOKEN` (if using rate limiting)

**Step 3: Verify deployment**

Run:
```bash
vercel ls --limit 1
```

Open the production URL. Test the full flow: record/type a dream → analyze → see results.

**Step 4: Commit deployment config if any**

```bash
git add -A && git commit -m "chore: deploy to Vercel"
```

---

## Task 13: Demo Video

**Step 1: Script the demo**

```
0:00-0:15  Hook: "What if your dreams actually meant something — and you could find out in 30 seconds?"
0:15-0:30  Intro: "This is DreamScope. I built it this weekend. It uses real psychology, not mysticism."
0:30-1:00  Demo: Tap record, describe a dream live, show transcript appearing
1:00-1:40  Results: Show dream map, expand symbol cards, highlight trauma-informed language and framework citations
1:40-1:55  Credibility: "I'm an MSc Psychology student and forensics expert. The analysis uses Jungian, Cognitive, and Clinical frameworks — all in trauma-informed language."
1:55-2:00  CTA: "Try it at [URL]. DreamScope."
```

**Step 2: Record**

Use screen recording (QuickTime or Loom). Record screen first, voiceover second if needed.

**Step 3: Submit to Skool #Submissions channel**

Post with submission template from design doc.
