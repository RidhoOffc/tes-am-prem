/**
 * Minimal, dependency-free input sanitization helpers for values that end up
 * in logs or responses. Zod handles structural validation; these handle
 * defense-in-depth for display/logging.
 */

/** Strips control characters and collapses whitespace. */
export function sanitizePlainText(input: string, maxLength = 500): string {
  return input
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

/** Redacts an email for logs: keeps the first character and the domain. */
export function redactEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain || !local) return "[redacted]";
  const visible = local.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(local.length - 1, 1))}@${domain}`;
}

/** Safe structured logger that never writes raw PII to stdout/stderr. */
export function logRequestEvent(event: string, fields: Record<string, string | number | boolean | null>): void {
  const safeFields: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (key.toLowerCase().includes("email") && typeof value === "string") {
      safeFields[key] = redactEmail(value);
    } else {
      safeFields[key] = value;
    }
  }
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ event, timestamp: new Date().toISOString(), ...safeFields }));
}
