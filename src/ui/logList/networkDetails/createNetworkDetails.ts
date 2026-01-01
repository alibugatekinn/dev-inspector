import type { NetworkLogEntry } from "../../../utils/types";
import { copyText, launchMiniConfetti } from "./copy";
import { valueToCopyText, valueToElement } from "./renderValue";

function createBodyDetails(doc: Document, title: string, value: unknown, truncated: boolean, maxLen: number | undefined): HTMLElement {
  const details = doc.createElement("details");
  details.className = "di-details di-netBodyDetails";

  const summary = doc.createElement("summary");
  summary.className = "di-detailsSummary di-netDetailsSummary";

  const titleEl = doc.createElement("span");
  titleEl.className = "di-netDetailsTitle";
  titleEl.textContent = title;

  const copyBtn = doc.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "di-copyBtn";
  copyBtn.textContent = "Copy";
  copyBtn.setAttribute("aria-label", `Copy ${title.toLowerCase()}`);

  copyBtn.addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const txt = valueToCopyText(value);
    void copyText(txt).then((ok) => {
      if (!ok) return;
      launchMiniConfetti(copyBtn);
      const prev = copyBtn.textContent;
      copyBtn.textContent = "Copied";
      globalThis.setTimeout(() => {
        copyBtn.textContent = prev ?? "Copy";
      }, 900);
    });
  });

  summary.append(titleEl, copyBtn);

  const body = doc.createElement("div");
  body.className = "di-detailsBody";

  if (truncated) {
    const warn = doc.createElement("div");
    warn.className = "di-netTrunc";
    warn.textContent = typeof maxLen === "number" ? `Truncated to first ${maxLen} characters.` : "Truncated.";
    body.append(warn);
  }

  body.append(valueToElement(doc, value));
  details.append(summary, body);
  return details;
}

export function createNetworkDetails(doc: Document, entry: NetworkLogEntry): HTMLElement | null {
  const hasReq = typeof entry.requestBody !== "undefined";
  const hasRes = typeof entry.responseBody !== "undefined";
  if (!hasReq && !hasRes) return null;

  const wrap = doc.createElement("div");
  wrap.className = "di-netDetailsWrap";

  if (hasReq) {
    wrap.append(createBodyDetails(doc, "Request", entry.requestBody, entry.requestBodyTruncated === true, entry.bodyMaxLength));
  }
  if (hasRes) {
    wrap.append(createBodyDetails(doc, "Response", entry.responseBody, entry.responseBodyTruncated === true, entry.bodyMaxLength));
  }

  return wrap;
}


