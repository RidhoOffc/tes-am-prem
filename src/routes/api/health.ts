import { createAPIFileRoute } from "@tanstack/react-start/api";
import { securityHeaders } from "~/lib/security/headers";
import { getAppVersion, getUptimeSeconds } from "~/lib/utils";
import type { HealthResponse } from "~/lib/api/schemas";

export const Route = createAPIFileRoute("/api/health")({
  GET: async () => {
    const body: HealthResponse = {
      status: "ok",
      uptimeSeconds: getUptimeSeconds(),
      version: getAppVersion(),
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...securityHeaders(),
      },
    });
  },
});
