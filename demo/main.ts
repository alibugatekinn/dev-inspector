import { initDevInspector, type LogEntry } from "../src/index";
import "./styles.css";

function ensureDocument(): Document {
  if (typeof document === "undefined") throw new Error("Demo requires a browser environment.");
  return document;
}

function mountRoot(doc: Document): HTMLElement {
  const root = doc.getElementById("demo-root");
  if (!root) throw new Error("Missing #demo-root");
  return root;
}

function el<K extends keyof HTMLElementTagNameMap>(
  doc: Document,
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> & { className?: string; text?: string } = {},
  children: Array<Node | string> = [],
): HTMLElementTagNameMap[K] {
  const node = doc.createElement(tag);
  if (props.className) node.className = props.className;
  if (typeof props.text === "string") node.textContent = props.text;
  for (const [k, v] of Object.entries(props)) {
    if (k === "className" || k === "text") continue;
    (node as unknown as Record<string, unknown>)[k] = v;
  }
  for (const c of children) node.append(typeof c === "string" ? doc.createTextNode(c) : c);
  return node;
}

function createId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const doc = ensureDocument();
const app = mountRoot(doc);

const { storage } = initDevInspector({
  maxSize: 500,
  panelOptions: { initiallyOpen: true, title: "Dev Inspector" },
  networkOptions: { includeBodies: false },
});

// Background grid (visual only).
app.append(el(doc, "div", { className: "di-bg-grid" }));

const out = el(doc, "div", {
  className: "di-output",
  text: "Ready.\nUse the buttons above to generate console logs and network requests.\nOpen the “Dev Inspector” panel in the bottom-right to inspect events.",
});

const addManualLog = (message: string) => {
  const entry: LogEntry = {
    id: createId(),
    source: "console",
    level: "log",
    timestamp: Date.now(),
    args: [],
    message,
  };
  storage.add(entry);
};

type FetchOptions = {
  abortAfterMs?: number;
  init?: Omit<RequestInit, "method">;
};

const runFetch = async (url: string, method: string, opts: FetchOptions = {}) => {
  const t0 = performance.now();
  out.textContent = `fetch ${method} ${url}\n...`;
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const tid =
    typeof opts.abortAfterMs === "number" && controller
      ? window.setTimeout(() => controller.abort(), Math.max(1, opts.abortAfterMs))
      : null;
  try {
    const res = await fetch(url, { ...(opts.init ?? {}), method, signal: controller?.signal });
    const ct = res.headers.get("content-type") ?? "";
    const body = ct.includes("application/json") ? JSON.stringify(await res.json(), null, 2) : await res.text();
    const ms = Math.round(performance.now() - t0);
    out.textContent = `fetch ${method} ${url}\nstatus: ${res.status}\nms: ${ms}\n\n${body.slice(0, 4000)}`;
  } catch (e) {
    const ms = Math.round(performance.now() - t0);
    out.textContent = `fetch ${method} ${url}\nms: ${ms}\nerror: ${String(e)}`;
  } finally {
    if (typeof tid === "number") window.clearTimeout(tid);
  }
};

type XhrOptions = {
  abortAfterMs?: number;
  body?: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
};

