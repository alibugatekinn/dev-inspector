"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installConsoleLogger = installConsoleLogger;
let seq = 0;
function createId() {
    seq += 1;
    return `${Date.now()}-${seq}`;
}
function safeStringify(value) {
    try {
        if (typeof value === "string")
            return value;
        return JSON.stringify(value, getCircularReplacer());
    }
    catch (_a) {
        try {
            return String(value);
        }
        catch (_b) {
            return "[unserializable]";
        }
    }
}
function getCircularReplacer() {
    const seen = new WeakSet();
    return (_key, value) => {
        if (typeof value === "object" && value !== null) {
            const obj = value;
            if (seen.has(obj))
                return "[circular]";
            seen.add(obj);
        }
        return value;
    };
}
function formatArgs(args) {
    const parts = args
        .map((a) => {
        if (a instanceof Error)
            return `${a.name}: ${a.message}`;
        if (typeof a === "object" && a !== null)
            return null;
        return safeStringify(a);
    })
        .filter((x) => typeof x === "string" && x.length > 0);
    return parts.join(" ");
}
function installConsoleLogger(options) {
    var _a;
    const levels = (_a = options.levels) !== null && _a !== void 0 ? _a : ["log", "info", "warn", "error", "debug"];
    const originals = new Map();
    let active = true;
    const installOne = (level) => {
        const original = console[level];
        originals.set(level, original);
        const wrapped = (...args) => {
            if (active) {
                const entry = {
                    id: createId(),
                    source: "console",
                    level,
                    timestamp: Date.now(),
                    args,
                    message: formatArgs(args),
                };
                options.emit(entry);
            }
            return original.apply(console, args);
        };
        console[level] = wrapped;
    };
    levels.forEach(installOne);
    const uninstall = () => {
        active = false;
        for (const [level, original] of originals.entries()) {
            console[level] = original;
        }
        originals.clear();
    };
    return {
        uninstall,
        installed: () => active,
    };
}
