import type { LogEntry } from "../../utils/types";
import { createJsonViewer } from "../jsonViewer";
import type { LogList } from "./types";
import { createNetworkDetails } from "./networkDetails";
import { getInspectableArgs } from "./shared";
import { classForTone, fmtTime, isNetworkFailure, toneForEntry } from "./shared";

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


