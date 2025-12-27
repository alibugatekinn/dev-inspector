"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogList = createLogList;
function fmtTime(ts) {
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
}
function toneForEntry(entry) {
    if (entry.source === "console") {
        if (entry.level === "error")
            return "error";
        if (entry.level === "warn")
            return "warning";
        return "neutral";
    }
    const s = entry.status;
    if (typeof s !== "number")
        return "error";
    if (s >= 400)
        return "error";
    if (s >= 300)
        return "warning";
    return "success";
}
function classForTone(tone) {
    if (tone === "error")
        return "di-itemToneError";
    if (tone === "warning")
        return "di-itemToneWarning";
    if (tone === "success")
        return "di-itemToneSuccess";
    return "di-itemToneNeutral";
}
function isNetworkFailure(entry) {
    if (entry.source !== "network")
        return false;
    return typeof entry.status !== "number" || entry.status >= 400;
}
function createLogList(doc) {
    const el = doc.createElement("ul");
    el.className = "di-list";
    const append = (entry) => {
        const li = doc.createElement("li");
        const tone = toneForEntry(entry);
        li.className = `di-item ${classForTone(tone)}`;
        const meta = doc.createElement("div");
        meta.className = "di-meta";
        const time = doc.createElement("span");
        time.textContent = fmtTime(entry.timestamp);
        const source = doc.createElement("span");
        source.textContent = entry.source;
        const detail = doc.createElement("span");
        if (entry.source === "console") {
            detail.textContent = entry.level;
        }
        else {
            detail.className = `di-statusChip ${isNetworkFailure(entry) ? "di-statusChipError" : "di-statusChipSuccess"}`;
            detail.textContent = typeof entry.status === "number" ? String(entry.status) : "ERR";
        }
        meta.append(time, source, detail);
        const msg = doc.createElement("div");
        msg.className = "di-msg";
        msg.textContent = entry.message;
        li.append(meta, msg);
        el.append(li);
    };
    const clear = () => {
        el.replaceChildren();
    };
    return { el, append, clear };
}
