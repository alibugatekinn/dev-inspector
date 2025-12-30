import type { LogEntry } from "../utils/types";
import { createJsonViewer } from "./jsonViewer";
import { createNetworkDetails } from "./logList/networkDetails";

export type LogList = {
  el: HTMLUListElement;
  append: (entry: LogEntry) => void;
  clear: () => void;
};

type Tone = "neutral" | "warning" | "error" | "success";

function fmtTime(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function toneForEntry(entry: LogEntry): Tone {
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

function classForTone(tone: Tone): string {
  if (tone === "error") return "di-itemToneError";
  if (tone === "warning") return "di-itemToneWarning";
  if (tone === "success") return "di-itemToneSuccess";
  return "di-itemToneNeutral";
}

function isNetworkFailure(entry: LogEntry): boolean {
  if (entry.source !== "network") return false;
  return typeof entry.status !== "number" || entry.status >= 400;
}

function isInspectableValue(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  if (value instanceof Error) return false;
  if (value instanceof Date) return false;
  if (value instanceof RegExp) return false;
  return true;
}

function getInspectableArgs(args: unknown[]): unknown[] {
  return args.filter(isInspectableValue);
}

export function createLogList(doc: Document): LogList {
  const el = doc.createElement("ul");
  el.className = "di-list";

  const append = (entry: LogEntry) => {
    const li = doc.createElement("li");
    const tone = toneForEntry(entry);
    li.className = `di-item ${classForTone(tone)}`;

    const meta = doc.createElement("div");
    meta.className = "di-meta";

    const time = doc.createElement("span");
    time.textContent = fmtTime(entry.timestamp);

    const source = doc.createElement("span");
    source.textContent = entry.source;

    const detail = doc.createElement("span");
    if (entry.source === "console") {
      detail.textContent = entry.level;
    } else {
      detail.className = `di-statusChip ${isNetworkFailure(entry) ? "di-statusChipError" : "di-statusChipSuccess"}`;
      detail.textContent = typeof entry.status === "number" ? String(entry.status) : "ERR";
    }

    meta.append(time, source, detail);

    li.append(meta);

    if (entry.message && entry.message.trim().length > 0) {
      const msg = doc.createElement("div");
      msg.className = "di-msg";
      msg.textContent = entry.message;
      li.append(msg);
    }

    if (entry.source === "console") {
      const inspectable = getInspectableArgs(entry.args);
      if (inspectable.length > 0) {
        const details = doc.createElement("details");
        details.className = "di-details";

        const summary = doc.createElement("summary");
        summary.className = "di-detailsSummary";
        summary.textContent = "Inspect";

        const viewerWrap = doc.createElement("div");
        viewerWrap.className = "di-detailsBody";
        viewerWrap.append(
          createJsonViewer(doc, inspectable.length === 1 ? inspectable[0] : inspectable, {
            maxDepth: 6,
            maxKeys: 200,
            maxNodes: 2000,
          }),
        );

        details.append(summary, viewerWrap);
        li.append(details);
      }
    }

    if (entry.source === "network") {
      const details = createNetworkDetails(doc, entry);
      if (details) li.append(details);
    }

    el.append(li);
  };

  const clear = () => {
    el.replaceChildren();
  };

  return { el, append, clear };
}


