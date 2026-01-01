import { initDevInspector } from "../src/index";
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

function group(doc: Document, title: string, description: string, content: HTMLElement): HTMLElement {
  const head = el(doc, "div", { className: "di-groupHead" }, [
    el(doc, "div", { className: "di-groupTitle", text: title }),
    el(doc, "div", { className: "di-groupDesc", text: description }),
  ]);
  const body = el(doc, "div", { className: "di-groupBody" }, [content]);
  return el(doc, "div", { className: "di-group" }, [head, body]);
}

type ChipVariant = "log" | "info" | "warn" | "error" | "ok" | "net";

function chip(
  doc: Document,
  variant: ChipVariant,
  main: string,
  sub: string,
  props: Partial<HTMLButtonElement> & { ariaLabel?: string; title?: string } = {},
): HTMLButtonElement {
  const btn = el(
    doc,
    "button",
    {
      className: `di-chip di-chip--${variant}`,
      type: "button",
      ariaLabel: props.ariaLabel,
      title: props.title,
      disabled: props.disabled,
    },
    [el(doc, "span", { className: "di-chipMain", text: main }), el(doc, "span", { className: "di-chipSub", text: sub })],
  ) as HTMLButtonElement;
  return btn;
}

const doc = ensureDocument();
const app = mountRoot(doc);

initDevInspector({
  maxSize: 500,
  panelOptions: { initiallyOpen: true, title: "Dev Inspector" },
  networkOptions: { includeBodies: true, maxBodyLength: 20000 },
});

// Background grid (visual only).
app.append(el(doc, "div", { className: "di-bg-grid" }));

const out = el(doc, "div", {
  className: "di-output",
  text: "Ready.\nUse the buttons above to generate console logs and network requests.\nOpen the “Dev Inspector” panel in the bottom-right to inspect events.",
});

const addManualLog = (message: string) => console.log(message);

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
  el(doc, "p", { text: "Click a button to trigger a real console call. Then inspect it in the panel." }),
]);
const consoleLevelsRow = el(doc, "div", { className: "di-chips" }, [
  chip(doc, "log", "log", "console.log('demo log', id)", { ariaLabel: "Run console.log with a random id" }),
  chip(doc, "info", "info", "console.info('demo info', id)", { ariaLabel: "Run console.info with a random id" }),
  chip(doc, "warn", "warn", "console.warn('demo warn', id)", { ariaLabel: "Run console.warn with a random id" }),
  chip(doc, "error", "error", "console.error('demo error', id)", { ariaLabel: "Run console.error with a random id" }),
  chip(doc, "info", "debug", "console.debug('demo debug', id)", { ariaLabel: "Run console.debug with a random id" }),
]);

const [bLog, bInfo, bWarn, bErr, bDbg] = Array.from(consoleLevelsRow.querySelectorAll("button"));
const rand = () => Math.random().toString(16).slice(2, 8);
const complex = () => ({ id: rand(), ok: true, nested: { t: Date.now() }, arr: [1, "x", { k: "v" }] });

bLog?.addEventListener("click", () => console.log("demo log", rand()));
bInfo?.addEventListener("click", () => console.info("demo info", rand()));
bWarn?.addEventListener("click", () => console.warn("demo warn", rand()));
bErr?.addEventListener("click", () => console.error("demo error", rand()));
bDbg?.addEventListener("click", () => console.debug("demo debug", rand()));

const jsonRow = el(doc, "div", { className: "di-chips" });
const objBtn = chip(doc, "log", "object", "console.log('object', {...})", { ariaLabel: "Log a nested object" });
const bigJsonBtn = chip(doc, "log", "big JSON", "console.log('json', bigJson)", { ariaLabel: "Log a big JSON payload" });
const errorObjBtn = chip(doc, "error", "Error()", "console.error(new Error(...))", { ariaLabel: "Log an Error object" });
const clearPanelBtn = chip(doc, "warn", "Clear", "not available", {
  ariaLabel: "Clear Dev Inspector panel logs (not available)",
  disabled: true,
  title: "This action is not available via the simplified public API.",
});

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
  console.log("Clear action is not available in the simplified API.");
  out.textContent = "Clear action is not available in the simplified API.";
});

jsonRow.append(objBtn, bigJsonBtn, errorObjBtn, clearPanelBtn);

const manualRow = el(doc, "div", { className: "di-row" });
const manualInput = el(doc, "input", {
  className: "di-input",
  value: "Manual log: hello",
  placeholder: "Type a message to console.log(...)",
  ariaLabel: "Console message",
}) as HTMLInputElement;
const manualBtn = el(doc, "button", { className: "di-btn", type: "button", text: "console.log(message)", ariaLabel: "Log the typed message to console" });
manualBtn.addEventListener("click", () => addManualLog(manualInput.value.trim() || "Manual log"));
manualRow.append(manualInput, manualBtn);

const spamRow = el(doc, "div", { className: "di-row" });
const spamBtn = el(doc, "button", { className: "di-btn", type: "button", text: "Generate 25 console.log calls", ariaLabel: "Generate 25 console.log entries" });
spamBtn.addEventListener("click", () => {
  for (let i = 0; i < 25; i += 1) console.log("spam", i, rand());
});
spamRow.append(spamBtn);

