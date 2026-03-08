/**
 * @jest-environment node
 */

import { analyzeDream } from "@/lib/analyzeDream";
import Anthropic from "@anthropic-ai/sdk";

jest.mock("@anthropic-ai/sdk");

const VALID_RESPONSE = {
  title: "Test Dream",
  symbols: [
    {
      id: "test",
      label: "Test Symbol",
      quote: "test quote",
      interpretation: "test interpretation",
      groundedIn: {
        jungian: "jungian note",
        cognitive: "cognitive note",
        clinical: "clinical note",
      },
    },
  ],
  connections: [],
  overallAssessment: {
    dominantTheme: "Test Theme",
    stressIndicators: [],
    normalization: "This is normal",
    strengthsNote: "You are strong",
    gentleInquiry: "Consider reflecting",
    clinicalNote: "No concerns",
  },
  summary: "Test summary",
};

function mockClaudeResponse(content: { type: string; text?: string; id?: string }[]) {
  const mockCreate = jest.fn().mockResolvedValueOnce({ content });
  (Anthropic as jest.MockedClass<typeof Anthropic>).mockImplementation(
    () => ({ messages: { create: mockCreate } }) as unknown as Anthropic
  );
  // Re-import to pick up new mock — but since module is cached, we access the instance directly
  return mockCreate;
}

describe("analyzeDream", () => {
  let mockCreate: jest.Mock;

  beforeEach(() => {
    mockCreate = jest.fn();
    (Anthropic as jest.MockedClass<typeof Anthropic>).mockImplementation(
      () => ({ messages: { create: mockCreate } }) as unknown as Anthropic
    );
  });

  it("returns a valid DreamAnalysis object", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: JSON.stringify(VALID_RESPONSE) }],
    });

    const result = await analyzeDream("I was flying over the ocean at sunset");

    expect(result).toHaveProperty("title", "Test Dream");
    expect(result.symbols).toHaveLength(1);
    expect(result.symbols[0]).toHaveProperty("groundedIn");
    expect(result).toHaveProperty("overallAssessment");
    expect(result).toHaveProperty("summary");
  });

  it("throws on non-text response", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "tool_use", id: "test" }],
    });

    await expect(
      analyzeDream("I was flying over the ocean at sunset")
    ).rejects.toThrow("Unexpected response");
  });

  it("strips markdown code fences from response", async () => {
    const wrapped = "```json\n" + JSON.stringify(VALID_RESPONSE) + "\n```";
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: wrapped }],
    });

    const result = await analyzeDream("I was flying over the ocean at sunset");
    expect(result).toHaveProperty("title", "Test Dream");
  });

  it("throws on invalid JSON response", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: "not valid json {{{" }],
    });

    await expect(
      analyzeDream("I was flying over the ocean at sunset")
    ).rejects.toThrow();
  });
});
