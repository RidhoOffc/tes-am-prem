import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

describe("verification adapter (unconfigured state)", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.AM_API_BASE_URL;
    delete process.env.AM_API_KEY;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("requestVerification reports not_configured when env vars are empty", async () => {
    const { requestVerification } = await import("~/lib/api/adapter");
    const result = await requestVerification("user@example.com");
    expect(result.ok).toBe(false);
    expect(result.status).toBe("not_configured");
    expect(result.requestId).toBeNull();
  });

  it("checkVerification reports not_configured when env vars are empty", async () => {
    const { checkVerification } = await import("~/lib/api/adapter");
    const result = await checkVerification("req_123");
    expect(result.ok).toBe(false);
    expect(result.status).toBe("not_configured");
  });

  it("never claims success when unconfigured, regardless of input", async () => {
    const { requestVerification } = await import("~/lib/api/adapter");
    const inputs = ["a@b.com", "weird+tag@domain.co", "x@y.z"];
    for (const email of inputs) {
      const result = await requestVerification(email);
      expect(result.ok).toBe(false);
      expect(result.status).not.toBe("verified");
    }
  });

  it("probeUpstream reports unreachable when no base URL is set", async () => {
    const { probeUpstream } = await import("~/lib/api/adapter");
    const probe = await probeUpstream();
    expect(probe.reachable).toBe(false);
    expect(probe.responseTimeMs).toBeNull();
  });
});

describe("env.getApiEnv", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("is not configured when AM_API_BASE_URL and AM_API_KEY are both empty", async () => {
    delete process.env.AM_API_BASE_URL;
    delete process.env.AM_API_KEY;
    const { getApiEnv } = await import("~/lib/api/env");
    expect(getApiEnv().isConfigured).toBe(false);
  });

  it("is not configured when only one of the two vars is set", async () => {
    process.env.AM_API_BASE_URL = "https://api.example.com";
    delete process.env.AM_API_KEY;
    const { getApiEnv } = await import("~/lib/api/env");
    expect(getApiEnv().isConfigured).toBe(false);
  });

  it("refuses a non-HTTPS base URL even if a key is present", async () => {
    process.env.AM_API_BASE_URL = "http://insecure.example.com";
    process.env.AM_API_KEY = "secret";
    const { getApiEnv } = await import("~/lib/api/env");
    const env = getApiEnv();
    expect(env.isConfigured).toBe(false);
    expect(env.baseUrl).toBeNull();
  });

  it("is configured when both vars are present and base URL is https", async () => {
    process.env.AM_API_BASE_URL = "https://api.example.com";
    process.env.AM_API_KEY = "secret";
    const { getApiEnv } = await import("~/lib/api/env");
    expect(getApiEnv().isConfigured).toBe(true);
  });
});
