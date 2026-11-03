/**
 * Server-only environment access for the verification API integration.
 *
 * This module is the single place that reads AM_API_* secrets. It never runs
 * in the browser bundle (everything that imports it lives under src/lib/api
 * or src/routes/api and is only invoked from server functions / API routes).
 *
 * IMPORTANT: AM_API_BASE_URL and AM_API_KEY are intentionally left empty in
 * .env.example. There is no publicly documented, authorized Alight Motion
 * activation API. Do NOT point these at an undocumented or unauthorized
 * third-party endpoint — doing so would violate the licensing terms this
 * project is built to respect. Until a legitimate provider with public API
 * documentation exists, the adapter below reports itself as unconfigured and
 * every route that depends on it degrades honestly instead of faking success.
 */

export interface ApiEnv {
  baseUrl: string | null;
  apiKey: string | null;
  clientOrigin: string;
  isConfigured: boolean;
}

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

let cached: ApiEnv | null = null;

export function getApiEnv(): ApiEnv {
  if (cached) return cached;

  const baseUrl = readEnv("AM_API_BASE_URL") ?? null;
  const apiKey = readEnv("AM_API_KEY") ?? null;
  const clientOrigin = readEnv("CLIENT_ORIGIN") ?? "http://localhost:3000";

  if (baseUrl && !baseUrl.startsWith("https://")) {
    // Refuse to treat a non-HTTPS base URL as configured. Fail closed.
    cached = { baseUrl: null, apiKey: null, clientOrigin, isConfigured: false };
    return cached;
  }

  cached = {
    baseUrl,
    apiKey,
    clientOrigin,
    isConfigured: Boolean(baseUrl && apiKey),
  };
  return cached;
}

/** Never log this. Exists only to prove to callers that a secret is present, without revealing it. */
export function hasSecret(value: string | null): boolean {
  return Boolean(value && value.length > 0);
}
