import { createLogList } from "../../logList";
import { queryOrThrow } from "../shared";
import type { PanelOptions } from "..";
import {
  CONSOLE_TAB_HTML,
  JUMP_ICON_HTML,
  MOON_ICON_HTML,
  NETWORK_TAB_HTML,
  SEARCH_ICON_HTML,
  SUN_ICON_HTML,
  buildToggleButtonHTML,
} from "./constants";
import type { PanelCountersDOM, PanelDOM } from "./types";

export function buildPanelDOM(doc: Document, options: PanelOptions): PanelDOM {
  const mount = options.mount ?? doc.body;
  const title = options.title ?? "Dev Inspector";

  const root = doc.createElement("div");
  root.className = "di-root";

  const toggleBtn = doc.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "di-toggle";
  toggleBtn.setAttribute("aria-label", title);
  toggleBtn.innerHTML = buildToggleButtonHTML(title);

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

  const themeBtn = doc.createElement("button");
  themeBtn.type = "button";
  themeBtn.className = "di-iconBtn di-themeBtn";
  themeBtn.setAttribute("aria-label", "Toggle theme");
  themeBtn.innerHTML = `<span class="di-themeIcon di-themeIcon--sun">${SUN_ICON_HTML}</span><span class="di-themeIcon di-themeIcon--moon">${MOON_ICON_HTML}</span>`;

  const clearBtn = doc.createElement("button");
  clearBtn.type = "button";
  clearBtn.className = "di-btn";
  clearBtn.textContent = "Clear";

  const closeBtn = doc.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "di-btn";
  closeBtn.textContent = "Close";

  actions.append(themeBtn, clearBtn, closeBtn);
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

  const searchRow = doc.createElement("div");
  searchRow.className = "di-searchRow";

  const searchWrap = doc.createElement("div");
  searchWrap.className = "di-searchWrap";

  const searchIcon = doc.createElement("span");
  searchIcon.className = "di-searchIconWrap";
  searchIcon.innerHTML = SEARCH_ICON_HTML;

  const searchInput = doc.createElement("input");
  searchInput.type = "search";
  searchInput.className = "di-searchInput";
  searchInput.placeholder = "Search logs (URL, method, status, message)";
  searchInput.setAttribute("aria-label", "Search logs");
  searchInput.autocomplete = "off";
  searchInput.spellcheck = false;

  const searchClearBtn = doc.createElement("button");
  searchClearBtn.type = "button";
  searchClearBtn.className = "di-searchClear";
  searchClearBtn.setAttribute("aria-label", "Clear search");
  searchClearBtn.textContent = "×";

  searchWrap.append(searchIcon, searchInput, searchClearBtn);
  searchRow.append(searchWrap);

  header.append(headerRow, tabs, searchRow);

  const bodyWrap = doc.createElement("div");
  bodyWrap.className = "di-bodyWrap";

  const body = doc.createElement("div");
  body.className = "di-body";

  const list = createLogList(doc);
  body.append(list.el);

  const jumpBtn = doc.createElement("button");
  jumpBtn.type = "button";
  jumpBtn.className = "di-jumpBtn";
  jumpBtn.setAttribute("aria-label", "Jump to latest");
  const jumpBtnLabel = doc.createElement("span");
  jumpBtnLabel.className = "di-jumpBtnLabel";
  jumpBtnLabel.textContent = "Latest";
  const jumpBtnIcon = doc.createElement("span");
  jumpBtnIcon.className = "di-jumpBtnIcon";
  jumpBtnIcon.innerHTML = JUMP_ICON_HTML;
  jumpBtn.append(jumpBtnIcon, jumpBtnLabel);

  bodyWrap.append(body, jumpBtn);

  panel.append(header, bodyWrap);
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

  return {
    root,
    toggleBtn,
    panel,
    header,
    body,
    bodyWrap,
    closeBtn,
    clearBtn,
    themeBtn,
    consoleTab,
    networkTab,
    resizeHandle,
    searchInput,
    searchClearBtn,
    jumpBtn,
    jumpBtnLabel,
    list,
    counters,
  };
}
