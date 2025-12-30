import { createLogList } from "../../logList";
import { queryOrThrow } from "../shared";
import type { PanelOptions } from "..";
import { CONSOLE_TAB_HTML, NETWORK_TAB_HTML, TOGGLE_BUTTON_HTML } from "./constants";
import type { PanelCountersDOM, PanelDOM } from "./types";

export function buildPanelDOM(doc: Document, options: PanelOptions): PanelDOM {
  const mount = options.mount ?? doc.body;
  const title = options.title ?? "Dev Inspector";

  const root = doc.createElement("div");
  root.className = "di-root";

  const toggleBtn = doc.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "di-toggle";
  toggleBtn.setAttribute("aria-label", "Dev Inspector");
  toggleBtn.innerHTML = TOGGLE_BUTTON_HTML;

  const panel = doc.createElement("div");
  panel.className = "di-panel";

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
  consoleTab.innerHTML = CONSOLE_TAB_HTML;

  const networkTab = doc.createElement("button");
  networkTab.type = "button";
  networkTab.className = "di-tab";
  networkTab.innerHTML = NETWORK_TAB_HTML;

  tabs.append(consoleTab, networkTab);
  header.append(headerRow, tabs);

  const body = doc.createElement("div");
  body.className = "di-body";

  const list = createLogList(doc);
  body.append(list.el);

  panel.append(header, body);
  root.append(toggleBtn, panel);
  mount.append(root);

  const counters: PanelCountersDOM = {
    headerConsoleCount: queryOrThrow<HTMLElement>(header, '[data-di-count="console"]'),
    headerNetworkCount: queryOrThrow<HTMLElement>(header, '[data-di-count="network"]'),
    toggleConsoleCount: queryOrThrow<HTMLElement>(toggleBtn, '[data-di-toggle-count-value="console"]'),
    toggleNetworkCount: queryOrThrow<HTMLElement>(toggleBtn, '[data-di-toggle-count-value="network"]'),
    toggleConsoleErrorCount: queryOrThrow<HTMLElement>(toggleBtn, '[data-di-toggle-error-value="console"]'),
    toggleNetworkErrorCount: queryOrThrow<HTMLElement>(toggleBtn, '[data-di-toggle-error-value="network"]'),
    toggleConsoleErrorWrap: queryOrThrow<HTMLElement>(toggleBtn, '[data-di-toggle-error="console"]'),
    toggleNetworkErrorWrap: queryOrThrow<HTMLElement>(toggleBtn, '[data-di-toggle-error="network"]'),
  };

  return { root, toggleBtn, panel, header, body, closeBtn, clearBtn, consoleTab, networkTab, resizeHandle, list, counters };
}


