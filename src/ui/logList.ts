import type { LogEntry } from "../utils/types";

export type LogList = {
  el: HTMLUListElement;
  append: (entry: LogEntry) => void;
  clear: () => void;
};

function fmtTime(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export function createLogList(doc: Document): LogList {
  const el = doc.createElement("ul");
  el.className = "di-list";

  const append = (entry: LogEntry) => {
    const li = doc.createElement("li");
    li.className = "di-item";

    const meta = doc.createElement("div");
    meta.className = "di-meta";

    const time = doc.createElement("span");
    time.textContent = fmtTime(entry.timestamp);

    const source = doc.createElement("span");
    source.textContent = entry.source;

    meta.append(time, source);

    const msg = doc.createElement("div");
    msg.className = "di-msg";
    msg.textContent = entry.message;

    li.append(meta, msg);
    el.append(li);
  };

  const clear = () => {
    el.replaceChildren();
  };

  return { el, append, clear };
}


