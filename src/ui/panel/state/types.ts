import type { LogEntry } from "../../../utils/types";
import type { TabKey } from "../shared/types";

export type PanelState = {
  open: boolean;
  tab: TabKey;
  entries: Record<TabKey, LogEntry[]>;
  errorCounts: Record<TabKey, number>;
};


