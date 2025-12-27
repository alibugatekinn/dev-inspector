"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installNetworkLogger = installNetworkLogger;
let seq = 0;
function createId() {
    seq += 1;
    return `${Date.now()}-${seq}`;
}
function now() {
    return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
}
function safeToString(value) {
    try {
        return String(value);
    }
    catch (_a) {
        return "[unstringifiable]";
    }
}
function truncateString(value, maxLen) {
    if (maxLen <= 0)
        return "";
    if (value.length <= maxLen)
        return value;
    return value.slice(0, maxLen);
}
function coerceUrl(input) {
    if (typeof input === "string")
        return input;
    if (!input)
        return undefined;
    if (typeof input.href === "string")
        return input.href;
    if (typeof input.url === "string")
        return input.url;
    return undefined;
}
function formatUrlForMessage(raw) {
    var _a, _b;
    if (!raw)
        return "";
    try {
        const loc = globalThis;
        const base = typeof ((_a = loc.location) === null || _a === void 0 ? void 0 : _a.href) === "string" ? loc.location.href : undefined;
        const u = new URL(raw, base);
        const origin = typeof ((_b = loc.location) === null || _b === void 0 ? void 0 : _b.origin) === "string" ? loc.location.origin : undefined;
        if (origin && u.origin === origin)
            return `${u.pathname}${u.search}${u.hash}`;
        return u.href;
    }
    catch (_c) {
        return raw;
    }
}
async function readResponseBody(response, maxLen) {
    try {
        const text = await response.text();
        return truncateString(text, maxLen);
    }
    catch (_a) {
        return undefined;
    }
}
function makeMessage(entry) {
    var _a;
    const m = (_a = entry.method) !== null && _a !== void 0 ? _a : "";
    const u = formatUrlForMessage(entry.url);
    const s = typeof entry.status === "number" ? ` ${entry.status}` : "";
    const d = typeof entry.durationMs === "number" ? ` ${Math.round(entry.durationMs)}ms` : "";
    return `${m} ${u}${s}${d}`.trim();
}
function getFetchTimingDurationMs(url, startPerf) {
    if (!url)
        return undefined;
    if (typeof performance === "undefined")
        return undefined;
    if (typeof performance.getEntriesByName !== "function")
        return undefined;
    const entries = performance.getEntriesByName(url);
    if (!entries || entries.length === 0)
        return undefined;
    const candidates = entries.filter((e) => {
        const rt = e;
        const initiatorOk = typeof rt.initiatorType === "string" ? rt.initiatorType === "fetch" : true;
        const startOk = typeof rt.startTime === "number" ? Math.abs(rt.startTime - startPerf) < 1000 : true;
        return initiatorOk && startOk;
    });
    const chosen = (candidates.length > 0 ? candidates : entries)[(candidates.length > 0 ? candidates : entries).length - 1];
    if (typeof chosen.duration === "number" && chosen.duration > 0)
        return chosen.duration;
    if (typeof chosen.responseEnd === "number" && typeof chosen.startTime === "number" && chosen.responseEnd > 0)
        return chosen.responseEnd - chosen.startTime;
    return undefined;
}
const xhrMeta = new WeakMap();
function installNetworkLogger(options) {
    var _a, _b;
    const includeBodies = (_a = options.includeBodies) !== null && _a !== void 0 ? _a : false;
    const maxBodyLength = Math.max(0, (_b = options.maxBodyLength) !== null && _b !== void 0 ? _b : 20000);
    let active = true;
    const g = globalThis;
    const canFetch = typeof g.fetch === "function";
    const canXhr = typeof g.XMLHttpRequest === "function";
    const originalFetch = g.fetch;
    const originalXhrOpen = canXhr ? g.XMLHttpRequest.prototype.open : undefined;
    const originalXhrSend = canXhr ? g.XMLHttpRequest.prototype.send : undefined;
    if (canFetch) {
        g.fetch = (async (...args) => {
            var _a, _b, _c;
            const start = now();
            const startPerf = typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : start;
            const id = createId();
            let method;
            let url;
            let requestBody;
            try {
                const [input, init] = args;
                url = coerceUrl(input);
                const reqMethodFromInit = init === null || init === void 0 ? void 0 : init.method;
                const reqMethodFromInput = input && typeof input.method === "string" ? input.method : undefined;
                method = ((_a = reqMethodFromInit !== null && reqMethodFromInit !== void 0 ? reqMethodFromInit : reqMethodFromInput) !== null && _a !== void 0 ? _a : "GET").toUpperCase();
                if (includeBodies && init && "body" in init)
                    requestBody = init.body;
            }
            catch (_d) {
                void 0;
            }
            try {
                const res = await Reflect.apply(originalFetch, globalThis, args);
                const durationMs = (_b = getFetchTimingDurationMs(url, startPerf)) !== null && _b !== void 0 ? _b : (now() - start);
                const status = res.status;
                let responseBody;
                if (includeBodies) {
                    const cloned = res.clone();
                    responseBody = await readResponseBody(cloned, maxBodyLength);
                }
                if (active) {
                    const entry = {
                        id,
                        source: "network",
                        timestamp: Date.now(),
                        method,
                        url,
                        status,
                        durationMs,
                        requestBody: includeBodies ? requestBody : undefined,
                        responseBody: includeBodies ? responseBody : undefined,
                        message: makeMessage({ method, url, status, durationMs }),
                    };
                    options.emit(entry);
                }
                return res;
            }
            catch (err) {
                const durationMs = (_c = getFetchTimingDurationMs(url, startPerf)) !== null && _c !== void 0 ? _c : (now() - start);
                if (active) {
                    const entry = {
                        id,
                        source: "network",
                        timestamp: Date.now(),
                        method,
                        url,
                        status: undefined,
                        durationMs,
                        requestBody: includeBodies ? requestBody : undefined,
                        responseBody: includeBodies ? safeToString(err) : undefined,
                        message: makeMessage({ method, url, status: undefined, durationMs }),
                    };
                    options.emit(entry);
                }
                throw err;
            }
        });
    }
    if (canXhr && originalXhrOpen && originalXhrSend) {
        const proto = g.XMLHttpRequest.prototype;
        const originalOpen = originalXhrOpen;
        const originalSend = originalXhrSend;
        proto.open = function (...args) {
            try {
                const [method, url] = args;
                xhrMeta.set(this, { id: createId(), start: now(), method: safeToString(method).toUpperCase(), url: safeToString(url) });
            }
            catch (_a) {
                xhrMeta.set(this, { id: createId(), start: now() });
            }
            return originalOpen.apply(this, args);
        };
        proto.send = function (...args) {
            var _a;
            const meta = (_a = xhrMeta.get(this)) !== null && _a !== void 0 ? _a : { id: createId(), start: now() };
            if (includeBodies) {
                try {
                    meta.requestBody = args[0];
                }
                catch (_b) {
                    void 0;
                }
            }
            xhrMeta.set(this, meta);
            const onLoadEnd = () => {
                const durationMs = now() - meta.start;
                const status = typeof this.status === "number" ? this.status : undefined;
                let responseBody;
                if (includeBodies) {
                    try {
                        if (typeof this.responseText === "string")
                            responseBody = truncateString(this.responseText, maxBodyLength);
                        else
                            responseBody = undefined;
                    }
                    catch (_a) {
                        responseBody = undefined;
                    }
                }
                if (active) {
                    const entry = {
                        id: meta.id,
                        source: "network",
                        timestamp: Date.now(),
                        method: meta.method,
                        url: meta.url,
                        status,
                        durationMs,
                        requestBody: includeBodies ? meta.requestBody : undefined,
                        responseBody: includeBodies ? responseBody : undefined,
                        message: makeMessage({ method: meta.method, url: meta.url, status, durationMs }),
                    };
                    options.emit(entry);
                }
            };
            try {
                this.addEventListener("loadend", onLoadEnd, { once: true });
            }
            catch (_c) {
                try {
                    this.addEventListener("loadend", onLoadEnd);
                }
                catch (_d) {
                    void 0;
                }
            }
            return originalSend.apply(this, args);
        };
    }
    const uninstall = () => {
        active = false;
        if (canFetch && originalFetch)
            g.fetch = originalFetch;
        if (canXhr && originalXhrOpen && originalXhrSend) {
            g.XMLHttpRequest.prototype.open = originalXhrOpen;
            g.XMLHttpRequest.prototype.send = originalXhrSend;
        }
    };
    return {
        uninstall,
        installed: () => active,
    };
}
