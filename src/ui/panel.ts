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

type TabKey = "console" | "network";

type Size = { w: number; h: number };

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

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
  let tab: TabKey = "console";

  const root = doc.createElement("div");
  root.className = "di-root";

  const toggleBtn = doc.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "di-toggle";
  toggleBtn.setAttribute("aria-label", "Dev Inspector");
  toggleBtn.innerHTML =
    `<span class="di-toggleTitle">Dev Inspector</span>` +
    `<span class="di-toggleMeta">` +
    `<span class="di-toggleBadge" data-di-toggle-count="console">` +
    `<svg class="di-toggleIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5.5C4 4.67 4.67 4 5.5 4H18.5C19.33 4 20 4.67 20 5.5V15.5C20 16.33 19.33 17 18.5 17H13.5L12 18.5L10.5 17H5.5C4.67 17 4 16.33 4 15.5V5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 8H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 11H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>` +
    `<span data-di-toggle-count-value="console">0</span>` +
    `<span class="di-toggleErr" data-di-toggle-error="console" aria-label="Console errors">` +
    `<span class="di-toggleErrIcon">!</span>` +
    `<span data-di-toggle-error-value="console">0</span>` +
    `</span>` +
    `</span>` +
    `<span class="di-toggleBadge" data-di-toggle-count="network">` +
    `<svg class="di-toggleIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 12L12 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="20" r="1.5" fill="currentColor"/></svg>` +
    `<span data-di-toggle-count-value="network">0</span>` +
    `<span class="di-toggleErr" data-di-toggle-error="network" aria-label="Network errors">` +
    `<span class="di-toggleErrIcon">!</span>` +
    `<span data-di-toggle-error-value="network">0</span>` +
    `</span>` +
    `</span>` +
    `</span>`;

  const panel = doc.createElement("div");
  panel.className = `di-panel${open ? "" : " di-hidden"}`;

  const resizeHandle = doc.createElement("div");
  resizeHandle.className = "di-resizeHandle";
  resizeHandle.setAttribute("role", "separator");
  resizeHandle.setAttribute("aria-label", "Resize panel");

  const header = doc.createElement("div");
  header.className = "di-header";

  const headerRow = doc.createElement("div");
  headerRow.className = "di-headerRow";

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
  headerRow.append(resizeHandle, titleEl, actions);

  const tabs = doc.createElement("div");
  tabs.className = "di-tabs";

  const consoleTab = doc.createElement("button");
  consoleTab.type = "button";
  consoleTab.className = "di-tab";
  consoleTab.innerHTML =
    `<svg class="di-tabIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5.5C4 4.67 4.67 4 5.5 4H18.5C19.33 4 20 4.67 20 5.5V15.5C20 16.33 19.33 17 18.5 17H13.5L12 18.5L10.5 17H5.5C4.67 17 4 16.33 4 15.5V5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 8H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 11H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>` +
    `<span>Console</span>` +
    `<span class="di-badge" data-di-count="console">0</span>`;

  const networkTab = doc.createElement("button");
  networkTab.type = "button";
  networkTab.className = "di-tab";
  networkTab.innerHTML =
    `<svg class="di-tabIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 12L12 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="20" r="1.5" fill="currentColor"/></svg>` +
    `<span>Network</span>` +
    `<span class="di-badge" data-di-count="network">0</span>`;

  tabs.append(consoleTab, networkTab);
  header.append(headerRow, tabs);

  const body = doc.createElement("div");
  body.className = "di-body";

  const list = createLogList(doc);
  body.append(list.el);

  panel.append(header, body);
  root.append(toggleBtn, panel);
  mount.append(root);

  const MAX_WIDTH_CAP = 920;
  const MAX_HEIGHT_CAP = 720;
  const MARGIN_X = 24;
  const MARGIN_Y = 68;

  const minSize: Size = (() => {
    const r = panel.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  })();

  const getMaxSize = (): Size => {
    const win = globalThis as unknown as { innerWidth?: number; innerHeight?: number };
    const vw = typeof win.innerWidth === "number" ? win.innerWidth : 0;
    const vh = typeof win.innerHeight === "number" ? win.innerHeight : 0;
    return {
      w: Math.max(200, Math.min(MAX_WIDTH_CAP, vw - MARGIN_X)),
      h: Math.max(180, Math.min(MAX_HEIGHT_CAP, vh - MARGIN_Y)),
    };
  };

  const getCurrentSize = (): Size => {
    const r = panel.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  };

  const applySize = (next: Size) => {
    const max = getMaxSize();
    const effMinW = Math.min(minSize.w, max.w);
    const effMinH = Math.min(minSize.h, max.h);
    const w = clamp(next.w, effMinW, max.w);
    const h = clamp(next.h, effMinH, max.h);
    panel.style.width = `${w}px`;
    panel.style.height = `${h}px`;
  };

  const ensureWithinViewport = () => {
    if (!panel.style.width && !panel.style.height) return;
    applySize(getCurrentSize());
  };

  const entries: Record<TabKey, LogEntry[]> = { console: [], network: [] };
  const errorCounts: Record<TabKey, number> = { console: 0, network: 0 };

  const isConsoleError = (e: LogEntry) => e.source === "console" && e.level === "error";
  const isNetworkError = (e: LogEntry) => e.source === "network" && (typeof e.status !== "number" || e.status >= 400);

  const updateTabStyles = () => {
    if (tab === "console") {
      consoleTab.classList.add("di-tabActive");
      networkTab.classList.remove("di-tabActive");
    } else {
      networkTab.classList.add("di-tabActive");
      consoleTab.classList.remove("di-tabActive");
    }
  };

  const updateCounts = () => {
    const c = header.querySelector('[data-di-count="console"]');
    const n = header.querySelector('[data-di-count="network"]');
    if (c) c.textContent = String(entries.console.length);
    if (n) n.textContent = String(entries.network.length);

    const tc = toggleBtn.querySelector('[data-di-toggle-count-value="console"]');
    const tn = toggleBtn.querySelector('[data-di-toggle-count-value="network"]');
    if (tc) tc.textContent = String(entries.console.length);
    if (tn) tn.textContent = String(entries.network.length);

    const tec = toggleBtn.querySelector('[data-di-toggle-error-value="console"]');
    const ten = toggleBtn.querySelector('[data-di-toggle-error-value="network"]');
    if (tec) tec.textContent = String(errorCounts.console);
    if (ten) ten.textContent = String(errorCounts.network);

    const ecWrap = toggleBtn.querySelector('[data-di-toggle-error="console"]') as HTMLElement | null;
    const enWrap = toggleBtn.querySelector('[data-di-toggle-error="network"]') as HTMLElement | null;
    if (ecWrap) ecWrap.style.display = errorCounts.console > 0 ? "inline-flex" : "none";
    if (enWrap) enWrap.style.display = errorCounts.network > 0 ? "inline-flex" : "none";
  };

  const renderTab = () => {
    list.clear();
    entries[tab].forEach((e) => list.append(e));
    body.scrollTop = body.scrollHeight;
  };

  const hydrateFromStorage = () => {
    entries.console = [];
    entries.network = [];
    errorCounts.console = 0;
    errorCounts.network = 0;
    options.storage.getAll().forEach((e) => {
      if (e.source === "network") {
        entries.network.push(e);
        if (isNetworkError(e)) errorCounts.network += 1;
      } else {
        entries.console.push(e);
        if (isConsoleError(e)) errorCounts.console += 1;
      }
    });
    updateCounts();
    updateTabStyles();
    renderTab();
  };

  hydrateFromStorage();

  const onNewLog = (entry: LogEntry) => {
    if (entry.source === "network") {
      entries.network.push(entry);
      if (isNetworkError(entry)) errorCounts.network += 1;
    } else {
      entries.console.push(entry);
      if (isConsoleError(entry)) errorCounts.console += 1;
    }
    updateCounts();
    if (entry.source === tab) {
      list.append(entry);
      body.scrollTop = body.scrollHeight;
    }
  };

  const unsub = options.storage.onNewLog(onNewLog);

  const onCleared = () => {
    entries.console = [];
    entries.network = [];
    errorCounts.console = 0;
    errorCounts.network = 0;
    updateCounts();
    renderTab();
  };

  options.storage.addEventListener("cleared", onCleared);

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
  };

  const onConsoleTab = () => {
    tab = "console";
    updateTabStyles();
    renderTab();
  };

  const onNetworkTab = () => {
    tab = "network";
    updateTabStyles();
    renderTab();
  };

  toggleBtn.addEventListener("click", onToggleClick);
  closeBtn.addEventListener("click", onCloseClick);
  clearBtn.addEventListener("click", onClearClick);
  consoleTab.addEventListener("click", onConsoleTab);
  networkTab.addEventListener("click", onNetworkTab);

  let resizing = false;
  let startX = 0;
  let startY = 0;
  let startW = 0;
  let startH = 0;

  const onResizeMove = (ev: PointerEvent) => {
    if (!resizing) return;
    const dx = startX - ev.clientX;
    const dy = startY - ev.clientY;
    applySize({ w: startW + dx, h: startH + dy });
  };

  const stopResize = () => {
    if (!resizing) return;
    resizing = false;
    const win = globalThis as unknown as { removeEventListener?: (...args: unknown[]) => void };
    win.removeEventListener?.("pointermove", onResizeMove as unknown as EventListener);
    win.removeEventListener?.("pointerup", stopResize as unknown as EventListener);
    win.removeEventListener?.("pointercancel", stopResize as unknown as EventListener);
  };

  const onResizeStart = (ev: PointerEvent) => {
    resizing = true;
    startX = ev.clientX;
    startY = ev.clientY;
    const cur = getCurrentSize();
    startW = cur.w;
    startH = cur.h;
    try {
      resizeHandle.setPointerCapture(ev.pointerId);
    } catch {
      void 0;
    }
    const win = globalThis as unknown as { addEventListener?: (...args: unknown[]) => void };
    win.addEventListener?.("pointermove", onResizeMove as unknown as EventListener);
    win.addEventListener?.("pointerup", stopResize as unknown as EventListener);
    win.addEventListener?.("pointercancel", stopResize as unknown as EventListener);
  };

  resizeHandle.addEventListener("pointerdown", onResizeStart);

  const win = globalThis as unknown as { addEventListener?: (...args: unknown[]) => void; removeEventListener?: (...args: unknown[]) => void };
  const onWindowResize = () => ensureWithinViewport();
  win.addEventListener?.("resize", onWindowResize as unknown as EventListener);

  const destroy = () => {
    toggleBtn.removeEventListener("click", onToggleClick);
    closeBtn.removeEventListener("click", onCloseClick);
    clearBtn.removeEventListener("click", onClearClick);
    consoleTab.removeEventListener("click", onConsoleTab);
    networkTab.removeEventListener("click", onNetworkTab);
    options.storage.removeEventListener("cleared", onCleared);
    resizeHandle.removeEventListener("pointerdown", onResizeStart);
    stopResize();
    win.removeEventListener?.("resize", onWindowResize as unknown as EventListener);
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