const runXhr = (url: string, method: string, opts: XhrOptions = {}) => {
  const t0 = performance.now();
  out.textContent = `xhr ${method} ${url}\n...`;
  try {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    if (typeof opts.timeoutMs === "number") xhr.timeout = Math.max(1, opts.timeoutMs);
    if (opts.headers) {
      for (const [k, v] of Object.entries(opts.headers)) xhr.setRequestHeader(k, v);
    }
    xhr.addEventListener("loadend", () => {
      const ms = Math.round(performance.now() - t0);
      const txt = typeof xhr.responseText === "string" ? xhr.responseText : "";
      out.textContent = `xhr ${method} ${url}\nstatus: ${xhr.status}\nms: ${ms}\n\n${txt.slice(0, 4000)}`;
    });
    xhr.addEventListener("timeout", () => {
      const ms = Math.round(performance.now() - t0);
      out.textContent = `xhr ${method} ${url}\nms: ${ms}\nerror: timeout (${xhr.timeout}ms)`;
    });
    xhr.addEventListener("abort", () => {
      const ms = Math.round(performance.now() - t0);
      out.textContent = `xhr ${method} ${url}\nms: ${ms}\nerror: aborted`;
    });
    if (typeof opts.abortAfterMs === "number") window.setTimeout(() => xhr.abort(), Math.max(1, opts.abortAfterMs));
    xhr.send(opts.body);
  } catch (e) {
    const ms = Math.round(performance.now() - t0);
    out.textContent = `xhr ${method} ${url}\nms: ${ms}\nerror: ${String(e)}`;
  }
};

const page = el(doc, "div", { className: "di-page" });

const header = el(doc, "header", { className: "di-header" }, [
  el(doc, "h1", { text: "Dev Inspector Playground" }),
  el(doc, "p", { className: "di-sub", text: "Use the buttons below to generate real console logs and network requests." }),
  el(doc, "p", { className: "di-sub", text: "Then open the “Dev Inspector” panel in the bottom-right to inspect events in real-time." }),
]);

const playgroundSection = el(doc, "section", { className: "di-section", id: "playground" }, [
  el(doc, "h2", { text: "Playground" }),
]);

const playgroundGrid = el(doc, "div", { className: "di-playground" });

const consolePanel = el(doc, "div", { className: "di-play-card di-play-card--console" });
const consoleHead = el(doc, "div", { className: "di-play-head" }, [
  el(doc, "h3", { text: "Console" }),
  el(doc, "p", { text: "Real console calls. Watch them appear in the panel instantly." }),
]);
const consoleRow = el(doc, "div", { className: "di-chips" }, [
  el(doc, "button", { className: "di-chip di-chip--log", type: "button", text: "log", ariaLabel: "Generate console.log" }),
  el(doc, "button", { className: "di-chip di-chip--info", type: "button", text: "info", ariaLabel: "Generate console.info" }),
  el(doc, "button", { className: "di-chip di-chip--warn", type: "button", text: "warn", ariaLabel: "Generate console.warn" }),
  el(doc, "button", { className: "di-chip di-chip--error", type: "button", text: "error", ariaLabel: "Generate console.error" }),
  el(doc, "button", { className: "di-chip di-chip--info", type: "button", text: "debug", ariaLabel: "Generate console.debug" }),
]);

const [bLog, bInfo, bWarn, bErr, bDbg] = Array.from(consoleRow.querySelectorAll("button"));
const rand = () => Math.random().toString(16).slice(2, 8);
const complex = () => ({ id: rand(), ok: true, nested: { t: Date.now() }, arr: [1, "x", { k: "v" }] });

bLog?.addEventListener("click", () => console.log("demo log", rand()));
bInfo?.addEventListener("click", () => console.info("demo info", rand()));
bWarn?.addEventListener("click", () => console.warn("demo warn", rand()));
bErr?.addEventListener("click", () => console.error("demo error", rand()));
bDbg?.addEventListener("click", () => console.debug("demo debug", rand()));

const jsonRow = el(doc, "div", { className: "di-chips" });
const objBtn = el(doc, "button", { className: "di-chip di-chip--log", type: "button", text: "object", ariaLabel: "Log an object" });
const bigJsonBtn = el(doc, "button", { className: "di-chip di-chip--log", type: "button", text: "big JSON", ariaLabel: "Log big JSON payload" });
const errorObjBtn = el(doc, "button", { className: "di-chip di-chip--error", type: "button", text: "Error()", ariaLabel: "Log an Error object" });
const clearPanelBtn = el(doc, "button", { className: "di-chip di-chip--warn", type: "button", text: "clear panel", ariaLabel: "Clear Dev Inspector panel logs" });

