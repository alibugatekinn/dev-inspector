import type { Theme } from "./types";

export const DEFAULT_STORAGE_KEY = "dev-inspector:theme";

function getLocalStorage(): Storage | null {
  try {
    const ls = (globalThis as { localStorage?: Storage }).localStorage;
    if (!ls) return null;
    const probeKey = "__dev_inspector_probe__";
    ls.setItem(probeKey, "1");
    ls.removeItem(probeKey);
    return ls;
  } catch {
    return null;
  }
}

export function loadTheme(storageKey: string): Theme | null {
  const ls = getLocalStorage();
  if (!ls) return null;
  try {
    const v = ls.getItem(storageKey);
    if (v === "light" || v === "dark") return v;
    return null;
  } catch {
    return null;
  }
}

export function saveTheme(storageKey: string, theme: Theme): void {
  const ls = getLocalStorage();
  if (!ls) return;
  try {
    ls.setItem(storageKey, theme);
  } catch {
    void 0;
  }
}
