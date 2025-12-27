import type { LogEntry } from "../utils/types";
import type { LogStorage } from "../storage/logStorage";
import { createLogList } from "./logList";
import { PANEL_CSS } from "./panelStyles";

export type PanelOptions = {
  storage: LogStorage;
  title?: string;
  initiallyOpen?: boolean;
  mount?: HTMLElement;
};

export type PanelHandle = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  destroy: () => void;
  isOpen: () => boolean;
};

function ensureDocument(): Document {
  if (typeof document === "undefined") {
    throw new Error("Panel UI requires a browser-like environment with document.");
  }
  return document;
}

function ensureStyle(doc: Document): void {
  const id = "dev-inspector-panel-style";
  const existing = doc.getElementById(id);
  if (existing) return;
  const style = doc.createElement("style");
  style.id = id;
  style.textContent = PANEL_CSS;
  doc.head.append(style);
}

export function createPanel(options: PanelOptions): PanelHandle {
  const doc = ensureDocument();
  ensureStyle(doc);

  const mount = options.mount ?? doc.body;
  const title = options.title ?? "Dev Inspector";
  let open = options.initiallyOpen ?? false;

  const root = doc.createElement("div");
  root.className = "di-root";

  const toggleBtn = doc.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "di-toggle";
  toggleBtn.textContent = "Logs";

  const panel = doc.createElement("div");
  panel.className = `di-panel${open ? "" : " di-hidden"}`;

  const header = doc.createElement("div");
  header.className = "di-header";

  const titleEl = doc.createElement("div");
  titleEl.className = "di-title";
  titleEl.textContent = title;

  const actions = doc.createElement("div");
  actions.className = "di-actions";

  const clearBtn = doc.createElement("button");
  clearBtn.type = "button";
  clearBtn.className = "di-btn";
  clearBtn.textContent = "Clear";

  const closeBtn = doc.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "di-btn";
  closeBtn.textContent = "Close";

  actions.append(clearBtn, closeBtn);
  header.append(titleEl, actions);

  const body = doc.createElement("div");
  body.className = "di-body";

  const list = createLogList(doc);
  body.append(list.el);

  panel.append(header, body);
  root.append(toggleBtn, panel);
  mount.append(root);

  const renderExisting = () => {
    list.clear();
    options.storage.getAll().forEach((e) => list.append(e));
  };

  renderExisting();

  const onNewLog = (entry: LogEntry) => {
    list.append(entry);
    body.scrollTop = body.scrollHeight;
  };

  const unsub = options.storage.onNewLog(onNewLog);

  const applyVisibility = () => {
    if (open) panel.classList.remove("di-hidden");
    else panel.classList.add("di-hidden");
  };

  const openPanel = () => {
    open = true;
    applyVisibility();
  };

  const closePanel = () => {
    open = false;
    applyVisibility();
  };

  const toggle = () => {
    open = !open;
    applyVisibility();
  };

  const onToggleClick = () => toggle();
  const onCloseClick = () => closePanel();
  const onClearClick = () => {
    options.storage.clear();
    renderExisting();
  };

  toggleBtn.addEventListener("click", onToggleClick);
  closeBtn.addEventListener("click", onCloseClick);
  clearBtn.addEventListener("click", onClearClick);

  const destroy = () => {
    toggleBtn.removeEventListener("click", onToggleClick);
    closeBtn.removeEventListener("click", onCloseClick);
    clearBtn.removeEventListener("click", onClearClick);
    unsub();
    root.remove();
  };

  return {
    open: openPanel,
    close: closePanel,
    toggle,
    destroy,
    isOpen: () => open,
  };
}


