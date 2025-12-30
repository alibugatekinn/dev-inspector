import type { createLogList } from "../../logList";

export type PanelCountersDOM = {
  headerConsoleCount: HTMLElement;
  headerNetworkCount: HTMLElement;
  toggleConsoleCount: HTMLElement;
  toggleNetworkCount: HTMLElement;
  toggleConsoleErrorCount: HTMLElement;
  toggleNetworkErrorCount: HTMLElement;
  toggleConsoleErrorWrap: HTMLElement;
  toggleNetworkErrorWrap: HTMLElement;
};

export type PanelDOM = {
  root: HTMLDivElement;
  toggleBtn: HTMLButtonElement;
  panel: HTMLDivElement;
  header: HTMLDivElement;
  body: HTMLDivElement;
  closeBtn: HTMLButtonElement;
  clearBtn: HTMLButtonElement;
  consoleTab: HTMLButtonElement;
  networkTab: HTMLButtonElement;
  resizeHandle: HTMLDivElement;
  list: ReturnType<typeof createLogList>;
  counters: PanelCountersDOM;
};


