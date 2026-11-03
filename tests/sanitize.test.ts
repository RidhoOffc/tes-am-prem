import { describe, it, expect, vi, afterEach } from "vitest";
import { sanitizePlainText, redactEmail, logRequestEvent } from "~/lib/security/sanitize";

describe("sanitizePlainText", () => {
  it("strips control characters", () => {
    expect(sanitizePlainText("hello\u0000world")).toBe("helloworld");
  });

  it("trims whitespace", () => {
    expect(sanitizePlainText("  hello  ")).toBe("hello");
  });

  it("truncates to maxLength", () => {
    expect(sanitizePlainText("a".repeat(600), 10)).toHaveLength(10);
  });
});

describe("redactEmail", () => {
  it("keeps only the first character of the local part", () => {
    expect(redactEmail("ridho@example.com")).toBe("r****@example.com");
  });

  it("returns a safe placeholder for malformed input", () => {
    expect(redactEmail("not-an-email")).toBe("[redacted]");
  });
});

describe("logRequestEvent", () => {
  afterEach(() => vi.restoreAllMocks());

  it("never logs a raw email value", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logRequestEvent("test_event", { email: "ridho@example.com", clientIp: "127.0.0.1" });
    const logged = spy.mock.calls[0]?.[0] as string;
    expect(logged).not.toContain("ridho@example.com");
    expect(logged).toContain("r****@example.com");
  });
});
