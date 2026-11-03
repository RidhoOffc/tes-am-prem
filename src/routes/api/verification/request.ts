import { createAPIFileRoute } from "@tanstack/react-start/api";
import { securityHeaders } from "~/lib/security/headers";
import { checkRateLimit } from "~/lib/rate-limit";
import { getClientIp } from "~/lib/utils";
import { logRequestEvent } from "~/lib/security/sanitize";
import { verificationRequestInput } from "~/lib/api/schemas";
import { requestVerification } from "~/lib/api/adapter";

export const Route = createAPIFileRoute("/api/verification/request")({
  POST: async ({ request }) => {
    const headers = { "Content-Type": "application/json", ...securityHeaders() };

    const clientIp = getClientIp(request.headers);
    const rateLimit = checkRateLimit({
      key: `verification-request:${clientIp}`,
      limit: 5,
      windowMs: 10 * 60 * 1000, // 5 requests per 10 minutes per IP
    });

    if (!rateLimit.allowed) {
      logRequestEvent("verification_request_rate_limited", { clientIp });
      return new Response(
        JSON.stringify({
          ok: false,
          status: "failed",
          requestId: null,
          message: "Terlalu banyak permintaan. Coba lagi beberapa menit lagi.",
        }),
        { status: 429, headers: { ...headers, "Retry-After": "600" } },
      );
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ ok: false, status: "failed", requestId: null, message: "Body request tidak valid." }),
        { status: 400, headers },
      );
    }

    const parsed = verificationRequestInput.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          ok: false,
          status: "failed",
          requestId: null,
          message: parsed.error.issues[0]?.message ?? "Data tidak valid.",
        }),
        { status: 422, headers },
      );
    }

    logRequestEvent("verification_request_received", { email: parsed.data.email, clientIp });

    const result = await requestVerification(parsed.data.email);

    // not_configured is a legitimate, expected state — not a server error.
    const statusCode = result.status === "not_configured" ? 200 : result.ok ? 200 : 502;

    return new Response(JSON.stringify(result), { status: statusCode, headers });
  },
});
