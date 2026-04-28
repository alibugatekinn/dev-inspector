import type { LogStorage } from "../../storage/logStorage";
import { ensureDocument } from "./shared/ensureDocument";
import { ensureStyle } from "./shared/ensureStyle";
import { buildPanelDOM } from "./dom";
import { createPanelState } from "./state";
import { setupPanelBehavior } from "./behavior";
import { DEFAULT_STORAGE_KEY, loadTheme, type Theme } from "./theme";

export type PanelOptions = {
  storage: LogStorage;
  title?: string;
  initiallyOpen?: boolean;
  mount?: HTMLElement;
  theme?: Theme;
  persistTheme?: boolean;
  themeStorageKey?: string;
};

export type PanelHandle = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  destroy: () => void;
  isOpen: () => boolean;
};

export function createPanel(options: PanelOptions): PanelHandle {
  const doc = ensureDocument();
  ensureStyle(doc);

  const persistTheme = options.persistTheme ?? true;
  const storageKey = options.themeStorageKey ?? DEFAULT_STORAGE_KEY;
  const stored = persistTheme ? loadTheme(storageKey) : null;
  const initialTheme: Theme = stored ?? options.theme ?? "light";

  const dom = buildPanelDOM(doc, options);
  const state = createPanelState(options.initiallyOpen ?? false, initialTheme);
  return setupPanelBehavior(dom, state, options.storage, { storageKey, persist: persistTheme });
}
