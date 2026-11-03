import { createAPIFileRoute } from "@tanstack/react-start/api";
import { securityHeaders } from "~/lib/security/headers";
import { getApiEnv } from "~/lib/api/env";
import { probeUpstream } from "~/lib/api/adapter";
import { getAppVersion, getUptimeSeconds } from "~/lib/utils";
import type { StatusResponse } from "~/lib/api/schemas";

export const Route = createAPIFileRoute("/api/status")({
  GET: async () => {
    const env = getApiEnv();

    let apiIntegration: StatusResponse["apiIntegration"] = "not_configured";
    let responseTimeMs: number | null = null;
    let message = "Integrasi API verifikasi belum dikonfigurasi. Hanya fitur panduan yang aktif saat ini.";

    if (env.isConfigured) {
      const probe = await probeUpstream();
      responseTimeMs = probe.responseTimeMs;
      if (probe.reachable) {
        apiIntegration = "connected";
        message = "Integrasi API terhubung dan merespons normal.";
      } else {
        apiIntegration = "unreachable";
        message = "Integrasi API dikonfigurasi tetapi tidak dapat dihubungi saat ini.";
      }
    }

    const body: StatusResponse = {
      server: "ok",
      apiIntegration,
      responseTimeMs,
      version: getAppVersion(),
      uptimeSeconds: getUptimeSeconds(),
      message,
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
