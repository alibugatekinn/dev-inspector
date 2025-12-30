import type { LogEntry } from "../../../utils/types";
import type { LogStorage } from "../../../storage/logStorage";
import type { PanelCountersDOM } from "../dom/types";
import type { PanelState } from "../state/types";
import type { DataBindings } from "./types";

export function bindStorageToPanelView(args: {
  storage: LogStorage;
  state: PanelState;
  list: { clear: () => void; append: (entry: LogEntry) => void };
  body: HTMLElement;
  counters: PanelCountersDOM;
  updateTabStyles: () => void;
}): DataBindings {
  const isConsoleError = (e: LogEntry) => e.source === "console" && e.level === "error";
  const isNetworkError = (e: LogEntry) => e.source === "network" && (typeof e.status !== "number" || e.status >= 400);

  const updateCounts = () => {
    args.counters.headerConsoleCount.textContent = String(args.state.entries.console.length);
    args.counters.headerNetworkCount.textContent = String(args.state.entries.network.length);
    args.counters.toggleConsoleCount.textContent = String(args.state.entries.console.length);
    args.counters.toggleNetworkCount.textContent = String(args.state.entries.network.length);
    args.counters.toggleConsoleErrorCount.textContent = String(args.state.errorCounts.console);
    args.counters.toggleNetworkErrorCount.textContent = String(args.state.errorCounts.network);
    args.counters.toggleConsoleErrorWrap.style.display = args.state.errorCounts.console > 0 ? "inline-flex" : "none";
    args.counters.toggleNetworkErrorWrap.style.display = args.state.errorCounts.network > 0 ? "inline-flex" : "none";
  };

  const renderActiveTab = () => {
    args.list.clear();
    args.state.entries[args.state.tab].forEach((e) => args.list.append(e));
    args.body.scrollTop = args.body.scrollHeight;
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
    if (entry.source === args.state.tab) {
      args.list.append(entry);
      args.body.scrollTop = args.body.scrollHeight;
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

  return { destroy, renderActiveTab, hydrate };
}


