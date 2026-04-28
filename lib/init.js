"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDevInspector = initDevInspector;
const consoleLogger_1 = require("./logger/consoleLogger");
const networkLogger_1 = require("./logger/networkLogger");
const logStorage_1 = require("./storage/logStorage");
const panel_1 = require("./ui/panel");
function getGlobalInstanceKey() {
    return Symbol.for("dev-inspector.instance");
}
function getGlobalBag() {
    return globalThis;
}
function initDevInspector(options = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const key = getGlobalInstanceKey();
    const bag = getGlobalBag();
    const prev = bag[key];
    if (prev) {
        try {
            prev.destroy();
        }
        catch (_o) {
            void 0;
        }
    }
    const storage = new logStorage_1.LogStorage({ maxSize: (_a = options.maxSize) !== null && _a !== void 0 ? _a : 500 });
    const consoleLogger = (0, consoleLogger_1.installConsoleLogger)({ emit: (e) => storage.add(e) });
    const networkLogger = (0, networkLogger_1.installNetworkLogger)({
        emit: (e) => storage.add(e),
        includeBodies: (_c = (_b = options.networkOptions) === null || _b === void 0 ? void 0 : _b.includeBodies) !== null && _c !== void 0 ? _c : false,
        maxBodyLength: (_e = (_d = options.networkOptions) === null || _d === void 0 ? void 0 : _d.maxBodyLength) !== null && _e !== void 0 ? _e : 20000,
    });
    const panel = (0, panel_1.createPanel)({
        storage,
        initiallyOpen: (_g = (_f = options.panelOptions) === null || _f === void 0 ? void 0 : _f.initiallyOpen) !== null && _g !== void 0 ? _g : true,
        title: (_j = (_h = options.panelOptions) === null || _h === void 0 ? void 0 : _h.title) !== null && _j !== void 0 ? _j : "Dev Inspector",
        theme: (_k = options.panelOptions) === null || _k === void 0 ? void 0 : _k.theme,
        persistTheme: (_l = options.panelOptions) === null || _l === void 0 ? void 0 : _l.persistTheme,
        themeStorageKey: (_m = options.panelOptions) === null || _m === void 0 ? void 0 : _m.themeStorageKey,
    });
    const destroy = () => {
        try {
            panel.destroy();
        }
        catch (_a) {
            void 0;
        }
        try {
            consoleLogger.uninstall();
        }
        catch (_b) {
            void 0;
        }
        try {
            networkLogger.uninstall();
        }
        catch (_c) {
            void 0;
        }
    };
    bag[key] = { destroy };
}
