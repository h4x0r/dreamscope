import { NextRequest, NextResponse } from "next/server";
import { analyzeDream } from "@/lib/analyzeDream";
import { checkRateLimit } from "@/lib/rateLimit";

const MIN_TRANSCRIPT_LENGTH = 20;
const MAX_TRANSCRIPT_LENGTH = 5000;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { allowed } = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "You've reached the analysis limit. Please try again later.",
        },
        { status: 429 }
      );
    }

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

    const analysis = await analyzeDream(trimmed);
    return NextResponse.json(analysis);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Analysis error:", message);
    console.error("ANTHROPIC_API_KEY set:", !!process.env.ANTHROPIC_API_KEY);
    console.error("ANTHROPIC_API_KEY length:", process.env.ANTHROPIC_API_KEY?.length ?? 0);
    return NextResponse.json(
      { error: "Analysis failed. Please try again.", debug: message },
      { status: 500 }
    );
  }
}
