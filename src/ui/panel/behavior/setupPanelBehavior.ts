import type { LogStorage } from "../../../storage/logStorage";
import type { PanelHandle } from "..";
import type { PanelDOM } from "../dom/types";
import type { PanelState } from "../state/types";
import { bindStorageToPanelView } from "../bindings";
import { attachResizeHandling } from "../resize";
import { applyTheme, saveTheme, type Theme } from "../theme";

export function setupPanelBehavior(
  dom: PanelDOM,
  state: PanelState,
  storage: LogStorage,
  themeConfig: { storageKey: string; persist: boolean },
): PanelHandle {
  const applyVisibility = () => {
    if (state.open) dom.panel.classList.remove("di-hidden");
    else dom.panel.classList.add("di-hidden");
  };

  const updateTabStyles = () => {
    if (state.tab === "console") {
      dom.consoleTab.classList.add("di-tabActive");
      dom.networkTab.classList.remove("di-tabActive");
    } else {
      dom.networkTab.classList.add("di-tabActive");
      dom.consoleTab.classList.remove("di-tabActive");
    }
  };

  const updateThemeButton = () => {
    dom.themeBtn.setAttribute("aria-pressed", state.theme === "dark" ? "true" : "false");
    dom.themeBtn.setAttribute(
      "title",
      state.theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
    );
  };

  const setTheme = (next: Theme) => {
    state.theme = next;
    applyTheme(dom.root, next);
    updateThemeButton();
    if (themeConfig.persist) saveTheme(themeConfig.storageKey, next);
  };

  applyTheme(dom.root, state.theme);
  updateThemeButton();

  const bindings = bindStorageToPanelView({
    storage,
    state,
    list: dom.list,
    body: dom.body,
    jumpBtn: dom.jumpBtn,
    jumpBtnLabel: dom.jumpBtnLabel,
    counters: dom.counters,
    updateTabStyles,
  });

  applyVisibility();
  updateTabStyles();

  const resizeControls = attachResizeHandling(dom.panel, dom.resizeHandle);

  const updateSearchClearVisibility = () => {
    dom.searchClearBtn.classList.toggle("di-searchClear--visible", state.query.length > 0);
  };
  updateSearchClearVisibility();

  const open = () => {
    state.open = true;
    applyVisibility();
  };

  const close = () => {
    state.open = false;
    applyVisibility();
  };

  const toggle = () => {
    state.open = !state.open;
    applyVisibility();
  };

  const onToggleClick = () => toggle();
  const onCloseClick = () => close();
  const onClearClick = () => storage.clear();
  const onConsoleTab = () => {
    state.tab = "console";
    updateTabStyles();
    bindings.renderActiveTab();
  };
  const onNetworkTab = () => {
    state.tab = "network";
    updateTabStyles();
    bindings.renderActiveTab();
  };
  const onThemeClick = () => setTheme(state.theme === "dark" ? "light" : "dark");
  const onSearchInput = () => {
    state.query = dom.searchInput.value;
    updateSearchClearVisibility();
    bindings.renderActiveTab();
  };
  const onSearchClear = () => {
    if (state.query.length === 0) return;
    state.query = "";
    dom.searchInput.value = "";
    updateSearchClearVisibility();
    bindings.renderActiveTab();
    dom.searchInput.focus();
  };
  const onBodyScroll = () => bindings.refreshScrollAffordances();
  const onJumpClick = () => bindings.scrollToBottom();

  dom.toggleBtn.addEventListener("click", onToggleClick);
  dom.closeBtn.addEventListener("click", onCloseClick);
  dom.clearBtn.addEventListener("click", onClearClick);
  dom.themeBtn.addEventListener("click", onThemeClick);
  dom.consoleTab.addEventListener("click", onConsoleTab);
  dom.networkTab.addEventListener("click", onNetworkTab);
  dom.searchInput.addEventListener("input", onSearchInput);
  dom.searchClearBtn.addEventListener("click", onSearchClear);
  dom.body.addEventListener("scroll", onBodyScroll, { passive: true });
  dom.jumpBtn.addEventListener("click", onJumpClick);

  const destroy = () => {
    dom.toggleBtn.removeEventListener("click", onToggleClick);
    dom.closeBtn.removeEventListener("click", onCloseClick);
    dom.clearBtn.removeEventListener("click", onClearClick);
    dom.themeBtn.removeEventListener("click", onThemeClick);
    dom.consoleTab.removeEventListener("click", onConsoleTab);
    dom.networkTab.removeEventListener("click", onNetworkTab);
    dom.searchInput.removeEventListener("input", onSearchInput);
    dom.searchClearBtn.removeEventListener("click", onSearchClear);
    dom.body.removeEventListener("scroll", onBodyScroll);
    dom.jumpBtn.removeEventListener("click", onJumpClick);
    resizeControls.destroy();
    bindings.destroy();
    dom.root.remove();
  };

  return { open, close, toggle, destroy, isOpen: () => state.open };
}