const createBigJson = () => {
  const blocks = Array.from({ length: 25 }, (_v, i) => ({
    id: `blk_${i}_${rand()}`,
    type: i % 5 === 0 ? "table" : i % 3 === 0 ? "list" : "paragraph",
    data:
      i % 5 === 0
        ? { withHeadings: true, content: [["k", "v"], [rand(), rand()]] }
        : i % 3 === 0
          ? { style: "checklist", items: Array.from({ length: 6 }, (_x, j) => ({ content: `Item ${i}.${j}`, meta: { checked: j % 2 === 0 } })) }
          : { text: `Lorem ipsum ${i} ${rand()} ${rand()} ${rand()}` },
  }));

  return {
    success: true,
    blog: {
      _id: `id_${rand()}${rand()}${rand()}`,
      title: `Demo Blog ${rand()}`,
      author: "Ali Buğatekin",
      createdAt: new Date().toISOString(),
      readingTime: 6,
      tags: ["NextJS", "ReactJS", "DevTools", rand()],
      status: "draft",
      content: {
        time: Date.now(),
        version: "2.31.0",
        blocks,
      },
      summary: `Summary ${rand()} ${rand()} ${rand()}`,
    },
  };
};

bigJsonBtn.addEventListener("click", () => {
  const payload = createBigJson();
  console.log("json", payload);
});

objBtn.addEventListener("click", () => {
  console.log("object", complex());
});

errorObjBtn.addEventListener("click", () => console.error(new Error(`Demo error ${rand()}`)));

clearPanelBtn.addEventListener("click", () => {
  storage.clear();
  out.textContent = "Cleared panel logs.";
});

jsonRow.append(objBtn, bigJsonBtn, errorObjBtn, clearPanelBtn);

const manualRow = el(doc, "div", { className: "di-row" });
const manualInput = el(doc, "input", {
  className: "di-input",
  value: "Manual log: hello",
  placeholder: "Type a manual log message (added directly to storage)...",
  ariaLabel: "Manual log message",
}) as HTMLInputElement;
const manualBtn = el(doc, "button", { className: "di-btn", type: "button", text: "Add to panel", ariaLabel: "Add manual entry directly to storage" });
manualBtn.addEventListener("click", () => addManualLog(manualInput.value.trim() || "Manual log"));
manualRow.append(manualInput, manualBtn);

const spamRow = el(doc, "div", { className: "di-row" });
const spamBtn = el(doc, "button", { className: "di-btn", type: "button", text: "Spam 25 logs", ariaLabel: "Generate 25 console.log entries" });
spamBtn.addEventListener("click", () => {
  for (let i = 0; i < 25; i += 1) console.log("spam", i, rand());
});
spamRow.append(spamBtn);

consolePanel.append(consoleHead, consoleRow, jsonRow, manualRow, spamRow);

const networkPanel = el(doc, "div", { className: "di-play-card di-play-card--network" });
const networkHead = el(doc, "div", { className: "di-play-head" }, [
  el(doc, "h3", { text: "Network" }),
  el(doc, "p", { text: "Real fetch/XHR requests (success, errors, slow, timeout, abort, POST)." }),
]);
const netRow0 = el(doc, "div", { className: "di-row" });
const transportSel = el(doc, "select", { className: "di-select", ariaLabel: "Network transport" }) as HTMLSelectElement;
["fetch", "xhr"].forEach((m) => transportSel.append(el(doc, "option", { value: m, text: m })));
const methodSel = el(doc, "select", { className: "di-select", ariaLabel: "HTTP method" }) as HTMLSelectElement;
["GET", "POST"].forEach((m) => methodSel.append(el(doc, "option", { value: m, text: m })));
netRow0.append(transportSel, methodSel);

const endpoints = {
  ok: "https://httpstat.us/200",
  notFound: "https://httpstat.us/404",
  serverError: "https://httpstat.us/500",
  slow: "https://httpstat.us/200?sleep=2000",
  timeout: "https://httpstat.us/200?sleep=7000",
  success: "https://jsonplaceholder.typicode.com/todos/1",
  post: "https://jsonplaceholder.typicode.com/posts",
} as const;

