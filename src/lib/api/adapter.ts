/**
 * Verification provider adapter.
 *
 * This is the ONLY module that is allowed to call an external verification
 * provider. It is intentionally written so that, with no AM_API_BASE_URL /
 * AM_API_KEY configured, every call returns an honest "not_configured"
 * result — never a fabricated success.
 *
 * To wire up a real provider:
 *   1. Obtain official, public API documentation from a provider you are
 *      authorized to integrate with (i.e. one that documents a legitimate
 *      Alight Motion licensing/subscription verification flow it operates
 *      or is contracted to operate).
 *   2. Implement requestVerification() / checkVerification() below using
 *      that documentation's actual endpoints, request/response shapes, and
 *      auth scheme. Validate every upstream response with Zod — never trust
 *      it blindly (see schemas.ts#upstreamVerificationResultSchema as a
 *      starting point, replace with the provider's real schema).
 *   3. Do not treat an HTTP 200 as success by itself. Only report "verified"
 *      when the provider's documented success condition is actually met.
 *
 * Until that happens, do not point AM_API_BASE_URL at an undocumented or
 * unauthorized third party — this file is built to refuse that path, not
 * to be bypassed.
 */

import { getApiEnv } from "./env";
import { safeFetchJson } from "./http-client";
import type { VerificationRequestResponse, VerificationCheckResponse } from "./schemas";

function nowIso(): string {
  return new Date().toISOString();
}

export async function requestVerification(email: string): Promise<VerificationRequestResponse> {
  const env = getApiEnv();

  if (!env.isConfigured || !env.baseUrl || !env.apiKey) {
    return {
      ok: false,
      status: "not_configured",
      requestId: null,
      message:
        "Integrasi verifikasi belum dikonfigurasi. Belum ada penyedia API resmi yang terhubung, jadi proses aktivasi tidak dapat dijalankan dari sini.",
    };
  }

  // Real provider call would go here, e.g.:
  // const result = await safeFetchJson<UpstreamShape>(`${env.baseUrl}/verification/request`, {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${env.apiKey}` },
  //   body: { email },
  // });
  // ...then validate `result.data` with a Zod schema matching the provider's
  // actual documented response, and map it to VerificationRequestResponse.
  //
  // No such provider is configured in this build, so we fall through to the
  // same honest not_configured response rather than guessing at a shape.
  void safeFetchJson; // referenced to keep the import intentional for future wiring
  void email;

  return {
    ok: false,
    status: "not_configured",
    requestId: null,
    message: "Integrasi verifikasi belum dikonfigurasi.",
  };
}

export async function checkVerification(requestId: string): Promise<VerificationCheckResponse> {
  const env = getApiEnv();

  if (!env.isConfigured || !env.baseUrl || !env.apiKey) {
    return {
      ok: false,
      status: "not_configured",
      message: "Integrasi verifikasi belum dikonfigurasi. Tidak ada status untuk diperiksa.",
      checkedAt: nowIso(),
    };
  }

  void requestId;

  return {
    ok: false,
    status: "not_configured",
    message: "Integrasi verifikasi belum dikonfigurasi.",
    checkedAt: nowIso(),
  };
}

export interface UpstreamHealthProbe {
  reachable: boolean;
  responseTimeMs: number | null;
}

/** Used by /api/status to report real connectivity instead of a guess. */
export async function probeUpstream(): Promise<UpstreamHealthProbe> {
  const env = getApiEnv();
  if (!env.isConfigured || !env.baseUrl) {
    return { reachable: false, responseTimeMs: null };
  }

  const started = Date.now();
  const result = await safeFetchJson(`${env.baseUrl}/health`, {
    method: "GET",
    headers: { Authorization: `Bearer ${env.apiKey}` },
    timeoutMs: 4000,
  });
  const responseTimeMs = Date.now() - started;

  return { reachable: result.ok, responseTimeMs };
}
