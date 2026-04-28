import type { Theme } from "./types";

export function applyTheme(root: HTMLElement, theme: Theme): void {
  root.setAttribute("data-di-theme", theme);
}
