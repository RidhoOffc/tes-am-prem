/**
 * Thin fetch wrapper used only by the server-side adapter to talk to an
 * upstream provider. Adds a timeout and normalizes network failures into a
 * typed result instead of throwing raw fetch errors around.
 */

export type FetchResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: "timeout" | "network_error" | "invalid_json" | "http_error"; status: number | null; detail: string };

export interface RequestOptions {
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 8000;

export async function safeFetchJson<T>(url: string, options: RequestOptions = {}): Promise<FetchResult<T>> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    let parsed: unknown;
    try {
      parsed = await response.json();
    } catch {
      return {
        ok: false,
        error: "invalid_json",
        status: response.status,
        detail: "Respons upstream bukan JSON yang valid.",
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        error: "http_error",
        status: response.status,
        detail: `Upstream mengembalikan status ${response.status}.`,
      };
    }

    return { ok: true, data: parsed as T, status: response.status };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { ok: false, error: "timeout", status: null, detail: `Request timeout setelah ${timeoutMs}ms.` };
    }
    return {
      ok: false,
      error: "network_error",
      status: null,
      detail: err instanceof Error ? err.message : "Kesalahan jaringan tidak diketahui.",
    };
  } finally {
    clearTimeout(timer);
  }
}
