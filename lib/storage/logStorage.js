"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LogStorage_logs, _LogStorage_maxSize;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogStorage = void 0;
class LogStorage extends EventTarget {
    constructor(options = {}) {
        var _a;
        super();
        _LogStorage_logs.set(this, []);
        _LogStorage_maxSize.set(this, void 0);
        __classPrivateFieldSet(this, _LogStorage_maxSize, Math.max(1, (_a = options.maxSize) !== null && _a !== void 0 ? _a : 500), "f");
    }
    get maxSize() {
        return __classPrivateFieldGet(this, _LogStorage_maxSize, "f");
    }
    setMaxSize(next) {
        __classPrivateFieldSet(this, _LogStorage_maxSize, Math.max(1, next), "f");
        if (__classPrivateFieldGet(this, _LogStorage_logs, "f").length > __classPrivateFieldGet(this, _LogStorage_maxSize, "f")) {
            __classPrivateFieldSet(this, _LogStorage_logs, __classPrivateFieldGet(this, _LogStorage_logs, "f").slice(__classPrivateFieldGet(this, _LogStorage_logs, "f").length - __classPrivateFieldGet(this, _LogStorage_maxSize, "f")), "f");
        }
    }
    add(entry) {
        __classPrivateFieldGet(this, _LogStorage_logs, "f").push(entry);
        if (__classPrivateFieldGet(this, _LogStorage_logs, "f").length > __classPrivateFieldGet(this, _LogStorage_maxSize, "f")) {
            __classPrivateFieldGet(this, _LogStorage_logs, "f").shift();
        }
        this.dispatchEvent(new CustomEvent("newLog", { detail: entry }));
    }
    clear() {
        if (__classPrivateFieldGet(this, _LogStorage_logs, "f").length === 0)
            return;
        __classPrivateFieldSet(this, _LogStorage_logs, [], "f");
        this.dispatchEvent(new Event("cleared"));
    }
    getAll() {
        return __classPrivateFieldGet(this, _LogStorage_logs, "f").slice();
    }
    size() {
        return __classPrivateFieldGet(this, _LogStorage_logs, "f").length;
    }
    onNewLog(listener) {
        const handler = (ev) => {
            listener(ev.detail);
        };
        this.addEventListener("newLog", handler);
        return () => this.removeEventListener("newLog", handler);
    }
}
exports.LogStorage = LogStorage;
_LogStorage_logs = new WeakMap(), _LogStorage_maxSize = new WeakMap();
