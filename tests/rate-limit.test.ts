import { describe, it, expect, beforeEach, vi } from "vitest";
import { checkRateLimit, __resetRateLimitState } from "~/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    __resetRateLimitState();
    vi.useRealTimers();
  });

  it("allows requests under the limit", () => {
    const key = "test:allow";
    for (let i = 0; i < 3; i++) {
      const result = checkRateLimit({ key, limit: 5, windowMs: 60_000 });
      expect(result.allowed).toBe(true);
    }
  });

  it("blocks requests once the limit is reached", () => {
    const key = "test:block";
    for (let i = 0; i < 5; i++) {
      checkRateLimit({ key, limit: 5, windowMs: 60_000 });
    }
    const result = checkRateLimit({ key, limit: 5, windowMs: 60_000 });
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after the window expires", () => {
    vi.useFakeTimers();
    const key = "test:reset";
    for (let i = 0; i < 5; i++) {
      checkRateLimit({ key, limit: 5, windowMs: 1000 });
    }
    expect(checkRateLimit({ key, limit: 5, windowMs: 1000 }).allowed).toBe(false);

    vi.advanceTimersByTime(1001);

    expect(checkRateLimit({ key, limit: 5, windowMs: 1000 }).allowed).toBe(true);
    vi.useRealTimers();
  });

  it("tracks separate keys independently", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit({ key: "ip-a", limit: 5, windowMs: 60_000 });
    }
    const blockedA = checkRateLimit({ key: "ip-a", limit: 5, windowMs: 60_000 });
    const allowedB = checkRateLimit({ key: "ip-b", limit: 5, windowMs: 60_000 });

    expect(blockedA.allowed).toBe(false);
    expect(allowedB.allowed).toBe(true);
  });
});
