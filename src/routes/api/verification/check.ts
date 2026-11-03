import { createAPIFileRoute } from "@tanstack/react-start/api";
import { securityHeaders } from "~/lib/security/headers";
import { checkRateLimit } from "~/lib/rate-limit";
import { getClientIp } from "~/lib/utils";
import { verificationCheckInput } from "~/lib/api/schemas";
import { checkVerification } from "~/lib/api/adapter";

export const Route = createAPIFileRoute("/api/verification/check")({
  POST: async ({ request }) => {
    const headers = { "Content-Type": "application/json", ...securityHeaders() };

    const clientIp = getClientIp(request.headers);
    const rateLimit = checkRateLimit({
      key: `verification-check:${clientIp}`,
      limit: 20,
      windowMs: 10 * 60 * 1000, // polling is allowed more often than requesting
    });

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          ok: false,
          status: "failed",
          message: "Terlalu banyak permintaan. Coba lagi beberapa menit lagi.",
          checkedAt: new Date().toISOString(),
        }),
        { status: 429, headers: { ...headers, "Retry-After": "600" } },
      );
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          ok: false,
          status: "failed",
          message: "Body request tidak valid.",
          checkedAt: new Date().toISOString(),
        }),
        { status: 400, headers },
      );
    }

    const parsed = verificationCheckInput.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          ok: false,
          status: "failed",
          message: parsed.error.issues[0]?.message ?? "Data tidak valid.",
          checkedAt: new Date().toISOString(),
        }),
        { status: 422, headers },
      );
    }

    const result = await checkVerification(parsed.data.requestId);
    const statusCode = result.status === "not_configured" ? 200 : result.ok ? 200 : 502;

    return new Response(JSON.stringify(result), { status: statusCode, headers });
  },
});