consolePanel.append(
  consoleHead,
  group(doc, "Levels", "Simple string logs by severity.", consoleLevelsRow),
  group(doc, "Structured payloads", "Objects and big JSON are expandable in the panel.", jsonRow),
  group(doc, "Custom message", "Type a message and log it.", manualRow),
  group(doc, "Bulk logs", "Generate many logs to test scrolling and maxSize.", spamRow),
);

const networkPanel = el(doc, "div", { className: "di-play-card di-play-card--network" });
const networkHead = el(doc, "div", { className: "di-play-head" }, [
  el(doc, "h3", { text: "Network" }),
  el(doc, "p", { text: "Click a button to make a real request. Inspect method, URL, status and bodies in the panel." }),
]);
const netRow0 = el(doc, "div", { className: "di-row" });
const transportLabel = el(doc, "div", { className: "di-controlLabel", text: "Transport" });
const transportSel = el(doc, "select", { className: "di-select", ariaLabel: "Network transport" }) as HTMLSelectElement;
["fetch", "xhr"].forEach((m) => transportSel.append(el(doc, "option", { value: m, text: m })));
const methodLabel = el(doc, "div", { className: "di-controlLabel", text: "Method" });
const methodSel = el(doc, "select", { className: "di-select", ariaLabel: "HTTP method" }) as HTMLSelectElement;
["GET", "POST"].forEach((m) => methodSel.append(el(doc, "option", { value: m, text: m })));
const transportControl = el(doc, "div", { className: "di-control" }, [transportLabel, transportSel]);
const methodControl = el(doc, "div", { className: "di-control" }, [methodLabel, methodSel]);
netRow0.append(transportControl, methodControl);

const API = "https://jsonplaceholder.typicode.com";
const endpoints = {
  post1: `${API}/posts/1`,
  commentsForPost1: `${API}/comments?postId=1`,
  user1: `${API}/users/1`,
  notFound: `${API}/__does_not_exist__`,
  createPost: `${API}/posts`,
} as const;

const run = (url: string, opts?: { abortAfterMs?: number; forcePostJson?: boolean; methodOverride?: "GET" | "POST" }) => {
  const transport = transportSel.value === "xhr" ? "xhr" : "fetch";
  const method = opts?.methodOverride ?? methodSel.value;
  const hint = opts?.forcePostJson ? "POST JSON" : opts?.abortAfterMs ? `abortAfterMs=${opts.abortAfterMs}` : "default";
  out.textContent = `action: ${transport} ${method} ${url}\nmode: ${hint}\n...`;
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
  chip(doc, "ok", "GET post", "/posts/1", { ariaLabel: "GET /posts/1 (JSONPlaceholder) using selected transport" }),
  chip(doc, "ok", "GET user", "/users/1", { ariaLabel: "GET /users/1 (JSONPlaceholder) using selected transport" }),
  chip(doc, "ok", "GET comments", "/comments?postId=1", { ariaLabel: "GET /comments?postId=1 (JSONPlaceholder) using selected transport" }),
  chip(doc, "net", "404", "/__does_not_exist__", { ariaLabel: "GET a non-existing endpoint (JSONPlaceholder) to produce 404" }),
  chip(doc, "warn", "abort", "/posts/1 (abort 80ms)", { ariaLabel: "Abort a real request quickly (client-side)" }),
  chip(doc, "net", "POST JSON", "/posts (create)", { ariaLabel: "POST /posts with a JSON body (JSONPlaceholder) using selected transport" }),
]);

const [bPost1, bUser1, bComments, b404, bAbort, bPostJson] = Array.from(netRow1.querySelectorAll("button"));
bPost1?.addEventListener("click", () => run(endpoints.post1, { methodOverride: "GET" }));
bUser1?.addEventListener("click", () => run(endpoints.user1, { methodOverride: "GET" }));
bComments?.addEventListener("click", () => run(endpoints.commentsForPost1, { methodOverride: "GET" }));
b404?.addEventListener("click", () => run(endpoints.notFound, { methodOverride: "GET" }));
bAbort?.addEventListener("click", () => run(endpoints.post1, { methodOverride: "GET", abortAfterMs: 80 }));
bPostJson?.addEventListener("click", () => run(endpoints.createPost, { forcePostJson: true }));

const netRow2 = el(doc, "div", { className: "di-row" });
const urlInput = el(doc, "input", {
  className: "di-input",
  value: endpoints.post1,
  placeholder: "Enter a custom URL…",
  ariaLabel: "Custom request URL",
}) as HTMLInputElement;
const runCustomBtn = el(doc, "button", { className: "di-btn", type: "button", text: "Run selected method", ariaLabel: "Run the selected method against the custom URL" });
runCustomBtn.addEventListener("click", () => run(urlInput.value.trim() || endpoints.post1));
netRow2.append(urlInput, runCustomBtn);

networkPanel.append(
  networkHead,
  group(doc, "Transport & method", "Transport affects presets. Method affects Custom URL. POST JSON is fixed to POST.", netRow0),
  group(doc, "Preset requests", "Realistic JSONPlaceholder endpoints (plus an abort scenario).", netRow1),
  group(doc, "Custom URL", "Run the selected method against any URL.", netRow2),
  out,
);

playgroundGrid.append(consolePanel, networkPanel);
playgroundSection.append(playgroundGrid);

page.append(header, playgroundSection);
app.append(page);

console.log("Dev Inspector demo ready");


