# DreamScope — Voice-First Dream Analysis

**Hackathon:** Skool AI Hackathon (Mar 6-8, 2026)
**Builder:** Albert Hui (Solo)
**Stack:** Next.js 14, Tailwind CSS, ReactFlow, Vercel, Claude API (Haiku)

---

## Concept

Speak your dream. Get a visual symbol map and psychological analysis grounded in real academic frameworks — not mystical nonsense.

**One-liner:** "Speak your dream. See what it means — through science, not mysticism."

**Who it's for:** Anyone who wakes from a vivid dream and wants to understand it. Voice input catches them in the moment, before the dream fades.

**Problem:** Every dream interpretation app is either woo-woo astrology nonsense or a generic ChatGPT wrapper. No tool applies real psychological frameworks or presents results visually.

**Solution:** A voice-first dream analyzer that transcribes your spoken dream in-browser, sends the transcript to Claude for analysis through three psychological frameworks (Jungian, Cognitive, Clinical), and renders the results as an interactive dream map with grounded, trauma-informed interpretations.

**Differentiator:** Real psychological frameworks (Jungian, Cognitive, Clinical) synthesized into plain-English trauma-informed language, built by an MSc Psychology student. Visual dream map output — not a wall of text.

---

## Architecture

```
Browser (mic) ──> Web Speech API (transcription, on-device)
                        |
                        v
                  POST /api/analyze  { transcript: string }
                        |
                        v
                  Next.js API Route (Vercel)
                        |
                        v
                  Claude Haiku (system prompt: 3-framework dream analysis)
                        |
                        v
                  Structured JSON response
                        |
                        v
                  React frontend renders:
                    - Dream map (ReactFlow node graph)
                    - Unified interpretations with academic grounding
                    - Overall assessment (trauma-informed)
```

No database. No auth. Stateless analysis.

**Privacy:** Audio is processed entirely on-device via Web Speech API. Only the text transcript is sent for analysis. Audio never leaves the browser.

---

## Pages / Routes

### `/` — Landing + Analyzer (single page app)

**State 1: Landing (above the fold)**
- Headline: "What did you dream last night?"
- Subhead: "Speak your dream. See what it means — through science, not mysticism."
- Large circular Record button (pulsing subtle purple glow)
- Below: "Or type it out" — expandable textarea as fallback
- Below that: 3 clickable example dreams as pills

**State 2: Recording**
- Record button transforms into a live waveform visualizer (CSS animation)
- Real-time transcript appears below as the user speaks
- "Stop & Analyze" button appears once speech is detected

**State 3: Analyzing**
- Transcript fades to 50% opacity
- Center-screen animation: stylized neural pulse (CSS keyframes)
- Text: "Analyzing through 3 psychological frameworks..."

**State 4: Results (scrollable sections)**

- **Dream Map (hero section):** ReactFlow canvas, full width. Symbols as rounded nodes, edges labeled with relationships. Clean, no toggles — unified interpretation on each node.
- **Symbol Cards:** One per symbol. User's quote in italics, unified plain-English interpretation, "Grounded in" section with framework citations in muted text.
- **Overall Assessment:** Clinical-style panel. Dominant theme, normalization statement, strengths note, gentle inquiry, clinical note.
- **Footer:** "Analyze another dream" button, disclaimer, attribution.

### `/api/analyze` — API Route

- Accepts POST with `{ transcript: string }`
- Rate limited (10 requests per IP per hour via Vercel KV)
- Calls Claude Haiku with structured system prompt
- Returns JSON with symbols, connections, interpretations, assessment

---

## AI Prompt Design

### Frameworks

The system prompt instructs Claude to analyze through three psychological lenses, then synthesize into unified plain-English output:

1. **Jungian** — archetypes, shadow self, collective unconscious, individuation
2. **Cognitive / Neuroscience** — threat simulation theory, memory consolidation, emotional regulation
3. **Clinical / Diagnostic** — stress indicators, anxiety markers, trauma processing, recurring patterns

The frameworks exist as academic grounding, not as user-facing navigation. The user sees one clear interpretation per symbol with framework citations below.

### Trauma-Informed Language

All output MUST follow trauma-informed principles:

