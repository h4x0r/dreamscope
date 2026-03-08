import Anthropic from "@anthropic-ai/sdk";
import { DREAM_ANALYSIS_SYSTEM_PROMPT } from "./systemPrompt";
import { DreamAnalysis } from "./types";

export async function analyzeDream(transcript: string): Promise<DreamAnalysis> {
  const anthropic = new Anthropic();

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 4096,
    system: DREAM_ANALYSIS_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analyze this dream:\n\n${transcript}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response from analysis engine");
  }

  const analysis: DreamAnalysis = JSON.parse(content.text);
  return analysis;
}
