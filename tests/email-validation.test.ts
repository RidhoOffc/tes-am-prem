import { describe, it, expect } from "vitest";
import { verificationRequestInput, emailSchema } from "~/lib/api/schemas";

describe("emailSchema", () => {
  it("accepts a well-formed email", () => {
    const result = emailSchema.safeParse("ridho@example.com");
    expect(result.success).toBe(true);
  });

  it("rejects an empty string", () => {
    const result = emailSchema.safeParse("");
    expect(result.success).toBe(false);
  });

  it("rejects a missing @ symbol", () => {
    const result = emailSchema.safeParse("ridho.example.com");
    expect(result.success).toBe(false);
  });

  it("rejects an email over 254 characters", () => {
    const longLocal = "a".repeat(250);
    const result = emailSchema.safeParse(`${longLocal}@example.com`);
    expect(result.success).toBe(false);
  });

  it("trims surrounding whitespace before validating", () => {
    const result = emailSchema.safeParse("  ridho@example.com  ");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("ridho@example.com");
  });
});

describe("verificationRequestInput", () => {
  it("accepts a valid request payload", () => {
    const result = verificationRequestInput.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects a payload missing email", () => {
    const result = verificationRequestInput.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects extra unexpected shapes gracefully (still only reads email)", () => {
    const result = verificationRequestInput.safeParse({ email: "user@example.com", password: "hunter2" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect((result.data as Record<string, unknown>).password).toBeUndefined();
    }
  });
});
