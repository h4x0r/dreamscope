import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function GET() {
  const anthropic = new Anthropic();
  const models = [
    "claude-haiku-4-5-20250514",
    "claude-haiku-4-5",
    "claude-3-5-haiku-latest",
    "claude-3-5-haiku-20241022",
    "claude-3-haiku-20240307",
    "claude-sonnet-4-20250514",
  ];

  const results: { model: string; status: string; error?: string }[] = [];

  for (const model of models) {
    try {
      await anthropic.messages.create({
        model,
        max_tokens: 10,
        messages: [{ role: "user", content: "Say hi" }],
      });
      results.push({ model, status: "ok" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      results.push({ model, status: "error", error: msg.substring(0, 200) });
    }
  }

  return NextResponse.json({
    keySet: !!process.env.ANTHROPIC_API_KEY,
    keyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 12),
    results,
  });
}
