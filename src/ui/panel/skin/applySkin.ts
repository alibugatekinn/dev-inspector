import type { Skin } from "./types";

export function applySkin(root: HTMLElement, skin: Skin): void {
  root.setAttribute("data-di-skin", skin);
}
