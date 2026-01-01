import type { LogEntry } from "../../../utils/types";

type Tone = "neutral" | "warning" | "error" | "success";

export function toneForEntry(entry: LogEntry): Tone {
  if (entry.source === "console") {
    if (entry.level === "error") return "error";
    if (entry.level === "warn") return "warning";
    return "neutral";
  }
  const s = entry.status;
  if (typeof s !== "number") return "error";
  if (s >= 400) return "error";
  if (s >= 300) return "warning";
  return "success";
}

export function classForTone(tone: Tone): string {
  if (tone === "error") return "di-itemToneError";
  if (tone === "warning") return "di-itemToneWarning";
  if (tone === "success") return "di-itemToneSuccess";
  return "di-itemToneNeutral";
}

export function isNetworkFailure(entry: LogEntry): boolean {
  if (entry.source !== "network") return false;
  return typeof entry.status !== "number" || entry.status >= 400;
}


