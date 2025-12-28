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

type IconName =
  | "sparkles"
  | "play"
  | "copy"
  | "github"
  | "npm"
  | "external"
  | "console"
  | "network"
  | "storage"
  | "resize"
  | "framework"
  | "code";

function icon(doc: Document, name: IconName, className = "di-icon"): SVGSVGElement {
  const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add(...className.split(" ").filter(Boolean));

  const path = doc.createElementNS("http://www.w3.org/2000/svg", "path");
  const paths: Record<IconName, string> = {
    sparkles: "M12 2l1.2 3.6L17 7l-3.8 1.4L12 12l-1.2-3.6L7 7l3.8-1.4L12 2z M5 13l.8 2.4L8 16l-2.2.6L5 19l-.8-2.4L2 16l2.2-.6L5 13z M19 14l.9 2.7L22 17l-2.1.3L19 20l-.9-2.7L16 17l2.1-.3L19 14z",
    play: "M8 5v14l11-7L8 5z",
    copy: "M9 9h10v10H9V9z M5 5h10v4H9v6H5V5z",
    github:
      "M9 19c-4 1.2-4-2-5-2m10 4v-3.1c0-.9.3-1.6.9-2.1-3 0-6.1-1.5-6.1-6.6 0-1.5.5-2.7 1.3-3.6-.1-.3-.6-1.7.1-3.6 0 0 1.1-.3 3.6 1.3 1-.3 2-.5 3.1-.5 1.1 0 2.1.2 3.1.5 2.5-1.6 3.6-1.3 3.6-1.3.7 1.9.2 3.3.1 3.6.8.9 1.3 2.1 1.3 3.6 0 5.1-3.1 6.6-6.1 6.6.6.5.9 1.2.9 2.1V21",
    npm: "M3 7h18v10H12v-8H9v8H3V7z",
    external: "M14 5h5v5m0-5L10 14m-4 0v5h5",
    console: "M4 6h16v12H4V6z M7 10l2 2-2 2 M11 14h4",
    network: "M6 16a2 2 0 1 0 0.001 0z M18 8a2 2 0 1 0 0.001 0z M18 16a2 2 0 1 0 0.001 0z M8 15l8-6 M8 17l8 0",
    storage: "M4 7c0-1.1 3.6-2 8-2s8 .9 8 2-3.6 2-8 2-8-.9-8-2zm0 5c0 1.1 3.6 2 8 2s8-.9 8-2m-16 5c0 1.1 3.6 2 8 2s8-.9 8-2",
    resize: "M9 15l-4 4m0-4h4v4 M15 9l4-4m0 4h-4V5",
    framework: "M12 2l9 7-9 13L3 9l9-7z M3 9h18",
    code: "M9 18l-6-6 6-6 M15 6l6 6-6 6",
  };
  path.setAttribute("d", paths[name]);
  svg.append(path);
  return svg;
}

const doc = ensureDocument();
const app = mountRoot(doc);

const { storage } = initDevInspector({
  maxSize: 500,
  panelOptions: { initiallyOpen: true, title: "Dev Inspector" },
  networkOptions: { includeBodies: false },
});

async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    void 0;
  }

  try {
    const ta = doc.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "true");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    doc.body.append(ta);
    ta.select();
    const ok = doc.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

function codeToken(doc: Document, text: string, cls: string): HTMLSpanElement {
  return el(doc, "span", { className: `tok ${cls}`, text });
}

function codeLine(doc: Document, parts: Array<{ t: string; c?: string }>): HTMLDivElement {
  const line = el(doc, "div", { className: "di-code-line" });
  for (const p of parts) line.append(p.c ? codeToken(doc, p.t, p.c) : doc.createTextNode(p.t));
  return line;
}

// Background grid (visual only).
app.append(el(doc, "div", { className: "di-bg-grid" }));

