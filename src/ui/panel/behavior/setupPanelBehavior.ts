import type { LogStorage } from "../../../storage/logStorage";
import type { PanelHandle } from "..";
import type { PanelDOM } from "../dom/types";
import type { PanelState } from "../state/types";
import { bindStorageToPanelView } from "../bindings";
import { attachResizeHandling } from "../resize";

export function setupPanelBehavior(dom: PanelDOM, state: PanelState, storage: LogStorage): PanelHandle {
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

  const bindings = bindStorageToPanelView({
    storage,
    state,
    list: dom.list,
    body: dom.body,
    counters: dom.counters,
    updateTabStyles,
  });

  applyVisibility();
  updateTabStyles();

  const resizeControls = attachResizeHandling(dom.panel, dom.resizeHandle);

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

  dom.toggleBtn.addEventListener("click", onToggleClick);
  dom.closeBtn.addEventListener("click", onCloseClick);
  dom.clearBtn.addEventListener("click", onClearClick);
  dom.consoleTab.addEventListener("click", onConsoleTab);
  dom.networkTab.addEventListener("click", onNetworkTab);

  const destroy = () => {
    dom.toggleBtn.removeEventListener("click", onToggleClick);
    dom.closeBtn.removeEventListener("click", onCloseClick);
    dom.clearBtn.removeEventListener("click", onClearClick);
    dom.consoleTab.removeEventListener("click", onConsoleTab);
    dom.networkTab.removeEventListener("click", onNetworkTab);
    resizeControls.destroy();
    bindings.destroy();
    dom.root.remove();
  };

  return { open, close, toggle, destroy, isOpen: () => state.open };
}


