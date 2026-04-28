import type { LogEntry } from "../../../utils/types";
import type { TabKey } from "../shared/types";
import type { Theme } from "../theme/types";

export type PanelState = {
  open: boolean;
  tab: TabKey;
  entries: Record<TabKey, LogEntry[]>;
  errorCounts: Record<TabKey, number>;
  query: string;
  pinnedToBottom: boolean;
  pendingNew: number;
  theme: Theme;
};
