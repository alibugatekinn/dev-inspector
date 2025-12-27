import { LogStorage, createPanel, installConsoleLogger, installNetworkLogger, type LogEntry } from "../src/index";

function ensureDocument(): Document {
  if (typeof document === "undefined") throw new Error("Demo requires a browser environment.");
  return document;
}

function mountRoot(doc: Document): HTMLElement {
  const root = doc.getElementById("demo-root");
  if (!root) throw new Error("Missing #demo-root");
  return root;
}

function addDemoStyles(doc: Document): void {
  const id = "dev-inspector-demo-style";
  if (doc.getElementById(id)) return;
  const style = doc.createElement("style");
  style.id = id;
  style.textContent = `
    :root { color-scheme: dark; }
    body {
      margin: 0;
      padding: 18px;
      background: radial-gradient(1200px 700px at 20% 10%, #1b2b4a 0%, #0b0f16 55%, #070a0f 100%);
      color: #eaeaea;
      font: 14px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    }
    .demo-wrap {
      max-width: 980px;
      margin: 0 auto;
      display: grid;
      gap: 14px;
    }
    .demo-hero {
      display: grid;
      gap: 6px;
      padding: 14px 16px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(255,255,255,0.05);
      border-radius: 14px;
      backdrop-filter: blur(10px);
      box-shadow: 0 14px 45px rgba(0,0,0,0.35);
    }
    .demo-title {
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.2px;
    }
    .demo-sub {
      opacity: 0.85;
      line-height: 1.4;
    }
    .demo-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
    }
    @media (min-width: 920px) {
      .demo-grid { grid-template-columns: 1fr 1fr; }
    }
    .demo-card {
      padding: 14px 16px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(0,0,0,0.25);
      border-radius: 14px;
      backdrop-filter: blur(10px);
      box-shadow: 0 14px 45px rgba(0,0,0,0.20);
      display: grid;
      gap: 10px;
    }
    .demo-card h2 {
      margin: 0;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      opacity: 0.9;
    }
    .demo-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    .demo-btn {
      border: 1px solid rgba(255,255,255,0.14);
      background: rgba(255,255,255,0.06);
      color: #fff;
      padding: 8px 10px;
      border-radius: 12px;
      cursor: pointer;
      transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
      font: 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    .demo-btn:active { transform: translateY(1px); }
    .demo-btn:hover { background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.22); }
    .demo-input, .demo-select {
      border: 1px solid rgba(255,255,255,0.14);
      background: rgba(0,0,0,0.35);
      color: #fff;
      padding: 8px 10px;
      border-radius: 12px;
      outline: none;
      font: 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    .demo-input { min-width: 320px; flex: 1 1 320px; }
    .demo-kbd {
      font: 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      padding: 2px 6px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.16);
      background: rgba(255,255,255,0.06);
      opacity: 0.95;
    }
    .demo-out {
      padding: 10px 12px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(0,0,0,0.35);
      font: 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      white-space: pre-wrap;
      word-break: break-word;
      min-height: 60px;
    }
  `;
  doc.head.append(style);
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
addDemoStyles(doc);
const app = mountRoot(doc);

const storage = new LogStorage({ maxSize: 500 });
createPanel({ storage, initiallyOpen: true, title: "Dev Inspector" });

installConsoleLogger({ emit: (e) => storage.add(e) });
installNetworkLogger({ emit: (e) => storage.add(e), includeBodies: false });

const out = el(doc, "div", { className: "demo-out", text: "Ready. Open the Logs panel in the bottom-right.\nUse the buttons to generate logs and network requests." });

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

const runFetch = async (url: string, method: string) => {
  const t0 = performance.now();
  out.textContent = `fetch ${method} ${url}\n...`;
  try {
    const res = await fetch(url, { method });
    const ct = res.headers.get("content-type") ?? "";
    const body = ct.includes("application/json") ? JSON.stringify(await res.json(), null, 2) : await res.text();
    const ms = Math.round(performance.now() - t0);
    out.textContent = `fetch ${method} ${url}\nstatus: ${res.status}\nms: ${ms}\n\n${body.slice(0, 4000)}`;
  } catch (e) {
    const ms = Math.round(performance.now() - t0);
    out.textContent = `fetch ${method} ${url}\nms: ${ms}\nerror: ${String(e)}`;
  }
};

const runXhr = (url: string, method: string) => {
  const t0 = performance.now();
  out.textContent = `xhr ${method} ${url}\n...`;
  try {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.addEventListener("loadend", () => {
      const ms = Math.round(performance.now() - t0);
      const txt = typeof xhr.responseText === "string" ? xhr.responseText : "";
      out.textContent = `xhr ${method} ${url}\nstatus: ${xhr.status}\nms: ${ms}\n\n${txt.slice(0, 4000)}`;
    });
    xhr.send();
  } catch (e) {
    const ms = Math.round(performance.now() - t0);
    out.textContent = `xhr ${method} ${url}\nms: ${ms}\nerror: ${String(e)}`;
  }
};

const wrap = el(doc, "div", { className: "demo-wrap" });
const hero = el(doc, "div", { className: "demo-hero" }, [
  el(doc, "div", { className: "demo-title", text: "Dev Inspector Demo" }),
  el(doc, "div", { className: "demo-sub" }, [
    "This page is just for generating logs. Open the ",
    el(doc, "span", { className: "demo-kbd", text: "Logs" }),
    " panel in the bottom-right to watch both console logs and network requests.",
  ]),
]);

const grid = el(doc, "div", { className: "demo-grid" });

const consoleCard = el(doc, "div", { className: "demo-card" }, [el(doc, "h2", { text: "Console Log Generator" })]);
const btnRow1 = el(doc, "div", { className: "demo-row" }, [
  el(doc, "button", { className: "demo-btn", type: "button", text: "console.log" }),
  el(doc, "button", { className: "demo-btn", type: "button", text: "console.info" }),
  el(doc, "button", { className: "demo-btn", type: "button", text: "console.warn" }),
  el(doc, "button", { className: "demo-btn", type: "button", text: "console.error" }),
  el(doc, "button", { className: "demo-btn", type: "button", text: "console.debug" }),
]);

const [bLog, bInfo, bWarn, bErr, bDbg] = Array.from(btnRow1.querySelectorAll("button"));
const rand = () => Math.random().toString(16).slice(2, 8);
const complex = () => ({ id: rand(), ok: true, nested: { t: Date.now() }, arr: [1, "x", { k: "v" }] });

bLog?.addEventListener("click", () => console.log("demo log", rand(), complex()));
bInfo?.addEventListener("click", () => console.info("demo info", rand(), complex()));
bWarn?.addEventListener("click", () => console.warn("demo warn", rand(), complex()));
bErr?.addEventListener("click", () => console.error("demo error", rand(), new Error("demo error")));
bDbg?.addEventListener("click", () => console.debug("demo debug", rand(), complex()));

const manualRow = el(doc, "div", { className: "demo-row" });
const manualInput = el(doc, "input", { className: "demo-input", value: "Manual log: hello", placeholder: "Type a manual log message..." }) as HTMLInputElement;
const manualBtn = el(doc, "button", { className: "demo-btn", type: "button", text: "Add to panel" });
manualBtn.addEventListener("click", () => addManualLog(manualInput.value.trim() || "Manual log"));
manualRow.append(manualInput, manualBtn);

const spamRow = el(doc, "div", { className: "demo-row" });
const spamBtn = el(doc, "button", { className: "demo-btn", type: "button", text: "Spam 25 logs" });
spamBtn.addEventListener("click", () => {
  for (let i = 0; i < 25; i += 1) console.log("spam", i, rand());
});
spamRow.append(spamBtn);

consoleCard.append(btnRow1, manualRow, spamRow);

const netCard = el(doc, "div", { className: "demo-card" }, [el(doc, "h2", { text: "Network Generator" })]);
const netRow1 = el(doc, "div", { className: "demo-row" });
const methodSel = el(doc, "select", { className: "demo-select" }) as HTMLSelectElement;
["GET", "POST"].forEach((m) => methodSel.append(el(doc, "option", { value: m, text: m })));
const urlInput = el(doc, "input", {
  className: "demo-input",
  value: "https://jsonplaceholder.typicode.com/todos/1",
  placeholder: "Enter a URL (e.g. https://jsonplaceholder.typicode.com/todos/1)",
}) as HTMLInputElement;
netRow1.append(methodSel, urlInput);

const netRow2 = el(doc, "div", { className: "demo-row" });
const fetchBtn = el(doc, "button", { className: "demo-btn", type: "button", text: "Fetch" });
fetchBtn.addEventListener("click", () => runFetch(urlInput.value.trim(), methodSel.value));

const fetch404Btn = el(doc, "button", { className: "demo-btn", type: "button", text: "Fetch (404)" });
fetch404Btn.addEventListener("click", () => runFetch("https://jsonplaceholder.typicode.com/does-not-exist", "GET"));

const fetchErrBtn = el(doc, "button", { className: "demo-btn", type: "button", text: "Fetch (error)" });
fetchErrBtn.addEventListener("click", () => runFetch("http://127.0.0.1:1", "GET"));

const xhrBtn = el(doc, "button", { className: "demo-btn", type: "button", text: "XHR" });
xhrBtn.addEventListener("click", () => runXhr(urlInput.value.trim(), methodSel.value));

netRow2.append(fetchBtn, fetch404Btn, fetchErrBtn, xhrBtn);

netCard.append(netRow1, netRow2, out);

grid.append(consoleCard, netCard);
wrap.append(hero, grid);
app.append(wrap);

console.log("Dev Inspector demo ready");


