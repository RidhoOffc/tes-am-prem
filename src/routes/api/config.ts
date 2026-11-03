import { createAPIFileRoute } from "@tanstack/react-start/api";
import { securityHeaders } from "~/lib/security/headers";
import { getApiEnv } from "~/lib/api/env";
import { getAppVersion } from "~/lib/utils";
import type { PublicConfig } from "~/lib/api/schemas";

export const Route = createAPIFileRoute("/api/config")({
  GET: async () => {
    const env = getApiEnv();

    // Only ever return values that are safe for a browser to see. No base
    // URLs, no keys — this is a hard rule, not a configuration choice.
    const body: PublicConfig = {
      appName: "AM Premium Creator",
      version: getAppVersion(),
      integrationConfigured: env.isConfigured,
      clientOrigin: env.clientOrigin,
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
