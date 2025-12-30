import type { PanelState } from "./types";

export function createPanelState(initiallyOpen: boolean): PanelState {
  return {
    open: initiallyOpen,
    tab: "console",
    entries: { console: [], network: [] },
    errorCounts: { console: 0, network: 0 },
  };
}


