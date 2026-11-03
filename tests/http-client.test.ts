import { describe, it, expect, vi, afterEach } from "vitest";
import { safeFetchJson } from "~/lib/api/http-client";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("safeFetchJson", () => {
  it("returns ok:true with parsed data on a 200 JSON response", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ hello: "world" }), { status: 200 }),
    ) as unknown as typeof fetch;

    const result = await safeFetchJson<{ hello: string }>("https://example.com/api");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.hello).toBe("world");
  });

  it("returns http_error for a non-2xx response", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "nope" }), { status: 500 }),
    ) as unknown as typeof fetch;

    const result = await safeFetchJson("https://example.com/api");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("http_error");
      expect(result.status).toBe(500);
    }
  });

  it("returns invalid_json when body is not JSON", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response("<html>not json</html>", { status: 200 }),
    ) as unknown as typeof fetch;

    const result = await safeFetchJson("https://example.com/api");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("invalid_json");
  });

  it("returns network_error when fetch rejects", async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError("fetch failed")) as unknown as typeof fetch;

    const result = await safeFetchJson("https://example.com/api");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("network_error");
  });

  it("returns timeout when the request exceeds timeoutMs", async () => {
    global.fetch = vi.fn().mockImplementation(
      (_url: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            const err = new Error("aborted");
            err.name = "AbortError";
            reject(err);
          });
        }),
    ) as unknown as typeof fetch;

    const result = await safeFetchJson("https://example.com/api", { timeoutMs: 10 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("timeout");
  });
});
