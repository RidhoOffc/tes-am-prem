import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

const APP_VERSION = "1.0.0";
const START_TIME = Date.now();

export function getAppVersion(): string {
  return APP_VERSION;
}

export function getUptimeSeconds(): number {
  return Math.floor((Date.now() - START_TIME) / 1000);
}
