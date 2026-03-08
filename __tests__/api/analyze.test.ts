/**
 * @jest-environment node
 */
import { POST } from "@/app/api/analyze/route";
import { NextRequest } from "next/server";

jest.mock("@/lib/rateLimit", () => ({
  checkRateLimit: jest.fn().mockResolvedValue({ allowed: true }),
}));

jest.mock("@/lib/analyzeDream", () => ({
  analyzeDream: jest.fn().mockResolvedValue({
    title: "Mock Dream",
    symbols: [],
    connections: [],
    overallAssessment: {
      dominantTheme: "Test",
      stressIndicators: [],
      normalization: "Normal",
      strengthsNote: "Strong",
      gentleInquiry: "Reflect",
      clinicalNote: "Fine",
    },
    summary: "Mock summary",
  }),
}));

function makeRequest(body: object): NextRequest {
  return new NextRequest("http://localhost:3000/api/analyze", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("/api/analyze", () => {
  it("returns 400 for empty transcript", async () => {
    const res = await POST(makeRequest({ transcript: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing transcript", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 400 for transcript under 20 characters", async () => {
    const res = await POST(makeRequest({ transcript: "short dream" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for transcript over 5000 characters", async () => {
    const res = await POST(makeRequest({ transcript: "a".repeat(5001) }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/too long/i);
  });

  it("returns 200 with valid transcript", async () => {
    const res = await POST(
      makeRequest({
        transcript:
          "I was running through a dark forest and something was chasing me but I could not see what it was",
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("title");
    expect(data).toHaveProperty("symbols");
    expect(data).toHaveProperty("connections");
    expect(data).toHaveProperty("overallAssessment");
    expect(data).toHaveProperty("summary");
  });

  it("returns 429 when rate limited", async () => {
    const { checkRateLimit } = require("@/lib/rateLimit");
    checkRateLimit.mockResolvedValueOnce({ allowed: false });

    const res = await POST(
      makeRequest({
        transcript:
          "I was running through a dark forest and something was chasing me but I could not see what it was",
      })
    );
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toMatch(/limit/i);
  });

  it("returns 500 when analysis fails", async () => {
    const { analyzeDream } = require("@/lib/analyzeDream");
    analyzeDream.mockRejectedValueOnce(new Error("API error"));

    const res = await POST(
      makeRequest({
        transcript:
          "I was running through a dark forest and something was chasing me but I could not see what it was",
      })
    );
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toMatch(/failed/i);
  });
});
