export function ensureDocument(): Document {
  if (typeof document === "undefined") {
    throw new Error("Panel UI requires a browser-like environment with document.");
  }
  return document;
}


