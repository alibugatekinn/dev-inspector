"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPanel = createPanel;
const logList_1 = require("./logList");
const panelStyles_1 = require("./panelStyles");
function getWindow() {
    return globalThis;
}
function queryOrThrow(root, selector) {
    const el = root.querySelector(selector);
    if (!el)
        throw new Error(`Missing required element: ${selector}`);
    return el;
}
const TOGGLE_BUTTON_HTML = `<span class="di-toggleTitle">Dev Inspector</span>` +
    `<span class="di-toggleMeta">` +
    `<span class="di-toggleBadge" data-di-toggle-count="console">` +
    `<svg class="di-toggleIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5.5C4 4.67 4.67 4 5.5 4H18.5C19.33 4 20 4.67 20 5.5V15.5C20 16.33 19.33 17 18.5 17H13.5L12 18.5L10.5 17H5.5C4.67 17 4 16.33 4 15.5V5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 8H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 11H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>` +
    `<span data-di-toggle-count-value="console">0</span>` +
    `<span class="di-toggleErr" data-di-toggle-error="console" aria-label="Console errors">` +
    `<span class="di-toggleErrIcon">!</span>` +
    `<span data-di-toggle-error-value="console">0</span>` +
    `</span>` +
    `</span>` +
    `<span class="di-toggleBadge" data-di-toggle-count="network">` +
    `<svg class="di-toggleIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 12L12 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="20" r="1.5" fill="currentColor"/></svg>` +
    `<span data-di-toggle-count-value="network">0</span>` +
    `<span class="di-toggleErr" data-di-toggle-error="network" aria-label="Network errors">` +
    `<span class="di-toggleErrIcon">!</span>` +
    `<span data-di-toggle-error-value="network">0</span>` +
    `</span>` +
    `</span>` +
    `</span>`;
const CONSOLE_TAB_HTML = `<svg class="di-tabIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5.5C4 4.67 4.67 4 5.5 4H18.5C19.33 4 20 4.67 20 5.5V15.5C20 16.33 19.33 17 18.5 17H13.5L12 18.5L10.5 17H5.5C4.67 17 4 16.33 4 15.5V5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 8H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 11H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>` +
    `<span>Console</span>` +
    `<span class="di-badge" data-di-count="console">0</span>`;
const NETWORK_TAB_HTML = `<svg class="di-tabIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 12L12 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="20" r="1.5" fill="currentColor"/></svg>` +
    `<span>Network</span>` +
    `<span class="di-badge" data-di-count="network">0</span>`;
