/**
 * @jest-environment node
 */
import { checkRateLimit } from "@/lib/rateLimit";

jest.mock("@upstash/ratelimit");
jest.mock("@upstash/redis");

describe("checkRateLimit", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns allowed when no Redis env vars are set", async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const { checkRateLimit: freshCheck } = require("@/lib/rateLimit");
    const result = await freshCheck("127.0.0.1");
    expect(result.allowed).toBe(true);
  });

  it("returns not allowed when rate limit is exceeded", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://fake.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "fake-token";

    const { Ratelimit } = require("@upstash/ratelimit");
    Ratelimit.mockImplementation(() => ({
      limit: jest.fn().mockResolvedValue({ success: false }),
    }));
    Ratelimit.slidingWindow = jest.fn();

    const { Redis } = require("@upstash/redis");
    Redis.fromEnv = jest.fn().mockReturnValue({});

    const { checkRateLimit: freshCheck } = require("@/lib/rateLimit");
    const result = await freshCheck("192.168.1.1");
    expect(result.allowed).toBe(false);
  });

  it("returns allowed when under rate limit", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://fake.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "fake-token";

    const { Ratelimit } = require("@upstash/ratelimit");
    Ratelimit.mockImplementation(() => ({
      limit: jest.fn().mockResolvedValue({ success: true }),
    }));
    Ratelimit.slidingWindow = jest.fn();

    const { Redis } = require("@upstash/redis");
    Redis.fromEnv = jest.fn().mockReturnValue({});

    const { checkRateLimit: freshCheck } = require("@/lib/rateLimit");
    const result = await freshCheck("192.168.1.1");
    expect(result.allowed).toBe(true);
  });
});