| Principle | Implementation |
|-----------|---------------|
| Safety | Never make the user feel exposed or diagnosed. Report feels like a gentle mirror, not a spotlight. |
| Choice | Invitational language ("you might consider," "some people find it helpful to"). Never directive. |
| Collaboration | "This could mean X — does that resonate?" tone. Not "this means X." |
| Normalization | "This is a common dream theme" before analysis. User should never feel broken. |
| Strengths-based | Note what the dream says about resilience, self-awareness, or processing capacity. Not just problems. |

**Language rules:**

| Instead of | Use |
|------------|-----|
| "You are anxious about..." | "This may reflect a sense of uncertainty about..." |
| "Your dream reveals fear of abandonment" | "This imagery sometimes appears when someone is navigating feelings around connection and loss" |
| "This indicates unresolved trauma" | "This pattern can emerge during periods of processing difficult experiences" |
| "You have control issues" | "There may be a need for safety or predictability showing up here" |
| Definitive diagnosis language | Tentative, invitational language ("may," "can," "sometimes") |
| Pathologizing normal experiences | Normalizing ("many people experience this when...") |

### Output Schema

```json
{
  "title": "The Collapsing Bridge",
  "symbols": [
    {
      "id": "bridge",
      "label": "Bridge",
      "quote": "I was crossing this huge bridge over dark water",
      "interpretation": "This represents a transition you're navigating — something uncertain that you can't fully see the other side of. The bridge collapsing suggests the path forward feels unstable.",
      "groundedIn": {
        "jungian": "Threshold between conscious and unconscious self",
        "cognitive": "Threat-simulation of unstable real-life transition",
        "clinical": "Correlates with decision anxiety in transition periods"
      }
    }
  ],
  "connections": [
    {
      "from": "bridge",
      "to": "dark_water",
      "relationship": "The bridge suspends you above what you're avoiding"
    }
  ],
  "overallAssessment": {
    "dominantTheme": "Navigating change and uncertainty",
    "stressIndicators": ["instability imagery", "limited visibility", "loss of footing"],
    "normalization": "Dreams like this are very common during times of transition — they often reflect your mind's natural way of processing change.",
    "strengthsNote": "The fact that you were actively crossing the bridge — not frozen or turning back — may suggest a willingness to move through uncertainty even when it feels unstable.",
    "gentleInquiry": "You might find it helpful to reflect on whether there's a decision or transition in your life that feels unresolved right now.",
    "clinicalNote": "No indicators of acute distress. This dream reflects a normal and healthy processing pattern."
  },
  "summary": "Your dream centers on navigating an unstable transition over something you can't fully see or understand. All three frameworks converge: you're processing a major change and your mind is rehearsing the uncertainty."
}
```

---

## Visual Design

**Theme:** Dark, cerebral, clinical — not dreamy/mystical. MRI scan aesthetic, not starry-night wallpaper.

**Palette:**

| Role | Color | Usage |
|------|-------|-------|
| Background | `#0a0a12` | Near-black with blue undertone |
| Surface | `#12121f` | Cards, panels |
| Primary | `#8b5cf6` | Purple — dream/subconscious association |
| Jungian citation | `#f59e0b` | Amber |
| Cognitive citation | `#3b82f6` | Blue |
| Clinical citation | `#10b981` | Green |
| Text | `#e2e8f0` | Light gray |
| Muted | `#64748b` | Secondary text, framework citations |

**Typography:** Inter or system font. Clean, clinical.

**Key visual elements:**
- Circular Record button with pulsing purple glow
- CSS waveform animation during recording
- ReactFlow dream map with rounded nodes and labeled edges
- Symbol cards with quoted text and muted framework citations
- Neural pulse loading animation (CSS keyframes)

**Mobile-first:** Record button is thumb-reachable. Dream map horizontally scrollable. Symbol cards stack vertically.

---

## Pre-loaded Example Dreams

3 clickable examples so judges can instantly see the analysis:

1. **Chase dream** — being pursued through unfamiliar streets. Classic anxiety indicator, rich in symbol extraction.
2. **Teeth falling out** — universally common, multiple valid interpretations across all three frameworks.
3. **Flying dream** — positive experience. Demonstrates the tool doesn't pathologize everything.

---

## Build Sequence

### Phase 1: Skeleton
- `npx create-next-app` with Tailwind + App Router
- Landing page layout: headline, record button, textarea fallback
- `/api/analyze` route stub returning mock JSON
- Deploy to Vercel (get live link early)

### Phase 2: Voice Input
- Web Speech API integration with browser support detection
- Live transcript display during recording
- "Review your transcript" step before submission (user can edit)
- Textarea fallback for unsupported browsers
- 3-minute recording cap, 5000-character text cap

