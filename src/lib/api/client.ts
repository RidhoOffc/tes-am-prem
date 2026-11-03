/**
 * Browser-side API client. Talks only to our own internal /api/* endpoints —
 * never directly to an upstream provider. Validates every response with Zod
 * before handing it to UI code.
 */
import {
  verificationRequestResponse,
  verificationCheckResponse,
  statusResponseSchema,
  healthResponseSchema,
  publicConfigSchema,
  type VerificationRequestResponse,
  type VerificationCheckResponse,
  type StatusResponse,
  type HealthResponse,
  type PublicConfig,
} from "./schemas";

async function postJson<T>(url: string, body: unknown, schema: { parse: (v: unknown) => T }): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await response.json();
  return schema.parse(json);
}

async function getJson<T>(url: string, schema: { parse: (v: unknown) => T }): Promise<T> {
  const response = await fetch(url);
  const json = await response.json();
  return schema.parse(json);
}

export function requestVerification(email: string): Promise<VerificationRequestResponse> {
  return postJson("/api/verification/request", { email }, verificationRequestResponse);
}

export function checkVerification(requestId: string): Promise<VerificationCheckResponse> {
  return postJson("/api/verification/check", { requestId }, verificationCheckResponse);
}

export function getStatus(): Promise<StatusResponse> {
  return getJson("/api/status", statusResponseSchema);
}

export function getHealth(): Promise<HealthResponse> {
  return getJson("/api/health", healthResponseSchema);
}

export function getPublicConfig(): Promise<PublicConfig> {
  return getJson("/api/config", publicConfigSchema);
}
