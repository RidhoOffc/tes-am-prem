/** Secure HTTP headers applied to every API response. */
export function securityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cache-Control": "no-store",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  };
}

/** Builds a restrictive CORS header set scoped to the configured client origin. */
export function corsHeaders(clientOrigin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": clientOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}