### Phase 3: AI Engine
- Write and test the Claude system prompt (3-framework, trauma-informed)
- Implement `/api/analyze` with real Claude Haiku call (JSON mode)
- Rate limiting via Vercel KV (10 requests/IP/hour)
- Input validation: minimum length, non-empty, language check

### Phase 4: Dream Map
- ReactFlow integration
- Symbols as nodes, connections as edges
- Responsive layout (horizontally scrollable on mobile)
- Hard timebox — if not working, fall back to card-based layout

### Phase 5: Results UI
- Symbol cards with unified interpretation and grounded-in citations
- Overall assessment panel (normalization, strengths, gentle inquiry)
- Loading animation (neural pulse)

### Phase 6: Polish
- Pre-loaded example dreams (3)
- Mobile responsive pass
- OG meta tags
- Error states and edge cases
- Disclaimer and attribution footer

### Phase 7: Demo Video
- Script in advance
- Record screen first, voiceover second
- 2-minute target: intro > speak dream > results > explain frameworks > outro

**MVP cutline:** Phase 1-3 (voice > text > analysis in plain text). Submittable without the dream map.

**Wow layer:** Phase 4 (ReactFlow dream map).

---

## Graceful Degradation Plan

What to cut if time runs out (in order):

1. Framework toggle on dream map > just show unified view (already removed from design)
2. Waveform animation during recording > static "Recording..." indicator
3. Symbol card tabs > show all frameworks inline
4. Neural pulse loading animation > simple spinner
5. Dream map entirely > card-based symbol list

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Web Speech API not supported | Users can't record | Textarea fallback always visible. Detect support, show message. |
| ReactFlow takes too long to style | Eats polish time | Hard timebox on Phase 4. Card-based fallback ready. |
| Claude returns malformed JSON | Results page breaks | JSON mode + try/catch + "Try describing differently" fallback. |
| Dream too short | Shallow analysis | Minimum word check. Prompt: "Tell us more — richer detail means deeper analysis." |
| Dream too long | Token limits, timeout | 5000-char cap for text. 3-min cap for voice. |
| Web Speech API gives poor transcript | AI analyzes garbage | Show transcript for user review/edit before submission. |
| Non-English input | Web Speech API struggles | Set `lang="en-US"`. Note: "Currently supports English." |
| Privacy hesitation | Users won't record | Prominent note: "Audio stays on your device. Only text is sent." |
| Rate limit abuse | API cost exposure | Vercel KV rate limiting. Monthly spend cap on Anthropic API key. |
| In-memory rate limiting | Won't work on serverless | Use Vercel KV only. Do not attempt in-memory. |

---

## Anti-Goals

Things DreamScope is **NOT:**

- Not a dream journal (no accounts, no history, no saved dreams)
- Not therapy or a therapy replacement (disclaimer is mandatory)
- Not a dream dictionary (no fixed symbol-to-meaning lookup)
- Not multilingual (English only for hackathon)
- Not an audio storage service (audio never leaves the browser)
- Not diagnostic (never claims to identify disorders or conditions)

---

## Tech Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 14 (App Router) | Fast to scaffold, Vercel deploy |
| Styling | Tailwind CSS | Rapid UI development |
| Graph library | ReactFlow | Most React-native, clean defaults |
| AI Model | Claude 3.5 Haiku | Fast, cheap, reliable JSON output |
| Transcription | Web Speech API | Free, on-device, privacy-preserving |
| Hosting | Vercel | Free tier, instant deploys |
| Rate limiting | Vercel KV | Works with serverless (in-memory does not) |
| Database | None | Stateless — no data stored |
| Auth | None | Public tool, rate limited by IP |

---

## Disclaimer (mandatory, visible on every results page)

> DreamScope applies psychological frameworks for educational insight and personal reflection. It is not therapy, diagnosis, or a substitute for professional support. If your dreams are causing distress, please reach out to a mental health professional.

---

## PR / Brand Angle

**For the hackathon submission:**
"Built by an MSc Psychology student and forensics expert. DreamScope applies real psychological frameworks — Jungian, Cognitive, and Clinical — in trauma-informed language. This isn't AI fortune-telling. It's grounded analysis."

**For social after:**
"I built a voice-first dream analyzer that uses real psychology, not mysticism. Here's what your dreams actually mean — and how I built it in a weekend."
