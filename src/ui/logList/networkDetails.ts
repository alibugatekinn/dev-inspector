import type { NetworkLogEntry } from "../../utils/types";
import { createJsonViewer } from "../jsonViewer";

function tryParseJson(text: string): unknown | undefined {
  const t = text.trim();
  if (t.length < 2) return undefined;
  const looksLikeObject = t.startsWith("{") && t.endsWith("}");
  const looksLikeArray = t.startsWith("[") && t.endsWith("]");
  if (!looksLikeObject && !looksLikeArray) return undefined;
  try {
    return JSON.parse(t) as unknown;
  } catch {
    return undefined;
  }
}

function valueToElement(doc: Document, value: unknown): HTMLElement {
  if (typeof value === "string") {
    const parsed = tryParseJson(value);
    if (parsed && typeof parsed === "object") {
      return createJsonViewer(doc, parsed, { maxDepth: 6, maxKeys: 200, maxNodes: 2000 });
    }
    const el = doc.createElement("div");
    el.className = "di-netBodyText";
    el.textContent = value;
    return el;
  }
  if (value instanceof Error) {
    const el = doc.createElement("div");
    el.className = "di-netBodyText";
    el.textContent = `${value.name}: ${value.message}`;
    return el;
  }
  if (value === null || typeof value !== "object") {
    const el = doc.createElement("div");
    el.className = "di-netBodyText";
    el.textContent = String(value);
    return el;
  }
  return createJsonViewer(doc, value, { maxDepth: 6, maxKeys: 200, maxNodes: 2000 });
}

function appendSection(doc: Document, wrap: HTMLElement, label: string, value: unknown): void {
  if (typeof value === "undefined") return;
  const section = doc.createElement("div");
  section.className = "di-netBodySection";
  const title = doc.createElement("div");
  title.className = "di-netBodyLabel";
  title.textContent = label;
  section.append(title, valueToElement(doc, value));
  wrap.append(section);
}

export function createNetworkDetails(doc: Document, entry: NetworkLogEntry): HTMLElement | null {
  const hasReq = typeof entry.requestBody !== "undefined";
  const hasRes = typeof entry.responseBody !== "undefined";
  if (!hasReq && !hasRes) return null;

  const details = doc.createElement("details");
  details.className = "di-details";

  const summary = doc.createElement("summary");
  summary.className = "di-detailsSummary";
  summary.textContent = "Body";

  const body = doc.createElement("div");
  body.className = "di-detailsBody";

  const grid = doc.createElement("div");
  grid.className = "di-netBodies";

  appendSection(doc, grid, "Request body", entry.requestBody);
  appendSection(doc, grid, "Response body", entry.responseBody);

  body.append(grid);
  details.append(summary, body);
  return details;
}


