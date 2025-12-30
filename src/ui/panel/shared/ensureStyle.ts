import { PANEL_CSS } from "../../panelStyles";

export function ensureStyle(doc: Document): void {
  const id = "dev-inspector-panel-style";
  const existing = doc.getElementById(id);
  if (existing) return;
  const style = doc.createElement("style");
  style.id = id;
  style.textContent = PANEL_CSS;
  doc.head.append(style);
}


