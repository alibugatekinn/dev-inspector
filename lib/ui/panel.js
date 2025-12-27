"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPanel = createPanel;
const logList_1 = require("./logList");
const panelStyles_1 = require("./panelStyles");
function ensureDocument() {
    if (typeof document === "undefined") {
        throw new Error("Panel UI requires a browser-like environment with document.");
    }
    return document;
}
function ensureStyle(doc) {
    const id = "dev-inspector-panel-style";
    const existing = doc.getElementById(id);
    if (existing)
        return;
    const style = doc.createElement("style");
    style.id = id;
    style.textContent = panelStyles_1.PANEL_CSS;
    doc.head.append(style);
}
function createPanel(options) {
    var _a, _b, _c;
    const doc = ensureDocument();
    ensureStyle(doc);
    const mount = (_a = options.mount) !== null && _a !== void 0 ? _a : doc.body;
    const title = (_b = options.title) !== null && _b !== void 0 ? _b : "Dev Inspector";
    let open = (_c = options.initiallyOpen) !== null && _c !== void 0 ? _c : false;
    const root = doc.createElement("div");
    root.className = "di-root";
    const toggleBtn = doc.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "di-toggle";
    toggleBtn.textContent = "Logs";
    const panel = doc.createElement("div");
    panel.className = `di-panel${open ? "" : " di-hidden"}`;
    const header = doc.createElement("div");
    header.className = "di-header";
    const titleEl = doc.createElement("div");
    titleEl.className = "di-title";
    titleEl.textContent = title;
    const actions = doc.createElement("div");
    actions.className = "di-actions";
    const clearBtn = doc.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "di-btn";
    clearBtn.textContent = "Clear";
    const closeBtn = doc.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "di-btn";
    closeBtn.textContent = "Close";
    actions.append(clearBtn, closeBtn);
    header.append(titleEl, actions);
    const body = doc.createElement("div");
    body.className = "di-body";
    const list = (0, logList_1.createLogList)(doc);
    body.append(list.el);
    panel.append(header, body);
    root.append(toggleBtn, panel);
    mount.append(root);
    const renderExisting = () => {
        list.clear();
        options.storage.getAll().forEach((e) => list.append(e));
    };
    renderExisting();
    const onNewLog = (entry) => {
        list.append(entry);
        body.scrollTop = body.scrollHeight;
    };
    const unsub = options.storage.onNewLog(onNewLog);
    const applyVisibility = () => {
        if (open)
            panel.classList.remove("di-hidden");
        else
            panel.classList.add("di-hidden");
    };
    const openPanel = () => {
        open = true;
        applyVisibility();
    };
    const closePanel = () => {
        open = false;
        applyVisibility();
    };
    const toggle = () => {
        open = !open;
        applyVisibility();
    };
    const onToggleClick = () => toggle();
    const onCloseClick = () => closePanel();
    const onClearClick = () => {
        options.storage.clear();
        renderExisting();
    };
    toggleBtn.addEventListener("click", onToggleClick);
    closeBtn.addEventListener("click", onCloseClick);
    clearBtn.addEventListener("click", onClearClick);
    const destroy = () => {
        toggleBtn.removeEventListener("click", onToggleClick);
        closeBtn.removeEventListener("click", onCloseClick);
        clearBtn.removeEventListener("click", onClearClick);
        unsub();
        root.remove();
    };
    return {
        open: openPanel,
        close: closePanel,
        toggle,
        destroy,
        isOpen: () => open,
    };
}
