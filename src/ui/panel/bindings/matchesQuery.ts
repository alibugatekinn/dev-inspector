import type { LogEntry } from "../../../utils/types";

function safeStringify(value: unknown): string {
  const seen = new WeakSet<object>();
  try {
    return JSON.stringify(value, (_k, v) => {
      if (typeof v === "bigint") return v.toString();
      if (typeof v === "function") return `[Function:${v.name || "anonymous"}]`;
      if (v instanceof Error) return { name: v.name, message: v.message };
      if (v && typeof v === "object") {
        if (seen.has(v as object)) return "[Circular]";
        seen.add(v as object);
      }
      return v;
    }) ?? "";
  } catch {
    return "";
  }
}

function corpusForEntry(entry: LogEntry): string {
  const parts: string[] = [];
  if (entry.message) parts.push(entry.message);
  if (entry.source === "console") {
    parts.push(entry.level);
    parts.push(safeStringify(entry.args));
  } else {
    if (entry.method) parts.push(entry.method);
    if (entry.url) parts.push(entry.url);
    if (typeof entry.status === "number") parts.push(String(entry.status));
    if (typeof entry.requestBody !== "undefined") parts.push(safeStringify(entry.requestBody));
    if (typeof entry.responseBody !== "undefined") parts.push(safeStringify(entry.responseBody));
  }
  return parts.join("\n").toLowerCase();
}

export function matchesQuery(entry: LogEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return true;
  return corpusForEntry(entry).includes(q);
}
