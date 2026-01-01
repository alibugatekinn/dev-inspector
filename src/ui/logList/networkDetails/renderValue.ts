import { createJsonViewer } from "../../jsonViewer";

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

function safeStringify(value: unknown): string {
  const seen = new WeakSet<object>();
  const replacer = (_key: string, v: unknown) => {
    if (typeof v === "object" && v !== null) {
      const o = v as object;
      if (seen.has(o)) return "[circular]";
      seen.add(o);
    }
    return v;
  };
  try {
    return JSON.stringify(value, replacer, 2);
  } catch {
    try {
      return String(value);
    } catch {
      return "[unserializable]";
    }
  }
}

export function valueToElement(doc: Document, value: unknown): HTMLElement {
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

export function valueToCopyText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  return safeStringify(value);
}


