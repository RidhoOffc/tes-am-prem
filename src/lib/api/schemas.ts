import { z } from "zod";

/** Shared email schema used by both the client form and the server route. */
export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email wajib diisi.")
  .max(254, "Email terlalu panjang.")
  .email("Format email tidak valid.");

export const verificationRequestInput = z.object({
  email: emailSchema,
});
export type VerificationRequestInput = z.infer<typeof verificationRequestInput>;

export const verificationCheckInput = z.object({
  requestId: z.string().trim().min(1, "requestId wajib diisi."),
});
export type VerificationCheckInput = z.infer<typeof verificationCheckInput>;

/**
 * Normalized shape our backend always returns to the frontend, regardless of
 * which upstream provider (if any) is configured. The frontend never sees a
 * raw upstream payload — only this validated, redacted shape.
 */
export const verificationStatusSchema = z.enum([
  "not_configured",
  "pending",
  "awaiting_user_action",
  "verified",
  "failed",
  "expired",
]);
export type VerificationStatus = z.infer<typeof verificationStatusSchema>;

export const verificationRequestResponse = z.object({
  ok: z.boolean(),
  status: verificationStatusSchema,
  requestId: z.string().nullable(),
  message: z.string(),
});
export type VerificationRequestResponse = z.infer<typeof verificationRequestResponse>;

export const verificationCheckResponse = z.object({
  ok: z.boolean(),
  status: verificationStatusSchema,
  message: z.string(),
  checkedAt: z.string(),
});
export type VerificationCheckResponse = z.infer<typeof verificationCheckResponse>;

export const healthResponseSchema = z.object({
  status: z.enum(["ok", "degraded", "down"]),
  uptimeSeconds: z.number().nonnegative(),
  version: z.string(),
  timestamp: z.string(),
});
export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const statusResponseSchema = z.object({
  server: z.enum(["ok", "degraded", "down"]),
  apiIntegration: z.enum(["not_configured", "connected", "unreachable"]),
  responseTimeMs: z.number().nullable(),
  version: z.string(),
  uptimeSeconds: z.number().nonnegative(),
  message: z.string(),
  timestamp: z.string(),
});
export type StatusResponse = z.infer<typeof statusResponseSchema>;

export const publicConfigSchema = z.object({
  appName: z.string(),
  version: z.string(),
  integrationConfigured: z.boolean(),
  clientOrigin: z.string(),
});
export type PublicConfig = z.infer<typeof publicConfigSchema>;

/**
 * Schema for whatever an upstream provider would hand back from a
 * verification-check call. This is deliberately conservative and unused
 * until a real, documented provider is wired into lib/api/adapter.ts — it
 * exists so that integration, when it happens, validates the response
 * instead of trusting it blindly.
 */
export const upstreamVerificationResultSchema = z.object({
  status: z.string(),
  reference: z.string().optional(),
});
