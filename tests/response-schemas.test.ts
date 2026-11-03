import { describe, it, expect } from "vitest";
import {
  healthResponseSchema,
  statusResponseSchema,
  publicConfigSchema,
  verificationRequestResponse,
  verificationCheckResponse,
} from "~/lib/api/schemas";

describe("response schema validation", () => {
  it("accepts a well-formed health response", () => {
    const result = healthResponseSchema.safeParse({
      status: "ok",
      uptimeSeconds: 120,
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });

  it("rejects a health response with an invalid status enum", () => {
    const result = healthResponseSchema.safeParse({
      status: "totally_fine",
      uptimeSeconds: 120,
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
    expect(result.success).toBe(false);
  });

  it("accepts a well-formed status response", () => {
    const result = statusResponseSchema.safeParse({
      server: "ok",
      apiIntegration: "not_configured",
      responseTimeMs: null,
      version: "1.0.0",
      uptimeSeconds: 10,
      message: "Integrasi belum dikonfigurasi.",
      timestamp: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });

  it("rejects a public config payload that smuggles a secret-shaped field but ignores extras safely", () => {
    const result = publicConfigSchema.safeParse({
      appName: "AM Premium Creator",
      version: "1.0.0",
      integrationConfigured: false,
      clientOrigin: "http://localhost:3000",
      apiKey: "should-not-be-here",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect((result.data as Record<string, unknown>).apiKey).toBeUndefined();
    }
  });

  it("verificationRequestResponse enforces the closed status enum", () => {
    const result = verificationRequestResponse.safeParse({
      ok: true,
      status: "definitely_premium_now",
      requestId: "req_1",
      message: "ok",
    });
    expect(result.success).toBe(false);
  });

  it("verificationCheckResponse requires checkedAt", () => {
    const result = verificationCheckResponse.safeParse({
      ok: false,
      status: "not_configured",
      message: "belum dikonfigurasi",
    });
    expect(result.success).toBe(false);
  });
});
