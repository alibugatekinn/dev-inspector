"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderAny = renderAny;
exports.createJsonViewer = createJsonViewer;
function isObject(value) {
    return typeof value === "object" && value !== null;
}
function typeLabel(value) {
    if (value === null)
        return "null";
    const t = typeof value;
    if (t !== "object")
        return t;
    if (Array.isArray(value))
        return `Array(${value.length})`;
    const tag = Object.prototype.toString.call(value);
    return tag.slice(8, -1) || "Object";
}
function shortPreview(value) {
    if (value === null)
        return "null";
    if (typeof value === "string") {
        const s = value.length > 120 ? `${value.slice(0, 120)}…` : value;
        return JSON.stringify(s);
    }
    if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint")
        return String(value);
    if (typeof value === "undefined")
        return "undefined";
    if (typeof value === "function")
        return "function";
    if (typeof value === "symbol")
        return "symbol";
    if (typeof value === "object") {
        if (Array.isArray(value))
            return `Array(${value.length})`;
        return "Object";
    }
    return String(value);
}
function canExpand(value) {
    if (!isObject(value))
        return false;
    if (value instanceof Date)
        return false;
    if (value instanceof RegExp)
        return false;
    return true;
}
function row(doc, key, valueEl) {
    const el = doc.createElement("div");
    el.className = "di-jsonRow";
    const k = doc.createElement("span");
    k.className = "di-jsonKey";
    k.textContent = key;
    el.append(k, valueEl);
    return el;
}
function leaf(ctx, value) {
    const el = ctx.doc.createElement("span");
    el.className = "di-jsonValue";
    el.textContent = shortPreview(value);
    return el;
}
function renderObject(ctx, value, depth) {
    if (!isObject(value))
        return leaf(ctx, value);
    if (!canExpand(value))
        return leaf(ctx, value);
    if (ctx.nodes >= ctx.maxNodes) {
        const el = ctx.doc.createElement("span");
        el.className = "di-jsonValue";
        el.textContent = "[truncated]";
        return el;
    }
    const obj = value;
    if (ctx.seen.has(obj)) {
        const el = ctx.doc.createElement("span");
        el.className = "di-jsonValue";
        el.textContent = "[circular]";
        return el;
    }
    ctx.seen.add(obj);
    ctx.nodes += 1;
    const details = ctx.doc.createElement("details");
    details.className = "di-jsonNode";
    details.open = depth === 0;
    const summary = ctx.doc.createElement("summary");
    summary.className = "di-jsonSummary";
    summary.textContent = `${typeLabel(value)} ${shortPreview(value)}`;
    details.append(summary);
    if (depth >= ctx.maxDepth) {
        const el = ctx.doc.createElement("div");
        el.className = "di-jsonBody";
        const msg = ctx.doc.createElement("div");
        msg.className = "di-jsonTrunc";
        msg.textContent = "Max depth reached";
        el.append(msg);
        details.append(el);
        return details;
    }
    const body = ctx.doc.createElement("div");
    body.className = "di-jsonBody";
    if (Array.isArray(value)) {
        const arr = value;
        const limit = Math.min(arr.length, ctx.maxKeys);
        for (let i = 0; i < limit; i += 1) {
            const v = arr[i];
            body.append(row(ctx.doc, String(i), renderAny(ctx, v, depth + 1)));
        }
        if (arr.length > limit) {
            const more = ctx.doc.createElement("div");
            more.className = "di-jsonMore";
            more.textContent = `… +${arr.length - limit} more`;
            body.append(more);
        }
    }
    else {
        const rec = value;
        const keys = Object.keys(rec);
        const limit = Math.min(keys.length, ctx.maxKeys);
        for (let i = 0; i < limit; i += 1) {
            const k = keys[i];
            const v = rec[k];
            body.append(row(ctx.doc, k, renderAny(ctx, v, depth + 1)));
        }
        if (keys.length > limit) {
            const more = ctx.doc.createElement("div");
            more.className = "di-jsonMore";
            more.textContent = `… +${keys.length - limit} more`;
            body.append(more);
        }
    }
    details.append(body);
    return details;
}
function renderAny(ctx, value, depth) {
    if (!canExpand(value))
        return leaf(ctx, value);
    return renderObject(ctx, value, depth);
}
function createJsonViewer(doc, value, options = {}) {
    var _a, _b, _c;
    const ctx = {
        doc,
        seen: new WeakSet(),
        nodes: 0,
        maxDepth: Math.max(1, (_a = options.maxDepth) !== null && _a !== void 0 ? _a : 6),
        maxKeys: Math.max(10, (_b = options.maxKeys) !== null && _b !== void 0 ? _b : 200),
        maxNodes: Math.max(50, (_c = options.maxNodes) !== null && _c !== void 0 ? _c : 2000),
    };
    const root = doc.createElement("div");
    root.className = "di-jsonRoot";
    root.append(renderAny(ctx, value, 0));
    return root;
}