function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}
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
function createPanelState(initiallyOpen) {
    return {
        open: initiallyOpen,
        tab: "console",
        entries: { console: [], network: [] },
        errorCounts: { console: 0, network: 0 },
    };
}
function buildPanelDOM(doc, options) {
    var _a, _b;
    const mount = (_a = options.mount) !== null && _a !== void 0 ? _a : doc.body;
    const title = (_b = options.title) !== null && _b !== void 0 ? _b : "Dev Inspector";
    const root = doc.createElement("div");
    root.className = "di-root";
    const toggleBtn = doc.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "di-toggle";
    toggleBtn.setAttribute("aria-label", "Dev Inspector");
    toggleBtn.innerHTML = TOGGLE_BUTTON_HTML;
    const panel = doc.createElement("div");
    panel.className = "di-panel";
    const resizeHandle = doc.createElement("div");
    resizeHandle.className = "di-resizeHandle";
    resizeHandle.setAttribute("role", "separator");
    resizeHandle.setAttribute("aria-label", "Resize panel");
    const header = doc.createElement("div");
    header.className = "di-header";
    const headerRow = doc.createElement("div");
    headerRow.className = "di-headerRow";
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
    headerRow.append(resizeHandle, titleEl, actions);
    const tabs = doc.createElement("div");
    tabs.className = "di-tabs";
    const consoleTab = doc.createElement("button");
    consoleTab.type = "button";
    consoleTab.className = "di-tab";
    consoleTab.innerHTML = CONSOLE_TAB_HTML;
    const networkTab = doc.createElement("button");
    networkTab.type = "button";
    networkTab.className = "di-tab";
    networkTab.innerHTML = NETWORK_TAB_HTML;
    tabs.append(consoleTab, networkTab);
    header.append(headerRow, tabs);
    const body = doc.createElement("div");
    body.className = "di-body";
    const list = (0, logList_1.createLogList)(doc);
    body.append(list.el);
    panel.append(header, body);
    root.append(toggleBtn, panel);
    mount.append(root);
    const counters = {
        headerConsoleCount: queryOrThrow(header, '[data-di-count="console"]'),
        headerNetworkCount: queryOrThrow(header, '[data-di-count="network"]'),
        toggleConsoleCount: queryOrThrow(toggleBtn, '[data-di-toggle-count-value="console"]'),
        toggleNetworkCount: queryOrThrow(toggleBtn, '[data-di-toggle-count-value="network"]'),
        toggleConsoleErrorCount: queryOrThrow(toggleBtn, '[data-di-toggle-error-value="console"]'),
        toggleNetworkErrorCount: queryOrThrow(toggleBtn, '[data-di-toggle-error-value="network"]'),
        toggleConsoleErrorWrap: queryOrThrow(toggleBtn, '[data-di-toggle-error="console"]'),
        toggleNetworkErrorWrap: queryOrThrow(toggleBtn, '[data-di-toggle-error="network"]'),
    };
    return { root, toggleBtn, panel, header, body, closeBtn, clearBtn, consoleTab, networkTab, resizeHandle, list, counters };
}
function attachResizeHandling(panel, resizeHandle) {
    var _a;
    const MAX_WIDTH_CAP = 920;
    const MAX_HEIGHT_CAP = 720;
    const MARGIN_X = 24;
    const MARGIN_Y = 68;
    const minSize = (() => {
        const r = panel.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
    })();
    const getMaxSize = () => {
        const win = getWindow();
        const vw = typeof win.innerWidth === "number" ? win.innerWidth : 0;
        const vh = typeof win.innerHeight === "number" ? win.innerHeight : 0;
        return {
            w: Math.max(200, Math.min(MAX_WIDTH_CAP, vw - MARGIN_X)),
            h: Math.max(180, Math.min(MAX_HEIGHT_CAP, vh - MARGIN_Y)),
        };
    };
    const getCurrentSize = () => {
        const r = panel.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
    };
    const applySize = (next) => {
        const max = getMaxSize();
        const effMinW = Math.min(minSize.w, max.w);
        const effMinH = Math.min(minSize.h, max.h);
        const w = clamp(next.w, effMinW, max.w);
        const h = clamp(next.h, effMinH, max.h);
        panel.style.width = `${w}px`;
        panel.style.height = `${h}px`;
    };
    const ensureWithinViewport = () => {
        if (!panel.style.width && !panel.style.height)
            return;
        applySize(getCurrentSize());
    };
    let resizing = false;
    let startX = 0;
    let startY = 0;
    let startW = 0;
    let startH = 0;
    const onResizeMove = (ev) => {
        if (!resizing)
            return;
        const dx = startX - ev.clientX;
        const dy = startY - ev.clientY;
        applySize({ w: startW + dx, h: startH + dy });
    };
    const stopResize = () => {
        var _a, _b, _c;
        if (!resizing)
            return;
        resizing = false;
        const win = getWindow();
        (_a = win.removeEventListener) === null || _a === void 0 ? void 0 : _a.call(win, "pointermove", onResizeMove);
        (_b = win.removeEventListener) === null || _b === void 0 ? void 0 : _b.call(win, "pointerup", stopResize);
        (_c = win.removeEventListener) === null || _c === void 0 ? void 0 : _c.call(win, "pointercancel", stopResize);
    };
    const onResizeStart = (ev) => {
        var _a, _b, _c;
        resizing = true;
        startX = ev.clientX;
        startY = ev.clientY;
        const cur = getCurrentSize();
        startW = cur.w;
        startH = cur.h;
        try {
            resizeHandle.setPointerCapture(ev.pointerId);
        }
        catch (_d) {
            void 0;
        }
        const win = getWindow();
        (_a = win.addEventListener) === null || _a === void 0 ? void 0 : _a.call(win, "pointermove", onResizeMove);
        (_b = win.addEventListener) === null || _b === void 0 ? void 0 : _b.call(win, "pointerup", stopResize);
        (_c = win.addEventListener) === null || _c === void 0 ? void 0 : _c.call(win, "pointercancel", stopResize);
    };
    const onWindowResize = () => ensureWithinViewport();
    const win = getWindow();
    (_a = win.addEventListener) === null || _a === void 0 ? void 0 : _a.call(win, "resize", onWindowResize);
    resizeHandle.addEventListener("pointerdown", onResizeStart);
    const destroy = () => {
        var _a;
        resizeHandle.removeEventListener("pointerdown", onResizeStart);
        stopResize();
        (_a = win.removeEventListener) === null || _a === void 0 ? void 0 : _a.call(win, "resize", onWindowResize);
    };
    return { destroy };
}
function bindStorageToPanelView(args) {
    const isConsoleError = (e) => e.source === "console" && e.level === "error";
    const isNetworkError = (e) => e.source === "network" && (typeof e.status !== "number" || e.status >= 400);
    const updateCounts = () => {
        args.counters.headerConsoleCount.textContent = String(args.state.entries.console.length);
        args.counters.headerNetworkCount.textContent = String(args.state.entries.network.length);
        args.counters.toggleConsoleCount.textContent = String(args.state.entries.console.length);
        args.counters.toggleNetworkCount.textContent = String(args.state.entries.network.length);
        args.counters.toggleConsoleErrorCount.textContent = String(args.state.errorCounts.console);
        args.counters.toggleNetworkErrorCount.textContent = String(args.state.errorCounts.network);
        args.counters.toggleConsoleErrorWrap.style.display = args.state.errorCounts.console > 0 ? "inline-flex" : "none";
        args.counters.toggleNetworkErrorWrap.style.display = args.state.errorCounts.network > 0 ? "inline-flex" : "none";
    };
    const renderActiveTab = () => {
        args.list.clear();
        args.state.entries[args.state.tab].forEach((e) => args.list.append(e));
        args.body.scrollTop = args.body.scrollHeight;
    };
    const hydrate = () => {
        args.state.entries.console = [];
        args.state.entries.network = [];
        args.state.errorCounts.console = 0;
        args.state.errorCounts.network = 0;
        args.storage.getAll().forEach((e) => {
            if (e.source === "network") {
                args.state.entries.network.push(e);
                if (isNetworkError(e))
                    args.state.errorCounts.network += 1;
            }
            else {
                args.state.entries.console.push(e);
                if (isConsoleError(e))
                    args.state.errorCounts.console += 1;
            }
        });
        updateCounts();
        args.updateTabStyles();
        renderActiveTab();
    };
    const onNewLog = (entry) => {
        if (entry.source === "network") {
            args.state.entries.network.push(entry);
            if (isNetworkError(entry))
                args.state.errorCounts.network += 1;
        }
        else {
            args.state.entries.console.push(entry);
            if (isConsoleError(entry))
                args.state.errorCounts.console += 1;
        }
        updateCounts();
        if (entry.source === args.state.tab) {
            args.list.append(entry);
            args.body.scrollTop = args.body.scrollHeight;
        }
    };
    const unsub = args.storage.onNewLog(onNewLog);
    const onCleared = () => {
        args.state.entries.console = [];
        args.state.entries.network = [];
        args.state.errorCounts.console = 0;
        args.state.errorCounts.network = 0;
        updateCounts();
        renderActiveTab();
    };
    args.storage.addEventListener("cleared", onCleared);
    hydrate();
    const destroy = () => {
        args.storage.removeEventListener("cleared", onCleared);
        unsub();
    };
    return { destroy, renderActiveTab, hydrate };
}
function setupPanelBehavior(dom, state, storage) {
    const applyVisibility = () => {
        if (state.open)
            dom.panel.classList.remove("di-hidden");
        else
            dom.panel.classList.add("di-hidden");
    };
    const updateTabStyles = () => {
        if (state.tab === "console") {
            dom.consoleTab.classList.add("di-tabActive");
            dom.networkTab.classList.remove("di-tabActive");
        }
        else {
            dom.networkTab.classList.add("di-tabActive");
            dom.consoleTab.classList.remove("di-tabActive");
        }
    };
    const bindings = bindStorageToPanelView({
        storage,
        state,
        list: dom.list,
        body: dom.body,
        counters: dom.counters,
        updateTabStyles,
    });
    applyVisibility();
    updateTabStyles();
    const resizeControls = attachResizeHandling(dom.panel, dom.resizeHandle);
    const open = () => {
        state.open = true;
        applyVisibility();
    };
    const close = () => {
        state.open = false;
        applyVisibility();
    };
    const toggle = () => {
        state.open = !state.open;
        applyVisibility();
    };
    const onToggleClick = () => toggle();
    const onCloseClick = () => close();
    const onClearClick = () => storage.clear();
    const onConsoleTab = () => {
        state.tab = "console";
        updateTabStyles();
        bindings.renderActiveTab();
    };
    const onNetworkTab = () => {
        state.tab = "network";
        updateTabStyles();
        bindings.renderActiveTab();
    };
    dom.toggleBtn.addEventListener("click", onToggleClick);
    dom.closeBtn.addEventListener("click", onCloseClick);
    dom.clearBtn.addEventListener("click", onClearClick);
    dom.consoleTab.addEventListener("click", onConsoleTab);
    dom.networkTab.addEventListener("click", onNetworkTab);
    const destroy = () => {
        dom.toggleBtn.removeEventListener("click", onToggleClick);
        dom.closeBtn.removeEventListener("click", onCloseClick);
        dom.clearBtn.removeEventListener("click", onClearClick);
        dom.consoleTab.removeEventListener("click", onConsoleTab);
        dom.networkTab.removeEventListener("click", onNetworkTab);
        resizeControls.destroy();
        bindings.destroy();
        dom.root.remove();
    };
    return { open, close, toggle, destroy, isOpen: () => state.open };
}
function createPanel(options) {
    var _a;
    const doc = ensureDocument();
    ensureStyle(doc);
    const dom = buildPanelDOM(doc, options);
    const state = createPanelState((_a = options.initiallyOpen) !== null && _a !== void 0 ? _a : false);
    const handle = setupPanelBehavior(dom, state, options.storage);
    return handle;
}
