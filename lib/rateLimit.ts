import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRateLimiter() {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      analytics: false,
    });
  }
  return null;
}

export async function checkRateLimit(
  ip: string
): Promise<{ allowed: boolean }> {
  const limiter = createRateLimiter();
  if (!limiter) {
    return { allowed: true };
  }

  const { success } = await limiter.limit(ip);
  return { allowed: success };
}
