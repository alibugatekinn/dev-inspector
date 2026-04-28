import type { Theme } from "../theme/types";
import type { PanelState } from "./types";

export function createPanelState(initiallyOpen: boolean, theme: Theme): PanelState {
  return {
    open: initiallyOpen,
    tab: "console",
    entries: { console: [], network: [] },
    errorCounts: { console: 0, network: 0 },
    query: "",
    pinnedToBottom: true,
    pendingNew: 0,
    theme,
  };
}