const run = (url: string, opts?: { abortAfterMs?: number; forcePostJson?: boolean }) => {
  const transport = transportSel.value === "xhr" ? "xhr" : "fetch";
  const method = methodSel.value;
  if (opts?.forcePostJson) {
    const payload = { ok: true, id: rand(), ts: Date.now() };
    const body = JSON.stringify(payload);
    if (transport === "xhr") {
      runXhr(url, "POST", { body, headers: { "content-type": "application/json" }, abortAfterMs: opts.abortAfterMs });
    } else {
      void runFetch(url, "POST", {
        abortAfterMs: opts.abortAfterMs,
        init: { headers: { "content-type": "application/json" }, body },
      });
    }
    return;
  }
  if (transport === "xhr") runXhr(url, method, { abortAfterMs: opts?.abortAfterMs, timeoutMs: opts?.abortAfterMs });
  else void runFetch(url, method, { abortAfterMs: opts?.abortAfterMs });
};

const netRow1 = el(doc, "div", { className: "di-chips" }, [
  el(doc, "button", { className: "di-chip di-chip--ok", type: "button", text: "200", ariaLabel: "Generate HTTP 200 request" }),
  el(doc, "button", { className: "di-chip di-chip--net", type: "button", text: "404", ariaLabel: "Generate HTTP 404 request" }),
  el(doc, "button", { className: "di-chip di-chip--net", type: "button", text: "500", ariaLabel: "Generate HTTP 500 request" }),
  el(doc, "button", { className: "di-chip di-chip--net", type: "button", text: "slow", ariaLabel: "Generate slow request" }),
  el(doc, "button", { className: "di-chip di-chip--warn", type: "button", text: "timeout", ariaLabel: "Generate timeout request" }),
  el(doc, "button", { className: "di-chip di-chip--warn", type: "button", text: "abort", ariaLabel: "Generate aborted request" }),
  el(doc, "button", { className: "di-chip di-chip--ok", type: "button", text: "success", ariaLabel: "Generate success JSON request" }),
  el(doc, "button", { className: "di-chip di-chip--net", type: "button", text: "POST JSON", ariaLabel: "Generate POST JSON request" }),
]);

const [b200, b404, b500, bSlow, bTimeout, bAbort, bSuccess, bPostJson] = Array.from(netRow1.querySelectorAll("button"));
b200?.addEventListener("click", () => run(endpoints.ok));
b404?.addEventListener("click", () => run(endpoints.notFound));
b500?.addEventListener("click", () => run(endpoints.serverError));
bSlow?.addEventListener("click", () => run(endpoints.slow));
bTimeout?.addEventListener("click", () => run(endpoints.timeout, { abortAfterMs: 1200 }));
bAbort?.addEventListener("click", () => run(endpoints.ok, { abortAfterMs: 120 }));
bSuccess?.addEventListener("click", () => run(endpoints.success));
bPostJson?.addEventListener("click", () => run(endpoints.post, { forcePostJson: true }));

const netRow2 = el(doc, "div", { className: "di-row" });
const urlInput = el(doc, "input", {
  className: "di-input",
  value: endpoints.success,
  placeholder: "Enter a custom URL…",
  ariaLabel: "Custom request URL",
}) as HTMLInputElement;
const runCustomBtn = el(doc, "button", { className: "di-btn", type: "button", text: "Run URL", ariaLabel: "Run custom URL" });
runCustomBtn.addEventListener("click", () => run(urlInput.value.trim() || endpoints.success));
netRow2.append(urlInput, runCustomBtn);

networkPanel.append(networkHead, netRow0, netRow1, netRow2, out);

playgroundGrid.append(consolePanel, networkPanel);
playgroundSection.append(playgroundGrid);

page.append(header, playgroundSection);
app.append(page);

console.log("Dev Inspector demo ready");


