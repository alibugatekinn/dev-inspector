import type { LogStorage } from "../../storage/logStorage";
import { ensureDocument } from "./shared/ensureDocument";
import { ensureStyle } from "./shared/ensureStyle";
import { buildPanelDOM } from "./dom";
import { createPanelState } from "./state";
import { setupPanelBehavior } from "./behavior";

export type PanelOptions = {
  storage: LogStorage;
  title?: string;
  initiallyOpen?: boolean;
  mount?: HTMLElement;
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

  const dom = buildPanelDOM(doc, options);
  const state = createPanelState(options.initiallyOpen ?? false);
  return setupPanelBehavior(dom, state, options.storage);
}