const out = el(doc, "div", {
  className: "di-output",
  text: "Ready.\nUse the playground below to generate console logs and network requests.\nThe Dev Inspector panel is open in the bottom-right.",
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

const repoUrl = "https://github.com/alibugatekinn/dev-inspector";
const npmUrl = "https://www.npmjs.com/package/dev-inspector";

const nav = el(doc, "div", { className: "di-nav" }, [
  el(doc, "div", { className: "di-nav-inner" }, [
    el(doc, "a", { className: "di-brand", href: "#top" }, [
      el(doc, "span", { className: "di-brand-dot" }),
      el(doc, "span", { className: "di-brand-name", text: "Dev Inspector" }),
    ]),
    el(doc, "div", { className: "di-nav-links" }, [
      el(doc, "a", { className: "di-btn", href: "#features", ariaLabel: "Jump to features" }, [icon(doc, "sparkles", "di-icon di-icon--muted"), "Features"]),
      el(doc, "a", { className: "di-btn", href: "#playground", ariaLabel: "Jump to playground" }, [icon(doc, "play", "di-icon di-icon--muted"), "Playground"]),
      el(doc, "a", { className: "di-btn", href: repoUrl, target: "_blank", rel: "noreferrer", ariaLabel: "Open GitHub repository" }, [
        icon(doc, "github", "di-icon di-icon--muted"),
        "GitHub",
        icon(doc, "external", "di-icon di-icon--muted"),
      ]),
    ]),
  ]),
]);

const hero = el(doc, "header", { className: "di-hero", id: "top" }, [
  el(doc, "div", { className: "di-badge" }, [icon(doc, "sparkles", "di-icon"), "dev-inspector • in-page devtools"]),
  el(doc, "h1", { text: "In-page DevTools for your web apps" }),
  el(doc, "p", {
    className: "di-lead",
    text: "Capture console logs and network requests in real-time with a lightweight, resizable panel that lives inside your app.",
  }),
  el(doc, "div", { className: "di-cta-row" }, [
    el(doc, "a", { className: "di-btn di-btn--primary", href: "#playground", ariaLabel: "Jump to the live playground" }, [
      icon(doc, "play"),
      "Try the demo",
    ]),
    el(doc, "a", { className: "di-btn", href: repoUrl, target: "_blank", rel: "noreferrer", ariaLabel: "Open GitHub repository" }, [
      icon(doc, "github"),
      "GitHub",
      icon(doc, "external", "di-icon di-icon--muted"),
    ]),
    el(doc, "a", { className: "di-btn", href: npmUrl, target: "_blank", rel: "noreferrer", ariaLabel: "Open npm package" }, [
      icon(doc, "npm"),
      "npm",
      icon(doc, "external", "di-icon di-icon--muted"),
    ]),
  ]),
]);

const installCmd = "npm i dev-inspector";
const initCode =
  `import { initDevInspector } from "dev-inspector";\n\n` +
  `initDevInspector({\n` +
  `  maxSize: 500,\n` +
  `  networkOptions: { includeBodies: false },\n` +
  `  panelOptions: { initiallyOpen: true, title: "Dev Inspector" },\n` +
  `});\n`;

const quickstart = el(doc, "div", { className: "di-quickstart" });

const installCard = el(doc, "div", { className: "di-code-card di-code-card--install" });
const installCopyBtn = el(doc, "button", { className: "di-code-copy", type: "button", ariaLabel: "Copy install command" }, [
  icon(doc, "copy", "di-icon di-icon--muted"),
  "Copy",
]);
installCopyBtn.addEventListener("click", async () => {
  const ok = await copyText(installCmd);
  installCopyBtn.textContent = ok ? "Copied" : "Copy";
  if (ok) window.setTimeout(() => (installCopyBtn.textContent = "Copy"), 1200);
});
installCard.append(
  el(doc, "div", { className: "di-code-top" }, [
    el(doc, "div", { className: "di-code-label", text: "Install" }),
    installCopyBtn,
  ]),
  el(doc, "pre", { className: "di-code-pre" }, [el(doc, "code", { text: installCmd })]),
);

const initCard = el(doc, "div", { className: "di-code-card di-code-card--init" });
const initCopyBtn = el(doc, "button", { className: "di-code-copy", type: "button", ariaLabel: "Copy init code" }, [
  icon(doc, "copy", "di-icon di-icon--muted"),
  "Copy",
]);
initCopyBtn.addEventListener("click", async () => {
  const ok = await copyText(initCode);
  initCopyBtn.textContent = ok ? "Copied" : "Copy";
  if (ok) window.setTimeout(() => (initCopyBtn.textContent = "Copy"), 1200);
});

const initCodeEl = el(doc, "code", { className: "di-code-js" });
initCodeEl.append(
  codeLine(doc, [
    { t: "import ", c: "kw" },
    { t: "{ initDevInspector }", c: "plain" },
    { t: " ", c: "plain" },
    { t: "from", c: "kw" },
    { t: " ", c: "plain" },
    { t: '"dev-inspector"', c: "str" },
    { t: ";" },
  ]),
  codeLine(doc, [{ t: "" }]),
  codeLine(doc, [
    { t: "initDevInspector", c: "fn" },
    { t: "(", c: "punc" },
    { t: "{", c: "punc" },
  ]),
  codeLine(doc, [
    { t: "  " },
    { t: "maxSize", c: "key" },
    { t: ": " },
    { t: "500", c: "num" },
    { t: ",", c: "punc" },
  ]),
  codeLine(doc, [
    { t: "  " },
    { t: "networkOptions", c: "key" },
    { t: ": " },
    { t: "{", c: "punc" },
    { t: " includeBodies", c: "key" },
    { t: ": " },
    { t: "false", c: "kw" },
    { t: " }", c: "punc" },
    { t: ",", c: "punc" },
  ]),
  codeLine(doc, [
    { t: "  " },
    { t: "panelOptions", c: "key" },
    { t: ": " },
    { t: "{", c: "punc" },
    { t: " initiallyOpen", c: "key" },
    { t: ": " },
    { t: "true", c: "kw" },
    { t: ", ", c: "punc" },
    { t: "title", c: "key" },
    { t: ": " },
    { t: '"Dev Inspector"', c: "str" },
    { t: " }", c: "punc" },
    { t: ",", c: "punc" },
  ]),
  codeLine(doc, [
    { t: "}", c: "punc" },
    { t: ")", c: "punc" },
    { t: ";", c: "punc" },
  ]),
);

initCard.append(
  el(doc, "div", { className: "di-code-top" }, [
    el(doc, "div", { className: "di-code-label", text: "Init" }),
    initCopyBtn,
  ]),
  el(doc, "pre", { className: "di-code-pre" }, [initCodeEl]),
);

quickstart.append(installCard, initCard);

const heroFoot = el(doc, "p", {
  className: "di-note",
  text: "Browser-only: the UI needs document. For SSR frameworks, initialize client-side.",
});

hero.append(quickstart, heroFoot);

const featuresSection = el(doc, "section", { className: "di-section", id: "features" }, [
  el(doc, "h2", { text: "Features" }),
  el(doc, "p", {
    className: "di-section-sub",
    text: "A tiny, framework-agnostic DevTools panel that lives inside your app — perfect for QA, staging environments, and debugging on devices where browser DevTools are limited.",
  }),
  el(doc, "div", { className: "di-features" }, [
    el(doc, "div", { className: "di-feature" }, [
      el(doc, "div", { className: "di-feature-top" }, [
        el(doc, "div", { className: "di-feature-ic" }, [icon(doc, "console")]),
        el(doc, "h3", { text: "Console Logging" }),
      ]),
      el(doc, "p", { text: "Intercepts log/info/warn/error/debug with structured output and rich JSON viewing." }),
    ]),
    el(doc, "div", { className: "di-feature" }, [
      el(doc, "div", { className: "di-feature-top" }, [
        el(doc, "div", { className: "di-feature-ic" }, [icon(doc, "network")]),
        el(doc, "h3", { text: "Network Tracing" }),
      ]),
      el(doc, "p", { text: "Captures fetch + XHR, status codes, timings, and request metadata in real-time." }),
    ]),
    el(doc, "div", { className: "di-feature" }, [
      el(doc, "div", { className: "di-feature-top" }, [
        el(doc, "div", { className: "di-feature-ic" }, [icon(doc, "storage")]),
        el(doc, "h3", { text: "In-memory Storage" }),
      ]),
      el(doc, "p", { text: "Ring-buffer storage with events so the UI stays fast and predictable." }),
    ]),
    el(doc, "div", { className: "di-feature" }, [
      el(doc, "div", { className: "di-feature-top" }, [
        el(doc, "div", { className: "di-feature-ic" }, [icon(doc, "resize")]),
        el(doc, "h3", { text: "Resizable Panel" }),
      ]),
      el(doc, "p", { text: "Drag to resize without leaving the viewport; tabs wrap nicely on small screens." }),
    ]),
    el(doc, "div", { className: "di-feature" }, [
      el(doc, "div", { className: "di-feature-top" }, [
        el(doc, "div", { className: "di-feature-ic" }, [icon(doc, "framework")]),
        el(doc, "h3", { text: "Framework Agnostic" }),
      ]),
      el(doc, "p", { text: "Works with any web app. Just install and call initDevInspector()." }),
    ]),
  ]),
]);

const playgroundSection = el(doc, "section", { className: "di-section", id: "playground" }, [
  el(doc, "h2", { text: "Live playground" }),
]);

const playgroundGrid = el(doc, "div", { className: "di-playground" });

const consolePanel = el(doc, "div", { className: "di-play-card di-play-card--console" });
const consoleHead = el(doc, "div", { className: "di-play-head" }, [
  el(doc, "div", { className: "di-play-title-stack" }, [
    el(doc, "div", { className: "di-play-title-top" }, [
      el(doc, "div", { className: "di-play-ic" }, [icon(doc, "console")]),
      el(doc, "h3", { text: "Console actions" }),
    ]),
    el(doc, "p", { text: "Click to generate real console calls (they appear in the panel instantly)." }),
  ]),
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
  el(doc, "div", { className: "di-play-title-stack" }, [
    el(doc, "div", { className: "di-play-title-top" }, [
      el(doc, "div", { className: "di-play-ic" }, [icon(doc, "network")]),
      el(doc, "h3", { text: "Network actions" }),
    ]),
    el(doc, "p", { text: "Trigger fetch/XHR requests (success, errors, slow, timeout, abort, POST)." }),
  ]),
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

const footer = el(doc, "footer", { className: "di-card di-footer" }, [
  el(doc, "div", { text: `© ${new Date().getFullYear()} Dev Inspector • MIT License` }),
  el(doc, "div", {}, [
    el(doc, "a", { href: repoUrl, target: "_blank", rel: "noreferrer", text: "GitHub", ariaLabel: "Open GitHub repository" }),
    doc.createTextNode(" • "),
    el(doc, "a", { href: npmUrl, target: "_blank", rel: "noreferrer", text: "npm", ariaLabel: "Open npm package" }),
    doc.createTextNode(" • "),
    el(doc, "a", { href: `${repoUrl}/blob/main/LICENSE`, target: "_blank", rel: "noreferrer", text: "License", ariaLabel: "Open license" }),
    doc.createTextNode(" • "),
    el(doc, "a", { href: `${repoUrl}/blob/main/CONTRIBUTING.md`, target: "_blank", rel: "noreferrer", text: "Contributions", ariaLabel: "Open contributing guide" }),
  ]),
]);

page.append(hero, featuresSection, playgroundSection, footer);
app.prepend(nav);
app.append(page);

console.log("Dev Inspector demo ready");


