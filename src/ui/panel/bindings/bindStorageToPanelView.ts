import type { LogEntry } from "../../../utils/types";
import type { LogStorage } from "../../../storage/logStorage";
import type { PanelCountersDOM } from "../dom/types";
import type { PanelState } from "../state/types";
import { matchesQuery } from "./matchesQuery";
import type { DataBindings } from "./types";

const SCROLL_PIN_THRESHOLD_PX = 32;

export function bindStorageToPanelView(args: {
  storage: LogStorage;
  state: PanelState;
  list: { clear: () => void; append: (entry: LogEntry) => void };
  body: HTMLElement;
  jumpBtn: HTMLElement;
  jumpBtnLabel: HTMLElement;
  counters: PanelCountersDOM;
  updateTabStyles: () => void;
}): DataBindings {
  const isConsoleError = (e: LogEntry) => e.source === "console" && e.level === "error";
  const isNetworkError = (e: LogEntry) =>
    e.source === "network" && (typeof e.status !== "number" || e.status >= 400);

  const updateCounts = () => {
    args.counters.headerConsoleCount.textContent = String(args.state.entries.console.length);
    args.counters.headerNetworkCount.textContent = String(args.state.entries.network.length);
    args.counters.toggleConsoleCount.textContent = String(args.state.entries.console.length);
    args.counters.toggleNetworkCount.textContent = String(args.state.entries.network.length);
    args.counters.toggleConsoleErrorCount.textContent = String(args.state.errorCounts.console);
    args.counters.toggleNetworkErrorCount.textContent = String(args.state.errorCounts.network);
    args.counters.toggleConsoleErrorWrap.style.display =
      args.state.errorCounts.console > 0 ? "inline-flex" : "none";
    args.counters.toggleNetworkErrorWrap.style.display =
      args.state.errorCounts.network > 0 ? "inline-flex" : "none";
  };

  const updateJumpAffordance = () => {
    const visible = !args.state.pinnedToBottom;
    args.jumpBtn.classList.toggle("di-jumpBtn--visible", visible);
    if (args.state.pendingNew > 0) {
      args.jumpBtnLabel.textContent = `${args.state.pendingNew} new`;
      args.jumpBtn.classList.add("di-jumpBtn--hasNew");
    } else {
      args.jumpBtnLabel.textContent = "Latest";
      args.jumpBtn.classList.remove("di-jumpBtn--hasNew");
    }
  };

  const scrollToBottom = () => {
    args.body.scrollTop = args.body.scrollHeight;
    args.state.pinnedToBottom = true;
    args.state.pendingNew = 0;
    updateJumpAffordance();
  };

  const measurePinned = () => {
    const distance = args.body.scrollHeight - args.body.scrollTop - args.body.clientHeight;
    return distance <= SCROLL_PIN_THRESHOLD_PX;
  };

  const refreshScrollAffordances = () => {
    args.state.pinnedToBottom = measurePinned();
    if (args.state.pinnedToBottom) args.state.pendingNew = 0;
    updateJumpAffordance();
  };

  const renderActiveTab = () => {
    args.list.clear();
    const filtered = args.state.entries[args.state.tab].filter((e) =>
      matchesQuery(e, args.state.query),
    );
    filtered.forEach((e) => args.list.append(e));
    args.state.pendingNew = 0;
    args.state.pinnedToBottom = true;
    args.body.scrollTop = args.body.scrollHeight;
    updateJumpAffordance();
  };

  const hydrate = () => {
    args.state.entries.console = [];
    args.state.entries.network = [];
    args.state.errorCounts.console = 0;
    args.state.errorCounts.network = 0;
    args.storage.getAll().forEach((e) => {
      if (e.source === "network") {
        args.state.entries.network.push(e);
        if (isNetworkError(e)) args.state.errorCounts.network += 1;
      } else {
        args.state.entries.console.push(e);
        if (isConsoleError(e)) args.state.errorCounts.console += 1;
      }
    });
    updateCounts();
    args.updateTabStyles();
    renderActiveTab();
  };

  const onNewLog = (entry: LogEntry) => {
    if (entry.source === "network") {
      args.state.entries.network.push(entry);
      if (isNetworkError(entry)) args.state.errorCounts.network += 1;
    } else {
      args.state.entries.console.push(entry);
      if (isConsoleError(entry)) args.state.errorCounts.console += 1;
    }
    updateCounts();
    if (entry.source !== args.state.tab) return;
    if (!matchesQuery(entry, args.state.query)) return;
    args.list.append(entry);
    if (args.state.pinnedToBottom) {
      args.body.scrollTop = args.body.scrollHeight;
    } else {
      args.state.pendingNew += 1;
      updateJumpAffordance();
    }
  };

  const unsub = args.storage.onNewLog(onNewLog);

  const onCleared = () => {
    args.state.entries.console = [];
    args.state.entries.network = [];
    args.state.errorCounts.console = 0;
    args.state.errorCounts.network = 0;
    updateCounts();
    renderActiveTab();
  };

  args.storage.addEventListener("cleared", onCleared);
  hydrate();

  const destroy = () => {
    args.storage.removeEventListener("cleared", onCleared);
    unsub();
  };

  return { destroy, renderActiveTab, hydrate, refreshScrollAffordances, scrollToBottom };
}
